<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /**
         * Handle Spatie Permission Exception (role/permission middleware)
         * Redirect to home when user doesn't have required role
         */
        $exceptions->render(function (\Spatie\Permission\Exceptions\UnauthorizedException $e, \Illuminate\Http\Request $request) {
            return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        });

        /**
         * Handle Authorization Exception (from $this->authorize() in controllers)
         * Redirect based on user role with friendly message
         * - Admin → dashboard
         * - Leader → questionnaire index
         */
        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, \Illuminate\Http\Request $request) {
            if ($request->user()?->hasRole('admin')) {
                return redirect()->route('dashboard')
                    ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            }

            if ($request->user()?->hasRole('leader')) {
                return redirect()->route('questionnaire.index')
                    ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            }

            return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        });
    })->create();
