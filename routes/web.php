<?php

use App\Http\Controllers\CallController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('privacy-policy', 'privacy-policy')->name('privacy-policy');

Route::middleware(['auth', 'verified'])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');

        // Profile routes
        Route::inertia('profile', 'profile')->name('profile');
        Route::get('profile/edit', [ProfileController::class, 'edit'])->name('user-profile.edit');
        Route::put('profile', [ProfileController::class, 'update'])->name('user-profile.update');
        Route::get('profile/share', [ProfileController::class, 'share'])->name('user-profile.share');
        Route::get('profile/friends', [ProfileController::class, 'friends'])->name('user-profile.friends');

        // Friendship routes
        Route::get('profile/friends/add', [FriendshipController::class, 'index'])->name('friendships.index');
        Route::post('profile/friends', [FriendshipController::class, 'store'])->name('friendships.store');
        Route::post('profile/friends/{friendship}/accept', [FriendshipController::class, 'accept'])->name('friendships.accept');
        Route::post('profile/friends/{friendship}/decline', [FriendshipController::class, 'decline'])->name('friendships.decline');
        Route::delete('profile/friends/{friend}', [FriendshipController::class, 'destroy'])->name('friendships.destroy');

        Route::inertia('settings', 'settings')->name('settings');
        Route::inertia('chat', 'chat')->name('chat');
        Route::get('call', function () {
            return inertia('call', [
                'role' => Auth::user()->role,
            ]);
        })->name('call');

        Route::post('calls', [CallController::class, 'store'])->name('calls.store');
        Route::post('calls/{call}/accept', [CallController::class, 'accept'])->name('calls.accept');
        Route::post('calls/{call}/decline', [CallController::class, 'decline'])->name('calls.decline');
        Route::post('calls/{call}/end', [CallController::class, 'end'])->name('calls.end');
        Route::post('calls/{call}/signal', [CallController::class, 'signal'])->name('calls.signal');

        // AI Vision
        Route::post('/api/analyze-image', [App\Http\Controllers\AiVisionController::class, 'analyze'])->name('api.analyze-image');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
