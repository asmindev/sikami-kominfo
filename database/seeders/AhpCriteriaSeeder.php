<?php

namespace Database\Seeders;

use App\Models\AhpCriteria;
use Illuminate\Database\Seeder;

class AhpCriteriaSeeder extends Seeder
{
    public function run(): void
    {
        $criteria = [
            ['name' => 'Tata Kelola Keamanan Informasi', 'code' => 'governance', 'order' => 1],
            ['name' => 'Pengelolaan Risiko Keamanan Informasi', 'code' => 'risk_management', 'order' => 2],
            ['name' => 'Kerangka Kerja Keamanan Informasi', 'code' => 'framework', 'order' => 3],
            ['name' => 'Pengelolaan Aset Informasi', 'code' => 'asset_management', 'order' => 4],
            ['name' => 'Teknologi & Keamanan Informasi', 'code' => 'technology', 'order' => 5],
        ];

        foreach ($criteria as $item) {
            AhpCriteria::firstOrCreate(['code' => $item['code']], $item);
        }
    }
}
