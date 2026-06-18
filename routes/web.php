<?php

use App\Http\Controllers\CallController;
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

        Route::inertia('settings', 'settings')->name('settings');
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
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
