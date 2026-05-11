<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        // Spatie middleware aliases removed per new rules
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /**
         * Handle Authorization Exception (from $this->authorize() in controllers)
         * Redirect based on user permissions with friendly message
         */
        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, \Illuminate\Http\Request $request) {
            if ($request->user()?->can('dashboard.view')) {
                return redirect()->route('dashboard')
                    ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            }

            if ($request->user()?->can('questionnaire.fill') || $request->user()?->can('questionnaire-result.view')) {
                return redirect()->route('questionnaire.index')
                    ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            }

            return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        });
    })->create();
