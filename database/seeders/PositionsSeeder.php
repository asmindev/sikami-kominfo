<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Position;

class PositionsSeeder extends Seeder
{
    public function run(): void
    {
        $positions = [
            ['name' => 'Kepala Dinas', 'description' => 'Pimpinan tertinggi Dinas Kominfo'],
            ['name' => 'Sekretaris', 'description' => 'Sekretaris Dinas Kominfo'],
            ['name' => 'Kepala Bidang', 'description' => 'Kepala Bidang di Dinas Kominfo'],
            ['name' => 'Staf', 'description' => 'Staf pelaksana'],
        ];

        foreach ($positions as $item) {
            Position::firstOrCreate(['name' => $item['name']], $item);
        }
    }
}
