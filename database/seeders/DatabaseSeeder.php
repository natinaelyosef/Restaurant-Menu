<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Super Admin if not exists
        User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'is_active' => true,
                'status' => 'active',
            ]
        );

        // Create a sample Sub-Admin for testing
        User::firstOrCreate(
            ['email' => 'subadmin@example.com'],
            [
                'name' => 'Sub Admin',
                'email' => 'subadmin@example.com',
                'password' => Hash::make('password'),
                'role' => 'sub_admin',
                'is_active' => true,
                'status' => 'active',
            ]
        );

        // Create a sample Customer for testing
        User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'John Customer',
                'email' => 'customer@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_active' => true,
                'status' => 'active',
            ]
        );

        $this->command->info('✅ Super Admin created: superadmin@example.com / password');
        $this->command->info('✅ Sub Admin created: subadmin@example.com / password');
        $this->command->info('✅ Customer created: customer@example.com / password');
    }
}
