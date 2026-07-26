<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run the roles and permissions seeder
        $this->call(RolesAndPermissionsSeeder::class);

        // Create or update admin user
        $admin = User::updateOrCreate(
            ['email' => 'g.nanguti@gmail.com'],
            [
                'name' => 'Kevin Wanyonyi',
                'password' => bcrypt('123123123'),
                'created_by' => null,
                'updated_by' => null,
            ]
        );
        $admin->assignRole('admin');

        // Create test user for development
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]
        )->assignRole('user');
    }
}
