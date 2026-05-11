<?php

use App\Http\Controllers\AhpController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KamiController;
use App\Http\Controllers\LeaderController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// ====================================================================
// Guest Routes
// ====================================================================

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
});

// ====================================================================
// Root Redirect
// ====================================================================

Route::get('/', function () {
    if (auth()->check()) {
        if (auth()->user()->can('dashboard.view')) {
            return redirect()->route('dashboard');
        }
        if (auth()->user()->can('questionnaire.fill') || auth()->user()->can('questionnaire-result.view')) {
            return redirect()->route('questionnaire.index');
        }
    }

    return redirect()->route('login');
});

// ====================================================================
// Authenticated Routes
// ====================================================================

Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Leader Management
    Route::get('/leader', [LeaderController::class, 'index'])->name('leader.index');
    Route::get('/leader/create', [LeaderController::class, 'create'])->name('leader.create');
    Route::post('/leader', [LeaderController::class, 'store'])->name('leader.store');
    Route::get('/leader/{leader}/edit', [LeaderController::class, 'edit'])->name('leader.edit');
    Route::put('/leader/{leader}', [LeaderController::class, 'update'])->name('leader.update');
    Route::delete('/leader/{leader}', [LeaderController::class, 'destroy'])->name('leader.destroy');

    // Question Management
    Route::get('/question', [QuestionController::class, 'index'])->name('question.index');
    Route::get('/question/create', [QuestionController::class, 'create'])->name('question.create');
    Route::post('/question', [QuestionController::class, 'store'])->name('question.store');
    Route::get('/question/{question}/edit', [QuestionController::class, 'edit'])->name('question.edit');
    Route::put('/question/{question}', [QuestionController::class, 'update'])->name('question.update');
    Route::delete('/question/{question}', [QuestionController::class, 'destroy'])->name('question.destroy');

    // AHP Pairwise Comparison
    Route::get('/ahp/pairwise', [AhpController::class, 'pairwise'])->name('ahp.pairwise');
    Route::post('/ahp/pairwise', [AhpController::class, 'storePairwise'])->name('ahp.store-pairwise');

    // AHP Weight Results
    Route::get('/ahp/result', [AhpController::class, 'result'])->name('ahp.result');

    // KAMI Index Calculation
    Route::get('/kami/calculate', [KamiController::class, 'calculate'])->name('kami.calculate');
    Route::post('/kami/calculate', [KamiController::class, 'process'])->name('kami.process');

    // KAMI Results
    Route::get('/kami/result', [KamiController::class, 'result'])->name('kami.result');
    Route::get('/kami/result/{kamiIndex}', [KamiController::class, 'show'])->name('kami.show');

    // Reports
    Route::get('/report', [ReportController::class, 'index'])->name('report.index');
    // Note: These route parameter names should match the Controller arguments
    Route::get('/report/export-pdf/{kamiIndex}', [ReportController::class, 'exportPdf'])->name('report.export-pdf');
    Route::get('/report/export-excel', [ReportController::class, 'exportExcel'])->name('report.export-excel');

    // Questionnaire
    Route::get('/questionnaire', [QuestionnaireController::class, 'index'])->name('questionnaire.index');
    Route::get('/questionnaire/fill', [QuestionnaireController::class, 'fill'])->name('questionnaire.fill');
    Route::post('/questionnaire/submit', [QuestionnaireController::class, 'submit'])->name('questionnaire.submit');
    Route::get('/questionnaire/result', [QuestionnaireController::class, 'result'])->name('questionnaire.result');
});
