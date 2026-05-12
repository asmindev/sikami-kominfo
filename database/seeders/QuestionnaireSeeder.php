<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Questionnaire;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * QuestionnaireSeeder — Simulasi kondisi nyata Diskominfo Kota Kendari
 *
 * Menyediakan 3 mode untuk mensimulasikan berbagai tingkat kematangan:
 *
 * 1. MODE_BASELINE (default): Kondisi awal instansi yang sedang berkembang
 *    - Level 1: dominan di 2-3, sebagian masih 0-1
 *    - Level 2: dominan di 2, sebagian 1
 *    - Level 3: dominan di 0-1, sebagian 2
 *    - Hasil perkiraan: "Tidak Layak" (realistis untuk instansi pemula)
 *
 * 2. MODE_IMPROVED: Kondisi setelah perbaikan signifikan
 *    - Level 1: hampir semua ≥ 2, maksimal 2 jawaban = 2 (eligible Level 3)
 *    - Level 2: dominan di 2-3
 *    - Level 3: dominan di 2-3
 *    - Hasil perkiraan: "Kerangka Dasar" (memerlukan skor sangat tinggi)
 *
 * 3. MODE_EXCELLENT: Kondisi instansi yang sangat matang
 *    - Level 1: semua = 3
 *    - Level 2: dominan di 3
 *    - Level 3: dominan di 2-3
 *    - Hasil perkiraan: "Cukup Baik" atau "Baik" (hampir sempurna)
 *
 * Cara pakai:
 *   php artisan db:seed --class=QuestionnaireSeeder
 *   MODE=improved php artisan db:seed --class=QuestionnaireSeeder
 *   MODE=excellent php artisan db:seed --class=QuestionnaireSeeder
 */
class QuestionnaireSeeder extends Seeder
{
    /** Mode seeder */
    public const MODE_BASELINE = 'baseline';
    public const MODE_IMPROVED = 'improved';
    public const MODE_EXCELLENT = 'excellent';

    /** Mode aktif — bisa diubah via env variable MODE */
    private string $mode = self::MODE_BASELINE;

    /**
     * Distribusi skor per level untuk setiap mode.
     * Format: [skor => bobot_probabilitas]
     */
    private array $distributions = [
        self::MODE_BASELINE => [
            1 => [0 => 8,  1 => 18, 2 => 40, 3 => 34], // Level 1: banyak 2, sebagian 3
            2 => [0 => 12, 1 => 22, 2 => 42, 3 => 24], // Level 2: dominan 2
            3 => [0 => 22, 1 => 32, 2 => 32, 3 => 14], // Level 3: banyak 0-1
        ],
        self::MODE_IMPROVED => [
            1 => [0 => 0,  1 => 5,  2 => 35, 3 => 60], // Level 1: hampir semua ≥ 2
            2 => [0 => 0,  1 => 8,  2 => 38, 3 => 54], // Level 2: dominan 2-3
            3 => [0 => 0,  1 => 12, 2 => 42, 3 => 46], // Level 3: dominan 2-3
        ],
        self::MODE_EXCELLENT => [
            1 => [0 => 0,  1 => 0,  2 => 20, 3 => 80], // Level 1: semua 3
            2 => [0 => 0,  1 => 0,  2 => 25, 3 => 75], // Level 2: dominan 3
            3 => [0 => 0,  1 => 0,  2 => 30, 3 => 70], // Level 3: dominan 2-3
        ],
    ];

