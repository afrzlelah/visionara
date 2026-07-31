<?php

namespace App\Http\Controllers;

use App\Events\CallAccepted;
use App\Events\CallDeclined;
use App\Events\CallEnded;
use App\Events\IncomingCallReceived;
use App\Models\Call;
use App\Services\CallService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Peterujah\Agora\Agora;
use Peterujah\Agora\Builders\RtcToken;
use Peterujah\Agora\Roles;
use Peterujah\Agora\User;

class CallController extends Controller
{
    protected CallService $callService;

    public function __construct(CallService $callService)
    {
        $this->callService = $callService;
    }

    /**
     * Initiate a call.
     *
     * The backend selects a volunteer automatically.
     * Frontend sends an optional list of online volunteer IDs (from presence channel).
     * If the selected volunteer is busy, the system automatically tries the next one.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'online_volunteer_ids' => 'sometimes|array',
            'online_volunteer_ids.*' => 'integer|exists:users,id',
        ]);

        $onlineIds = $request->input('online_volunteer_ids', []);
        $callerId = auth()->id();

        // Delegate volunteer selection + call creation to the service
        $call = $this->callService->assignVolunteer($callerId, $onlineIds);

        if (! $call) {
            return response()->json([
                'error' => 'all_volunteers_busy',
                'message' => 'Semua volunteer sedang tidak tersedia. Silakan coba beberapa menit lagi.',
            ], 409);
        }

        return response()->json([
            'message' => 'Call initiated successfully.',
            'call' => $call->load('receiver'),
        ], 201);
    }

    /**
     * Accept an incoming call (volunteer only).
     */
    public function accept(Call $call): JsonResponse
    {
        if ((int) $call->receiver_id !== (int) auth()->id()) {
            return response()->json(['error' => 'unauthorized'], 403);
        }

        $success = DB::transaction(function () use ($call) {
            $lockedCall = Call::where('id', $call->id)->lockForUpdate()->first();

            if (! $lockedCall || $lockedCall->status !== Call::STATUS_PENDING) {
                return false;
            }

            $lockedCall->update([
                'status' => Call::STATUS_ACCEPTED,
                'accepted_at' => now(),
            ]);

            return true;
        });

        if (! $success) {
            return response()->json(['error' => 'invalid_state'], 422);
        }

        // Refresh the call to get updated status
        $call->refresh();

        try {
            broadcast(new CallAccepted($call))->toOthers();
        } catch (\Exception $e) {
            Log::warning('Failed to broadcast CallAccepted: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Call accepted successfully.',
            'call' => $call->load('caller'),
        ]);
    }

    /**
     * Decline an incoming call (volunteer only).
     *
     * IMPORTANT: When a volunteer declines, the system automatically
     * tries to assign the call to another available volunteer.
     * The support seeker does NOT see "declined" — they just keep
     * seeing "Mencari volunteer..." until someone accepts or all are exhausted.
     */
    public function decline(Call $call, Request $request): JsonResponse
    {
        if ((int) $call->receiver_id !== (int) auth()->id()) {
            return response()->json(['error' => 'unauthorized'], 403);
        }

        // Only pending calls can be declined
        $lockedCall = DB::transaction(function () use ($call) {
            $locked = Call::where('id', $call->id)->lockForUpdate()->first();

            if (! $locked || $locked->status !== Call::STATUS_PENDING) {
                return null;
            }

            $locked->update(['status' => Call::STATUS_DECLINED]);

            return $locked;
        });

        if (! $lockedCall) {
            return response()->json(['error' => 'invalid_state'], 422);
        }

        // DO NOT broadcast CallDeclined to the caller.
        // Instead, automatically try to reassign to another volunteer.
        $onlineIds = $request->input('online_volunteer_ids', []);
        $newCall = $this->callService->reassignVolunteer($call->fresh(), Call::STATUS_DECLINED, $onlineIds);

        if ($newCall) {
            // A new volunteer has been found — the caller's state stays "calling"
            // They will receive IncomingCallReceived broadcast (handled inside reassignVolunteer)
            return response()->json([
                'message' => 'Declined. Reassigned to another volunteer.',
                'new_call' => $newCall->load('receiver'),
            ]);
        }

        // No other volunteer available — NOW broadcast declined to the caller
        try {
            broadcast(new CallDeclined($call));
        } catch (\Exception $e) {
            Log::warning('Failed to broadcast CallDeclined: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Declined. No other volunteers available.',
            'call' => $call,
        ]);
    }

    /**
     * End an active call (either participant can call this).
     *
     * Sets status to completed, records ended_at, and broadcasts
     * CallEnded to BOTH participants so both sides return to idle.
     */
    public function end(Call $call): JsonResponse
    {
        // Only participants may end the call
        if (! in_array((int) auth()->id(), [(int) $call->caller_id, (int) $call->receiver_id])) {
            return response()->json(['error' => 'unauthorized'], 403);
        }

        // Only active calls can be ended (pending or accepted)
        if (! in_array($call->status, [Call::STATUS_PENDING, Call::STATUS_ACCEPTED])) {
            return response()->json(['error' => 'call_already_ended'], 422);
        }

        $call->update([
            'status' => Call::STATUS_COMPLETED,
            'ended_at' => now(),
        ]);

        try {
            broadcast(new CallEnded($call));
        } catch (\Exception $e) {
            Log::warning('Failed to broadcast CallEnded: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Call ended successfully.',
            'call' => $call,
        ]);
    }

    /**
     * Generate an Agora token for a call (for the authenticated user).
     */
    public function token(Call $call): JsonResponse
    {
        $userId = (int) auth()->id();
        $appId = env('AGORA_APP_ID');
        $appCertificate = env('AGORA_APP_CERTIFICATE');

        if (! $appId || ! $appCertificate) {
            return response()->json(['error' => 'Agora credentials missing'], 500);
        }

        $expirationInSeconds = 3600;

        // Initialize Agora client
        $agora = new Agora($appId, $appCertificate);
        $agora->setExpiration(time() + $expirationInSeconds);

        $channel = $call->room_name;
        $uid = $userId;

        // Prepare user object for token generation
        $user = new User($uid);
        $user->setChannel($channel);
        $user->setRole(Roles::RTC_PUBLISHER);
        $user->setPrivilegeExpire(time() + $expirationInSeconds);

        // Build token
        $token = RtcToken::buildTokenWithUid($agora, $user);

        return response()->json([
            'appId' => $appId,
            'channel' => $channel,
            'uid' => $uid,
            'token' => $token,
        ]);
    }
}
