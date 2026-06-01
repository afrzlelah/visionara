<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed a Difabel User
        User::factory()->create([
            'name' => 'Difabel User',
            'email' => 'difabel@example.com',
            'role' => 'difabel',
        ]);

        // Seed a Volunteer User
        User::factory()->create([
            'name' => 'Volunteer User',
            'email' => 'volunteer@example.com',
            'role' => 'volunteer',
        ]);

        // Seed an Admin User
        User::factory()->create([
            'name' => 'Atmin',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);
    }
}
