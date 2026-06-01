<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    Route::middleware(['web', 'auth', 'admin'])->group(function () {
        Route::get('/test-admin-route', function () {
            return 'admin access';
        });
    });
});

test('non-admin users (difabel) are forbidden from accessing admin routes', function () {
    $user = User::factory()->create(['role' => 'difabel']);

    $response = $this->actingAs($user)->get('/test-admin-route');

    $response->assertStatus(403);
});

test('volunteer users are forbidden from accessing admin routes', function () {
    $user = User::factory()->create(['role' => 'volunteer']);

    $response = $this->actingAs($user)->get('/test-admin-route');

    $response->assertStatus(403);
});

test('admin users can access admin routes', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($user)->get('/test-admin-route');

    $response->assertOk();
    expect($response->getContent())->toBe('admin access');
});
