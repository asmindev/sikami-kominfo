<?php

namespace App\Http\Controllers;

use App\Models\KamiIndex;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('report.view');

        $query = KamiIndex::with(['user', 'domainScores'])->latest();

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $reports = $query->paginate(15)->withQueryString();

        return Inertia::render('report/index/page', [
            'reports' => $reports,
            'filters' => $request->only('search'),
        ]);
    }

    public function exportPdf(KamiIndex $kamiIndex)
    {
        $this->authorize('report.export');

        $kamiIndex->load(['user', 'domainScores']);

        // Asumsi menggunakan barryvdh/laravel-dompdf yang akan diinstal kemudian.
        // Simulasi PDF export for now:
        abort(501, 'PDF Export belum diimplementasikan (membutuhkan package dompdf).');
    }

    public function exportExcel()
    {
        $this->authorize('report.export');

        // Asumsi menggunakan maatwebsite/excel yang akan diinstal kemudian.
        // Simulasi Excel export for now:
        abort(501, 'Excel Export belum diimplementasikan (membutuhkan package maatwebsite/excel).');
    }
}