    public function run(): void
    {
        // Baca mode dari env variable MODE
        $envMode = env('MODE', self::MODE_BASELINE);
        if (in_array($envMode, [self::MODE_BASELINE, self::MODE_IMPROVED, self::MODE_EXCELLENT], true)) {
            $this->mode = $envMode;
        }

        $leader = User::role('leader')->first();

        if (! $leader) {
            $this->command?->warn('Tidak ada user dengan role leader. Jalankan UserSeeder terlebih dahulu.');

            return;
        }

        $questions = Question::orderBy('order')->get();

        if ($questions->isEmpty()) {
            $this->command?->warn('Tidak ada pertanyaan. Jalankan QuestionSeeder terlebih dahulu.');

            return;
        }

        $this->command?->info("Mode seeder: {$this->mode}");
        $this->command?->info("Membuat kuesioner untuk leader: {$leader->name} ({$leader->email})");

        // Hapus kuesioner lama jika ada — idempotent
        Questionnaire::where('user_id', $leader->id)->delete();

        $questionnaire = Questionnaire::create([
            'user_id' => $leader->id,
            'submitted_at' => now(),
        ]);

        $byDomain = $questions->groupBy('domain');
        $answers = [];
        $domainStats = [];

        foreach ($byDomain as $domain => $domainQuestions) {
            $level1Questions = $domainQuestions->where('maturity_level', 1)->values();
            $level2Questions = $domainQuestions->where('maturity_level', 2)->values();
            $level3Questions = $domainQuestions->where('maturity_level', 3)->values();

            // Generate jawaban Level 1 terlebih dahulu
            $level1Scores = [];
            foreach ($level1Questions as $question) {
                $score = $this->weightedRandom($this->distributions[$this->mode][1]);
                $level1Scores[] = $score;
                $answers[] = $this->buildAnswer($questionnaire->id, $question->id, $score);
            }

            // Level 2 — independen dari Level 1
            $level2Scores = [];
            foreach ($level2Questions as $question) {
                $score = $this->weightedRandom($this->distributions[$this->mode][2]);
                $level2Scores[] = $score;
                $answers[] = $this->buildAnswer($questionnaire->id, $question->id, $score);
            }

            // Level 3 — tetap diisi sesuai distribusi
            $level3Scores = [];
            foreach ($level3Questions as $question) {
                $score = $this->weightedRandom($this->distributions[$this->mode][3]);
                $level3Scores[] = $score;
                $answers[] = $this->buildAnswer($questionnaire->id, $question->id, $score);
            }

            // Cek eligibilitas Level 3 untuk logging
            $eligible = $this->checkEligibility($level1Scores);
            $l1Avg = count($level1Scores) > 0
                ? round(array_sum($level1Scores) / count($level1Scores), 2)
                : 0;

            // Hitung skor mentah per level
            $l1Raw = array_sum(array_map(fn($s) => $s * 3, $level1Scores));
            $l2Raw = array_sum(array_map(fn($s) => $s * 6, $level2Scores));
            $l3Raw = $eligible
                ? array_sum(array_map(fn($s) => $s * 9, $level3Scores))
                : 0;
            $domainRaw = $l1Raw + $l2Raw + $l3Raw;

            $domainStats[$domain] = [
                'l1_avg' => $l1Avg,
                'eligible' => $eligible,
                'l1_raw' => $l1Raw,
                'l2_raw' => $l2Raw,
                'l3_raw' => $l3Raw,
                'domain_raw' => $domainRaw,
            ];

            $this->command?->line(sprintf(
                '  %-20s | L1 avg: %-4s | L3 eligible: %-25s | Raw: %3d',
                $domain,
                $l1Avg,
                $eligible ? '✅ Ya' : '❌ Tidak (L3 diabaikan)',
                $domainRaw
            ));
        }

        Answer::insert($answers);

        // Hitung total KAMI (estimasi)
        $ahpWeights = [
            'governance' => 0.372350,
            'risk_management' => 0.283290,
            'framework' => 0.178158,
            'asset_management' => 0.106040,
            'technology' => 0.060162,
        ];

        $estimatedTotal = 0;
        foreach ($domainStats as $domain => $stats) {
            $estimatedTotal += $stats['domain_raw'] * ($ahpWeights[$domain] ?? 0);
        }

        $category = $this->estimateCategory($estimatedTotal);

        $this->command?->info('');
        $this->command?->info("✅ Kuesioner berhasil dibuat untuk: {$leader->name}");
        $this->command?->info('   Total jawaban: ' . count($answers));
        $this->command?->info('   Status: Submitted (' . now()->format('d M Y H:i') . ')');
        $this->command?->info(sprintf('   Estimasi Indeks KAMI: %.2f (%s)', $estimatedTotal, $category));
        $this->command?->info('');
        $this->command?->info('   Catatan: Untuk hasil akurat, jalankan perhitungan via /kami/calculate');
    }

    /**
     * Pilih skor secara acak berbobot sesuai distribusi yang ditentukan.
     */
    private function weightedRandom(array $weights): int
    {
        $total = array_sum($weights);
        $random = mt_rand(1, $total);
        $cumulative = 0;

        foreach ($weights as $score => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $score;
            }
        }

        return array_key_last($weights);
    }

    /**
     * Cek eligibilitas Level 3 berdasarkan skor Level 1.
     */
    private function checkEligibility(array $level1Scores): bool
    {
        foreach ($level1Scores as $score) {
            if ($score < 2) {
                return false;
            }
        }

        $partialCount = count(array_filter($level1Scores, fn($s) => $s === 2));

        return $partialCount <= 2;
    }

    /**
     * Estimasi kategori berdasarkan threshold sistem TINGGI.
     */
    private function estimateCategory(float $totalScore): string
    {
        if ($totalScore <= 387) {
            return 'Tidak Layak';
        }
        if ($totalScore <= 646) {
            return 'Kerangka Dasar';
        }
        if ($totalScore <= 828) {
            return 'Cukup Baik';
        }

        return 'Baik';
    }

    private function buildAnswer(int $questionnaireId, int $questionId, int $score): array
    {
        return [
            'questionnaire_id' => $questionnaireId,
            'question_id' => $questionId,
            'score' => $score,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
