<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Require fortify configuration if missing
        $this->app->singleton('config', function () {
            $config = require config_path('fortify.php');
            return collect($config);
        });
        // $this->app->ignoreNamespace('Laravel\Fortify');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::loginView(function () {
            return inertia('auth/login/page');
        });

        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->email;

            return Limit::perMinute(5)->by($email . $request->ip());
        });

        // Config redirect setelah login sesuai role/permission
        Fortify::redirects('login', function () {
            if (auth()->check()) {
                if (auth()->user()->can('dashboard.view')) {
                    return route('dashboard');
                }
                if (auth()->user()->can('questionnaire.fill')) {
                    return route('questionnaire.index');
                }
            }

            return route('dashboard'); // fallback
        });

        // Redirect setelah logout
        Fortify::redirects('logout', function () {
            return route('login');
        });
    }
}
