<?php

namespace App\Http\Controllers;

use App\Models\AhpResult;
use App\Models\KamiIndex;
use App\Models\User;
use App\Services\KamiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KamiController extends Controller
{
    public function __construct(private KamiService $kamiService) {}

    public function calculate(): Response
    {
        $this->authorize('kami-index.calculate');

        // Cek apakah AHP sudah dihitung dan konsisten
        $ahpReady = AhpResult::where('is_consistent', true)->exists();

        // Semua leader yang sudah submit kuesioner
        $leaders = User::role('leader')
            ->whereHas('questionnaires', fn($q) => $q->whereNotNull('submitted_at'))
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('kami/calculate/page', [
            'leaders'  => $leaders,
            'ahpReady' => $ahpReady,
        ]);
    }

    public function process(Request $request): RedirectResponse
    {
        $this->authorize('kami-index.calculate');

        $validated = $request->validate([
            'user_id'     => ['required', 'exists:users,id'],
            'system_type' => ['required', 'in:TINGGI,RENDAH,STRATEGIS'],
        ]);

        try {
            $user = User::findOrFail($validated['user_id']);

            $this->kamiService->calculateKamiAndAhp($user, $validated['system_type']);

            return redirect()
                ->route('kami.result')
                ->with('success', 'Perhitungan Indeks KAMI berhasil disimpan.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function result(): Response
    {
        $this->authorize('kami-index.view');

        $kamiIndices = KamiIndex::with(['user:id,name,email', 'domainScores'])
            ->latest()
            ->paginate(10);

        return Inertia::render('kami/result/page', [
            'kamiIndices' => $kamiIndices,
        ]);
    }

    public function show(KamiIndex $kamiIndex): Response
    {
        $this->authorize('kami-index.view');

        $kamiIndex->load(['user:id,name,email', 'domainScores']);

        return Inertia::render('kami/show/page', [
            'kamiIndex' => $kamiIndex,
        ]);
    }
}
