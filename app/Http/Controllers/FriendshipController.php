<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FriendshipController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = collect();
        if ($search) {
            $currentUserId = auth()->id();

            // Get IDs of users who are already friends or have pending requests
            $existingRelations = Friendship::where('user_id', $currentUserId)
                ->orWhere('friend_id', $currentUserId)
                ->get()
                ->flatMap(function ($f) {
                    return [$f->user_id, $f->friend_id];
                })
                ->filter(fn ($id) => $id != $currentUserId)
                ->unique();

            $users = User::where('id', '!=', $currentUserId)
                ->whereNotIn('id', $existingRelations)
                ->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->limit(20)
                ->get();
        }

        return Inertia::render('profile/friends/add', [
            'users' => $users,
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'friend_id' => ['required', 'exists:users,id'],
        ]);

        $friendId = $validated['friend_id'];
        $userId = auth()->id();

        if ($friendId == $userId) {
            return back()->with('error', 'You cannot friend yourself.');
        }

        // Check if relation already exists
        $existing = Friendship::where(function ($q) use ($userId, $friendId) {
            $q->where('user_id', $userId)->where('friend_id', $friendId);
        })->orWhere(function ($q) use ($userId, $friendId) {
            $q->where('user_id', $friendId)->where('friend_id', $userId);
        })->first();

        if ($existing) {
            return back()->with('error', 'Friendship or request already exists.');
        }

        Friendship::create([
            'user_id' => $userId,
            'friend_id' => $friendId,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Friend request sent.');
    }

    public function accept(Friendship $friendship)
    {
        if ($friendship->friend_id !== auth()->id()) {
            abort(403);
        }

        $friendship->update(['status' => 'accepted']);

        return back()->with('success', 'Friend request accepted.');
    }

    public function decline(Friendship $friendship)
    {
        if ($friendship->friend_id !== auth()->id()) {
            abort(403);
        }

        $friendship->delete();

        return back()->with('success', 'Friend request declined.');
    }

    public function destroy(User $friend)
    {
        $userId = auth()->id();

        Friendship::where(function ($q) use ($userId, $friend) {
            $q->where('user_id', $userId)->where('friend_id', $friend->id);
        })->orWhere(function ($q) use ($userId, $friend) {
            $q->where('user_id', $friend->id)->where('friend_id', $userId);
        })->delete();

        return back()->with('success', 'Friend removed.');
    }
}
