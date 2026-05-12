<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePairwiseRequest;
use App\Models\AhpCriteria;
use App\Models\AhpResult;
use App\Models\PairwiseComparison;
use App\Services\AhpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AhpController extends Controller
{
    public function __construct(private AhpService $ahpService) {}

    public function pairwise(): Response
    {
        $this->authorize('ahp-pairwise.view');

        $criteria = AhpCriteria::orderBy('order')->get();
        $comparisons = PairwiseComparison::all();
        // Ambil result terbaru — semua record punya CI/CR yang sama per kalkulasi
        $lastResult = AhpResult::latest()->first();

        return Inertia::render('ahp/pairwise/page', [
            'criteria' => $criteria,
            'existingComparisons' => $comparisons,
            'lastResult' => $lastResult,
        ]);
    }

    public function storePairwise(StorePairwiseRequest $request): RedirectResponse
    {
        $this->authorize('ahp-pairwise.create');

        $comparisons = $request->validated()['comparisons'];
        $criteria = AhpCriteria::orderBy('order')->get();
        $n = $criteria->count();
        $criteriaOrder = $criteria->pluck('id')->toArray();

        // Map criteria IDs ke 0-based indices untuk matrix builder
        $mappedComparisons = collect($comparisons)
            ->map(function ($comp) use ($criteriaOrder) {
                $i = array_search($comp['criteria1_id'], $criteriaOrder);
                $j = array_search($comp['criteria2_id'], $criteriaOrder);

                if ($i === false || $j === false) {
                    return null;
                }

                return [
                    'criteria1_index' => $i,
                    'criteria2_index' => $j,
                    'comparison_value' => $comp['comparison_value'],
                ];
            })
            ->filter()
            ->values()
            ->toArray();

        $matrix = $this->ahpService->buildMatrix($mappedComparisons, $n);
        $result = $this->ahpService->calculateWeight($matrix);

        DB::transaction(function () use ($comparisons, $criteriaOrder, $result) {
            // Gunakan delete() bukan truncate() — truncate menyebabkan
            // implicit commit di MySQL yang merusak transaction
            PairwiseComparison::query()->delete();
            AhpResult::query()->delete();

            foreach ($comparisons as $comp) {
                PairwiseComparison::create([
                    'criteria1_id' => $comp['criteria1_id'],
                    'criteria2_id' => $comp['criteria2_id'],
                    'comparison_value' => $comp['comparison_value'],
                ]);
            }

            foreach ($criteriaOrder as $index => $criteriaId) {
                AhpResult::create([
                    'criteria_id' => $criteriaId,
                    'weight' => $result['weights'][$index],
                    // eigen_value diisi λ_max — nilai sama untuk semua kriteria
                    // karena λ_max adalah properti matriks, bukan per kriteria
                    'eigen_value' => $result['lambdaMax'],
                    'ci' => $result['ci'],
                    'cr' => $result['cr'],
                    'lambda_max' => $result['lambdaMax'],
                    'is_consistent' => $result['isConsistent'],
                ]);
            }
        });

        if (! $result['isConsistent']) {
            return redirect()
                ->route('ahp.pairwise')
                ->with('error', 'Matriks tidak konsisten (CR = '.number_format($result['cr'], 3).' > 0.1). Silakan revisi perbandingan.');
        }

        return redirect()
            ->route('ahp.result')
            ->with('success', 'Bobot AHP berhasil dihitung dan konsisten (CR = '.number_format($result['cr'], 3).').');
    }

    public function result(): Response
    {
        $this->authorize('ahp-result.view');

        $results = AhpResult::with('criteria')->orderBy('criteria_id')->get();

        // Semua record dari satu kalkulasi memiliki CR dan konsistensi yang sama
        $firstResult = $results->first();

        return Inertia::render('ahp/result/page', [
            'results' => $results,
            'isConsistent' => $firstResult?->is_consistent ?? false,
            'cr' => $firstResult?->cr ?? 0,
            'ci' => $firstResult?->ci ?? 0,
            'lambdaMax' => $firstResult?->lambda_max ?? 0,
        ]);
    }
}
