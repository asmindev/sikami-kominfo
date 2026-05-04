<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\KamiIndex;
use App\Services\KamiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KamiController extends Controller
{
    private KamiService $kamiService;

    public function __construct(KamiService $kamiService)
    {
        $this->kamiService = $kamiService;
    }

    public function calculate(): Response
    {
        $this->authorize('kami-index.calculate');

        // Menampilkan semua user dengan role leader yang sudah submit kuesioner
        $leaders = User::role('leader')
            ->whereHas('questionnaires', function ($query) {
                $query->whereNotNull('submitted_at');
            })
            ->get();

        return Inertia::render('kami/calculate/page', [
            'leaders' => $leaders,
        ]);
    }

    public function process(Request $request): RedirectResponse
    {
        $this->authorize('kami-index.calculate');

        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'system_type' => ['required', 'in:tinggi,rendah'],
        ]);

        try {
            $user = User::findOrFail($request->user_id);

            // Hapus rekam KAMI sebelumnya (optional, kita replace jika update kuesioner)
            $user->kamiIndices()->delete();

            $this->kamiService->calculateKamiAndAhp($user, $request->system_type);

            return redirect()->route('kami.result')
                ->with('success', 'Perhitungan Indeks KAMI berhasil.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function result(): Response
    {
        $this->authorize('kami-index.view');

        $kamiIndices = KamiIndex::with(['user', 'domainScores'])->latest()->paginate(10);

        return Inertia::render('kami/result/page', [
            'kamiIndices' => $kamiIndices,
        ]);
    }

    public function show(KamiIndex $kamiIndex): Response
    {
        $this->authorize('kami-index.view');

        $kamiIndex->load(['user', 'domainScores']);

        return Inertia::render('kami/result/detail/page', [
            'kamiIndex' => $kamiIndex,
        ]);
    }
}
