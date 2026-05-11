<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin (tanpa nip/position)
        $admin = User::firstOrCreate(
            ['email' => 'admin@sikami.test'],
            [
                'name' => 'Admin SIKAMI',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('admin');

        // Ambil posisi
        $positions = [
            'Kepala Dinas' => \App\Models\Position::where('name', 'Kepala Dinas')->first(),
            'Sekretaris' => \App\Models\Position::where('name', 'Sekretaris')->first(),
            'Kepala Bidang' => \App\Models\Position::where('name', 'Kepala Bidang')->first(),
            'Staf' => \App\Models\Position::where('name', 'Staf')->first(),
        ];

        // 2. Create 3 Leaders (Pimpinan)
        for ($i = 1; $i <= 3; $i++) {
            $leader = User::firstOrCreate(
                ['email' => "pimpinan{$i}@sikami.test"],
                [
                    'name' => "Pimpinan SIKAMI {$i}",
                    'password' => Hash::make('password'),
                    'nip' => '1980001' . $i,
                    'position_id' => $positions['Kepala Dinas']->id ?? null,
                ]
            );
            $leader->assignRole('leader');
        }

        // 3. Create 3 Employees (referensi, role employee, nip & position wajib)
        for ($i = 1; $i <= 3; $i++) {
            $employee = User::firstOrCreate(
                ['email' => "pegawai{$i}@sikami.test"],
                [
                    'name' => "Pegawai SIKAMI {$i}",
                    'password' => Hash::make('password'),
                    'nip' => '1977001' . $i,
                    'position_id' => $positions['Staf']->id ?? null,
                ]
            );
            $employee->assignRole('employee');
        }
    }
}
