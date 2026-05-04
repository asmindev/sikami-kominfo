<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaderController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\AhpController;
use App\Http\Controllers\KamiController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

/**
 * ====================================================================
 * SIKAMI-AHP — Permission & Authorization Routes
 * ====================================================================
 *
 * Architecture:
 * - Role middleware → group wrapper (coarse-grained access)
 * - Permission checks → controller via $this->authorize() (fine-grained)
 * - All external redirects handled by AuthorizationException handler
 *
 * Roles:
 * - admin   → system administrator (Manajemen Data, AHP, KAMI, Reports)
 * - leader  → questionnaire filler (pimpinan - isi kuesioner & lihat hasil)
 */

// ====================================================================
// Guest Routes
// ====================================================================

Route::middleware('guest')->group(function () {
    // Login page (POST /login handled by Laravel Fortify)
    Route::get('/login', [LoginController::class, 'create'])->name('login');
});

// ====================================================================
// Root Redirect
// ====================================================================

Route::get('/', function () {
    if (auth()->check()) {
        if (auth()->user()->hasRole('admin')) {
            return redirect()->route('dashboard');
        }
        if (auth()->user()->hasRole('leader')) {
            return redirect()->route('questionnaire.index');
        }
    }
    return redirect()->route('login');
});

// ====================================================================
// Authenticated Routes
// ====================================================================

Route::middleware('auth')->group(function () {
    /**
     * ================================================================
     * ADMIN ROUTES
     * ================================================================
     *
     * Role: admin
     * Features:
     * - System dashboard
     * - Leader (pimpinan) account management
     * - Question management
     * - AHP pairwise comparison & weight calculation
     * - KAMI index calculation & result viewing
     * - Reports (view, export PDF/Excel)
     */
    Route::middleware(['role:admin'])->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Leader Management (Create, Read, Update, Delete accounts for pimpinan)
        Route::resource('/leader', LeaderController::class);

        // Question Management (CRUD untuk pertanyaan KAMI per domain)
        Route::resource('/question', QuestionController::class);

        // AHP Pairwise Comparison (5x5 matrix untuk 5 KAMI domains)
        Route::get('/ahp/pairwise', [AhpController::class, 'pairwise'])->name('ahp.pairwise');
        Route::post('/ahp/pairwise', [AhpController::class, 'storePairwise'])->name('ahp.store-pairwise');

        // AHP Weight Results (Consistency check, priority vectors)
        Route::get('/ahp/result', [AhpController::class, 'result'])->name('ahp.result');

        // KAMI Index Calculation (Admin triggers calculation after leader submits)
        Route::get('/kami/calculate', [KamiController::class, 'calculate'])->name('kami.calculate');
        Route::post('/kami/calculate', [KamiController::class, 'process'])->name('kami.process');

        // KAMI Results (View all leader evaluation results)
        Route::get('/kami/result', [KamiController::class, 'result'])->name('kami.result');
        Route::get('/kami/result/{kamiIndex}', [KamiController::class, 'show'])->name('kami.show');

        // Reports (View, export to PDF/Excel)
        Route::get('/report', [ReportController::class, 'index'])->name('report.index');
        Route::get('/report/export-pdf/{kamiIndex}', [ReportController::class, 'exportPdf'])->name('report.export-pdf');
        Route::get('/report/export-excel', [ReportController::class, 'exportExcel'])->name('report.export-excel');
    });

    /**
     * ================================================================
     * LEADER ROUTES
     * ================================================================
     *
     * Role: leader (pimpinan — questionnaire filler)
     * Features:
     * - Questionnaire status & submission
     * - Fill KAMI 5.0 questionnaire
     * - View own evaluation results
     */
    Route::middleware(['role:leader'])->group(function () {
        // Questionnaire Status (Overview of submission status)
        Route::get('/questionnaire', [QuestionnaireController::class, 'index'])->name('questionnaire.index');

        // Fill Questionnaire (Pimpinan mengisi form KAMI 5.0)
        Route::get('/questionnaire/fill', [QuestionnaireController::class, 'fill'])->name('questionnaire.fill');
        Route::post('/questionnaire/submit', [QuestionnaireController::class, 'submit'])->name('questionnaire.submit');

        // Questionnaire Result (Lihat hasil evaluasi KAMI sendiri)
        Route::get('/questionnaire/result', [QuestionnaireController::class, 'result'])->name('questionnaire.result');
    });
});
