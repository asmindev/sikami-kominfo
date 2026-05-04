<?php

namespace App\Services;

use App\Models\User;
use App\Models\KamiIndex;
use App\Models\DomainScore;
use App\Models\AhpResult;

class KamiService
{
    /**
     * KAMI Index Categories (from thesis Table 2.1)
     */
    public function getCategory(float $totalScore, string $systemType = 'TINGGI'): string
    {
        $systemType = strtoupper($systemType);

        if ($systemType === 'TINGGI') {
            if ($totalScore <= 387) return 'not_eligible';
            if ($totalScore <= 646) return 'basic_framework';
            if ($totalScore <= 828) return 'good_enough';
            return 'good';
        }

        // RENDAH
        if ($totalScore <= 247) return 'not_eligible';
        if ($totalScore <= 443) return 'basic_framework';
        if ($totalScore <= 760) return 'good_enough';
        return 'good';
    }

    public function calculateKamiAndAhp(User $user, string $systemType)
    {
        // 1. Ambil bobot AHP (dari testing sebelumnya)
        $ahpResults = AhpResult::with('criteria')->get();
        if ($ahpResults->isEmpty()) {
            throw new \Exception("Bobot AHP belum dihitung. Silakan selesaikan matriks AHP terlebih dahulu.");
        }

        // Karena fitur ini masih testing (dan jawaban kuesioner mungkin masih kosong),
        // Kita akan melakukan simulasi skor dummy berdasarkan bobot AHP.
        $totalScore = 0;
        $domainScoresData = [];

        foreach ($ahpResults as $result) {
            $domainName = $result->criteria->name;
            $ahpWeight = (float) $result->weight;

            // Simulasi skor per domain (Random antara 50 - 150)
            // Di implementasi aslinya, ini didapat dari total answers kuesioner per domain
            $rawDomainScore = rand(50, 150);
            $finalScore = $rawDomainScore * $ahpWeight;

            $totalScore += $finalScore;

            $domainScoresData[] = [
                'domain_name' => $domainName,
                'domain_score' => $rawDomainScore,
                'ahp_weight' => $ahpWeight,
                'final_score' => $finalScore,
            ];
        }

        // Simpan Hasil ke DB
        $kamiIndex = KamiIndex::create([
            'user_id' => $user->id,
            'total_score' => $totalScore,
            'category' => $this->getCategory($totalScore, $systemType),
            'calculated_at' => now(),
        ]);

        foreach ($domainScoresData as $data) {
            DomainScore::create(array_merge($data, ['kami_index_id' => $kamiIndex->id]));
        }

        return $kamiIndex;
    }
}
