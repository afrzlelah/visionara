<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register as difabel', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '081234567890',
        'support_type' => 'Bantuan Navigasi / Jalan',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'difabel',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertAuthenticated();

    $user = User::where('email', 'test@example.com')->first();
    expect($user->role)->toBe('difabel');

    $response->assertRedirect(route('dashboard'));
});

test('new users can register as volunteer', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Volunteer User',
        'email' => 'volunteer@example.com',
        'phone' => '081234567891',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'volunteer',
    ]);

    $this->assertAuthenticated();

    $user = User::where('email', 'volunteer@example.com')->first();
    expect($user->role)->toBe('volunteer');

    $response->assertRedirect(route('dashboard'));
});

test('users cannot register as admin', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'phone' => '081234567892',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'admin',
    ]);

    $this->assertGuest();

    $response->assertSessionHasErrors(['role']);
});