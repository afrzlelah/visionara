<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('privacy-policy', 'privacy-policy')->name('privacy-policy');

Route::middleware(['auth', 'verified'])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
        Route::inertia('profile', 'profile')->name('profile');
        Route::inertia('settings', 'settings')->name('settings');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
