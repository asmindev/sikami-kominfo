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
    private AhpService $ahpService;

    public function __construct(AhpService $ahpService)
    {
        $this->ahpService = $ahpService;
    }

    public function pairwise(): Response
    {
        $this->authorize('ahp-pairwise.view');

        $criteria = AhpCriteria::orderBy('order')->get();
        $comparisons = PairwiseComparison::all();
        $lastResult = AhpResult::first();

        return Inertia::render('ahp/pairwise/page', [
            'criteria'            => $criteria,
            'existingComparisons' => $comparisons,
            'lastResult'          => $lastResult,
        ]);
    }

    public function storePairwise(StorePairwiseRequest $request): RedirectResponse
    {
        $this->authorize('ahp-pairwise.create');

        $validated = $request->validated();
        $comparisons = $validated['comparisons'];

        $criteria = AhpCriteria::orderBy('order')->get();
        $n = $criteria->count();

        // Map criteria IDs to 0-based indices for the matrix built by AhpService
        $criteriaOrder = $criteria->pluck('id')->toArray();
        $mappedComparisons = [];

        foreach ($comparisons as $comp) {
            $i = array_search($comp['criteria1_id'], $criteriaOrder);
            $j = array_search($comp['criteria2_id'], $criteriaOrder);

            if ($i !== false && $j !== false) {
                $mappedComparisons[] = [
                    'criteria1_index'   => $i,
                    'criteria2_index'   => $j,
                    'comparison_value'  => $comp['comparison_value'],
                ];
            }
        }

        // Build matrix and calculate AHPs
        $matrix = $this->ahpService->buildMatrix($mappedComparisons, $n);
        $result = $this->ahpService->calculateWeight($matrix);

        DB::transaction(function () use ($comparisons, $criteriaOrder, $result) {
            // Clear existing comparisons and results using delete instead of truncate
            // Truncate causes implicit commit in MySQL which breaks the transaction
            PairwiseComparison::query()->delete();
            AhpResult::query()->delete();

            // Insert new comparisons
            foreach ($comparisons as $comp) {
                PairwiseComparison::create([
                    'criteria1_id'     => $comp['criteria1_id'],
                    'criteria2_id'     => $comp['criteria2_id'],
                    'comparison_value' => $comp['comparison_value'],
                ]);
            }

            // Insert AhpResults based on criteria order
            foreach ($criteriaOrder as $index => $criteriaId) {
                AhpResult::create([
                    'criteria_id'   => $criteriaId,
                    'weight'        => $result['weights'][$index],
                    'eigen_value'   => $result['lambdaMax'],
                    'ci'            => $result['ci'],
                    'cr'            => $result['cr'],
                    'lambda_max'    => $result['lambdaMax'],
                    'is_consistent' => $result['isConsistent'],
                ]);
            }
        });

        if (!$result['isConsistent']) {
            return redirect()->route('ahp.pairwise')
                ->with('error', 'Matriks tidak konsisten (CR = ' . number_format($result['cr'], 3) . ' > 0.1). Silakan revisi perbandingan.');
        }

        return redirect()->route('ahp.result')
            ->with('success', 'Perbandingan berpasangan berhasil disimpan dan konsisten.');
    }

    public function result(): Response
    {
        $this->authorize('ahp-result.view');

        $results = AhpResult::with('criteria')->get();

        return Inertia::render('ahp/result/page', [
            'results' => $results,
            'isConsistent' => $results->isNotEmpty() ? $results->first()->is_consistent : false,
            'cr' => $results->isNotEmpty() ? $results->first()->cr : 0,
        ]);
    }
}
