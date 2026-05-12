<?php

namespace App\Services;

class AhpService
{
    private array $randomIndex = [
        1 => 0.00, 2 => 0.00, 3 => 0.58, 4 => 0.90,
        5 => 1.12, 6 => 1.24, 7 => 1.32, 8 => 1.41,
        9 => 1.45, 10 => 1.49,
    ];

    public function calculateWeight(array $matrix): array
    {
        $n = count($matrix);

        // Step 1: Column sums
        $columnSums = array_fill(0, $n, 0.0);
        for ($j = 0; $j < $n; $j++) {
            for ($i = 0; $i < $n; $i++) {
                $columnSums[$j] += $matrix[$i][$j];
            }
        }

        // Step 2: Normalize matrix
        $normalized = [];
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                // Prevent division by zero
                $normalized[$i][$j] = $columnSums[$j] > 0 ? $matrix[$i][$j] / $columnSums[$j] : 0.0;
            }
        }

        // Step 3: Priority vector (row averages)
        $weights = [];
        for ($i = 0; $i < $n; $i++) {
            $weights[$i] = array_sum($normalized[$i]) / $n;
        }

        // Step 4: Weighted sum vector
        $weightedSum = array_fill(0, $n, 0.0);
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                $weightedSum[$i] += $matrix[$i][$j] * $weights[$j];
            }
        }

        // Step 5: λ_max
        $lambdaValues = [];
        for ($i = 0; $i < $n; $i++) {
            $lambdaValues[] = $weights[$i] > 0 ? $weightedSum[$i] / $weights[$i] : 0.0;
        }
        $lambdaMax = array_sum($lambdaValues) / $n;

        // Step 6: Consistency Index
        $ci = ($n > 1) ? ($lambdaMax - $n) / ($n - 1) : 0;

        // Step 7: Consistency Ratio
        $ir = $this->randomIndex[$n] ?? 1.49;
        $cr = $ir > 0 ? $ci / $ir : 0.0;

        return [
            'weights' => $weights,
            'lambdaMax' => $lambdaMax,
            'ci' => $ci,
            'cr' => $cr,
            'ir' => $ir,
            'isConsistent' => $cr <= 0.1,
            'n' => $n,
        ];
    }

    public function buildMatrix(array $comparisons, int $n): array
    {
        $matrix = array_fill(0, $n, array_fill(0, $n, 1.0));

        foreach ($comparisons as $comparison) {
            $i = $comparison['criteria1_index'];
            $j = $comparison['criteria2_index'];
            $value = (float) $comparison['comparison_value'];

            $matrix[$i][$j] = $value;
            $matrix[$j][$i] = $value > 0 ? (1 / $value) : 1;
        }

        return $matrix;
    }
}
