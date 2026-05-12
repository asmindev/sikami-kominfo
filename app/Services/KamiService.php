<?php

namespace App\Services;

use App\Models\AhpResult;
use App\Models\Answer;
use App\Models\DomainScore;
use App\Models\KamiIndex;
use App\Models\Questionnaire;
use App\Models\User;

class KamiService
{
    /**
     * Skala jawaban kuesioner KAMI:
     *   0 = Tidak Dilakukan
     *   1 = Dalam Perencanaan
     *   2 = Diterapkan Sebagian
     *   3 = Diterapkan Menyeluruh
     *
     * Skor aktual per pertanyaan = score × score_weight (dari tabel questions)
     * Contoh: jawaban 3 pada Level 2 (weight=6) → actual = 3 × 6 = 18
     */

    /**
     * Threshold kategori KAMI berdasarkan Tabel 2.1 skripsi.
     * Setiap tipe sistem elektronik punya 3 batas: [not_eligible, basic_framework, good_enough]
     * Jika total_score > batas ke-3 maka kategori = 'good'
     */
    private array $thresholds = [
        'RENDAH' => [247, 443, 760],
        'TINGGI' => [387, 646, 828],
        'STRATEGIS' => [472, 760, 864],
    ];

    public function getCategory(float $totalScore, string $systemType = 'TINGGI'): string
    {
        $limits = $this->thresholds[strtoupper($systemType)]
            ?? $this->thresholds['TINGGI'];

        if ($totalScore <= $limits[0]) {
            return 'not_eligible';
        }
        if ($totalScore <= $limits[1]) {
            return 'basic_framework';
        }
        if ($totalScore <= $limits[2]) {
            return 'good_enough';
        }

        return 'good';
    }

    /**
     * Periksa apakah pertanyaan Level 3 boleh dihitung skornya.
     *
     * Aturan: Level 3 hanya eligible jika SEMUA jawaban Level 1 bernilai
     * "Diterapkan Sebagian" (2) atau "Diterapkan Menyeluruh" (3),
     * dengan toleransi maksimal 2 jawaban "Diterapkan Sebagian".
     *
     * Artinya: tidak boleh ada satu pun jawaban 0 (Tidak Dilakukan)
     * atau 1 (Dalam Perencanaan) di Level 1.
     */
    private function isLevel3Eligible(array $level1Scores): bool
    {
        foreach ($level1Scores as $score) {
            // Jawaban 0 atau 1 langsung mendiskualifikasi Level 3
            if ($score < 2) {
                return false;
            }
        }

        // Hitung berapa yang hanya "Diterapkan Sebagian" (score = 2)
        $partialCount = count(array_filter($level1Scores, fn ($s) => $s === 2));

        // Toleransi: maksimal 2 jawaban sebagian
        return $partialCount <= 2;
    }

    /**
     * Hitung Indeks KAMI untuk seorang leader berdasarkan jawaban kuesionernya
     * dan bobot AHP yang sudah tersimpan.
     *
     * Formula per domain:
     *   domain_score = Σ (score × score_weight) untuk semua jawaban yang eligible
     *   final_score  = domain_score × ahp_weight
     *
     * Total Indeks KAMI = Σ final_score semua domain
     */
    public function calculateKamiAndAhp(User $user, string $systemType): KamiIndex
    {
        // 1. Pastikan kuesioner sudah di-submit
        $questionnaire = Questionnaire::where('user_id', $user->id)
            ->whereNotNull('submitted_at')
            ->latest()
            ->first();

        if (! $questionnaire) {
            throw new \RuntimeException('Pimpinan belum mengisi atau mengirim kuesioner.');
        }

        // 2. Pastikan bobot AHP sudah dihitung dan konsisten (CR ≤ 0.1)
        $ahpResults = AhpResult::with('criteria')
            ->where('is_consistent', true)
            ->get();

        if ($ahpResults->isEmpty()) {
            throw new \RuntimeException('Bobot AHP belum dihitung atau belum konsisten (CR > 0.1).');
        }

        // 3. Hapus semua hasil lama jika ada — satu leader satu hasil aktif
        KamiIndex::where('user_id', $user->id)->delete();

        // 4. Ambil semua jawaban beserta data pertanyaan (domain, maturity_level, score_weight)
        $answers = Answer::where('questionnaire_id', $questionnaire->id)
            ->with('question')
            ->get();

        // 5. Hitung skor per domain
        $totalScore = 0.0;
        $domainScoresData = [];

        foreach ($ahpResults as $result) {
            $domainCode = $result->criteria->code; // contoh: 'governance'
            $ahpWeight = (float) $result->weight;

            // Filter jawaban untuk domain ini
            $domainAnswers = $answers->filter(
                fn ($a) => $a->question->domain === $domainCode
            );

            // Pisahkan berdasarkan maturity_level
            $level1 = $domainAnswers->filter(fn ($a) => $a->question->maturity_level === 1);
            $level2 = $domainAnswers->filter(fn ($a) => $a->question->maturity_level === 2);
            $level3 = $domainAnswers->filter(fn ($a) => $a->question->maturity_level === 3);

            // Cek eligibilitas Level 3 berdasarkan jawaban Level 1
            $level1Scores = $level1->pluck('score')->toArray();
            $level3Eligible = $this->isLevel3Eligible($level1Scores);

            // Hitung skor aktual: score (0-3) × score_weight (3/6/9)
            $domainScore = 0.0;
            foreach ($level1 as $answer) {
                $domainScore += $answer->score * $answer->question->score_weight;
            }
            foreach ($level2 as $answer) {
                $domainScore += $answer->score * $answer->question->score_weight;
            }
            if ($level3Eligible) {
                foreach ($level3 as $answer) {
                    $domainScore += $answer->score * $answer->question->score_weight;
                }
            }

            $finalScore = $domainScore * $ahpWeight;
            $totalScore += $finalScore;

            $domainScoresData[] = [
                'domain_name' => $result->criteria->name,
                'domain_score' => $domainScore,
                'ahp_weight' => $ahpWeight,
                'final_score' => $finalScore,
            ];
        }

        // 6. Simpan hasil ke database
        $kamiIndex = KamiIndex::create([
            'user_id' => $user->id,
            'total_score' => $totalScore,
            'category' => $this->getCategory($totalScore, $systemType),
            'calculated_at' => now()->toDateString(),
        ]);

        foreach ($domainScoresData as $data) {
            DomainScore::create(array_merge($data, [
                'kami_index_id' => $kamiIndex->id,
            ]));
        }

        return $kamiIndex;
    }
}
