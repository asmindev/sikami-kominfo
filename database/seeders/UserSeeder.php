<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@sikami.test'],
            [
                'name' => 'Admin SIKAMI',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('admin');

        // 2. Create 3 Leaders (Pimpinan)
        for ($i = 1; $i <= 3; $i++) {
            $leader = User::firstOrCreate(
                ['email' => "pimpinan{$i}@sikami.test"],
                [
                    'name' => "Pimpinan SIKAMI {$i}",
                    'password' => Hash::make('password'),
                ]
            );
            $leader->assignRole('leader');
        }
    }
}
