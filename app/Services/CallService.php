<?php

namespace App\Services;

use App\Events\IncomingCallReceived;
use App\Models\Call;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CallService
{
    /**
     * Try to assign an online volunteer to a new call.
     *
     * Since the app uses Presence Channels (not a DB column) for online status,
     * we accept an array of online volunteer IDs from the frontend/controller.
     * If empty, we fall back to all volunteers ordered by last_call_at.
     *
     * @param  int  $callerId  The support seeker's user ID
     * @param  array<int>  $onlineVolunteerIds  IDs of volunteers currently online (from presence channel)
     * @return Call|null The created call, or null if no volunteer is available
     */
    public function assignVolunteer(int $callerId, array $onlineVolunteerIds = []): ?Call
    {
        $query = User::where('role', 'volunteer')
            ->where('id', '!=', $callerId);

        // If we have online volunteer IDs from the presence channel, filter by them
        if (! empty($onlineVolunteerIds)) {
            $query->whereIn('id', $onlineVolunteerIds);
        }

        // Order by least-recently-called first, then random tie-breaker
        $candidates = $query
            ->orderByRaw('COALESCE(last_call_at, ?) ASC', ['1970-01-01 00:00:00'])
            ->inRandomOrder()
            ->get();

        foreach ($candidates as $volunteer) {
            $call = DB::transaction(function () use ($callerId, $volunteer) {
                // Lock the volunteer row to prevent race conditions
                $lockedVol = User::where('id', $volunteer->id)->lockForUpdate()->first();
                if (! $lockedVol) {
                    return null;
                }

                // Check if volunteer has any active (non-stale) call
                $busy = Call::where('receiver_id', $volunteer->id)
                    ->active()
                    ->lockForUpdate()
                    ->exists();

                if ($busy) {
                    return null; // try next volunteer
                }

                // Create the call
                $newCall = Call::create([
                    'caller_id' => $callerId,
                    'receiver_id' => $volunteer->id,
                    'status' => Call::STATUS_PENDING,
                    'room_name' => 'optira-'.Str::uuid(),
                ]);

                // Update distribution marker
                $lockedVol->update(['last_call_at' => now()]);

                return $newCall;
            });

            if ($call) {
                // Broadcast to the selected volunteer
                broadcast(new IncomingCallReceived($call))->toOthers();

                return $call;
            }
        }

        return null; // all volunteers busy or none available
    }

    /**
     * Reassign a call when the current volunteer declines, times out, or fails.
     *
     * The old call is marked as missed/declined.
     * A brand-new call is created with the same caller and sent to the next available volunteer.
     *
     * @param  Call  $oldCall  The call that was declined/timed-out
     * @param  string  $reason  The new status for the old call (e.g. 'declined', 'missed', 'failed')
     * @param  array<int>  $onlineVolunteerIds  Currently online volunteer IDs
     * @return Call|null The newly created call, or null if no volunteer available
     */
    public function reassignVolunteer(Call $oldCall, string $reason = 'declined', array $onlineVolunteerIds = []): ?Call
    {
        // Mark old call with the appropriate final status
        $oldCall->update(['status' => $reason]);

        // Attempt to assign a new volunteer (excluding the one who just declined)
        $callerId = $oldCall->caller_id;

        $query = User::where('role', 'volunteer')
            ->where('id', '!=', $callerId)
            ->where('id', '!=', $oldCall->receiver_id); // exclude the volunteer who just declined

        if (! empty($onlineVolunteerIds)) {
            // Also exclude the declined volunteer from the online list
            $filteredIds = array_filter($onlineVolunteerIds, fn ($id) => (int) $id !== (int) $oldCall->receiver_id);
            if (empty($filteredIds)) {
                return null; // No other online volunteers available
            }
            $query->whereIn('id', $filteredIds);
        }

        $candidates = $query
            ->orderByRaw('COALESCE(last_call_at, ?) ASC', ['1970-01-01 00:00:00'])
            ->inRandomOrder()
            ->get();

        foreach ($candidates as $volunteer) {
            $newCall = DB::transaction(function () use ($callerId, $volunteer, $oldCall) {
                $lockedVol = User::where('id', $volunteer->id)->lockForUpdate()->first();
                if (! $lockedVol) {
                    return null;
                }

                $busy = Call::where('receiver_id', $volunteer->id)
                    ->active()
                    ->lockForUpdate()
                    ->exists();

                if ($busy) {
                    return null;
                }

                $call = Call::create([
                    'caller_id' => $callerId,
                    'receiver_id' => $volunteer->id,
                    'status' => Call::STATUS_PENDING,
                    'room_name' => $oldCall->room_name, // reuse room name for continuity
                ]);

                $lockedVol->update(['last_call_at' => now()]);

                return $call;
            });

            if ($newCall) {
                broadcast(new IncomingCallReceived($newCall))->toOthers();

                return $newCall;
            }
        }

        return null;
    }
}
