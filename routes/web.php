<?php

use App\Http\Controllers\CallController;
use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('privacy-policy', 'privacy-policy')->name('privacy-policy');

Route::middleware(['auth', 'verified'])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
        Route::inertia('profile', 'profile')->name('profile');
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
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
