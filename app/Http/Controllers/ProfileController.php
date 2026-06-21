<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('profile/edit');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'age' => ['nullable', 'integer', 'min:1'],
            'gender' => ['nullable', 'string', 'in:Male,Female'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'photo' => ['nullable', 'image', 'max:5120'], // 5MB max
        ]);

        $user = auth()->user();

        $updateData = [
            'name' => $validated['name'],
            'age' => $validated['age'],
            'gender' => $validated['gender'],
            'bio' => $validated['bio'],
        ];

        if ($request->hasFile('photo')) {
            if ($user->photo_url) {
                // Extract the path from the URL
                $path = preg_replace('/.*\/storage\//', '', $user->photo_url);
                Storage::disk('public')->delete($path);
            }

            $path = $request->file('photo')->store('profile-photos', 'public');
            $updateData['photo_url'] = '/storage/' . $path;
        }

        $user->update($updateData);

        return redirect('/profile')->with('success', 'Profile updated successfully.');
    }

    public function share()
    {
        return Inertia::render('profile/share');
    }

    public function friends()
    {
        $user = auth()->user();

        $friends = $user->friends->map(function ($friend) {
            return [
                'id' => $friend->id,
                'name' => $friend->name,
                'photo' => $friend->photo_url ?: 'https://api.dicebear.com/7.x/avataaars/svg?seed='.$friend->name,
            ];
        });

        // Incoming requests
        $requests = $user->pendingFriendRequestsReceived()->with('user')->get()->map(function ($request) {
            return [
                'id' => $request->id, // Friendship ID
                'user' => [
                    'id' => $request->user->id,
                    'name' => $request->user->name,
                    'photo' => $request->user->photo_url ?: 'https://api.dicebear.com/7.x/avataaars/svg?seed='.$request->user->name,
                ],
            ];
        });

        return Inertia::render('profile/friends', [
            'friends' => $friends,
            'requests' => $requests,
        ]);
    }
}
