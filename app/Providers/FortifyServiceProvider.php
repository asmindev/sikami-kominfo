<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Contracts\LoginResponse;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

use Laravel\Fortify\Fortify;
use Illuminate\Http\Request;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(LoginResponse::class, function () {
            return new class implements LoginResponse {
                /**
                 * @param Request $request
                 */
                public function toResponse($request)
                {
                    /** @var Request $request */
                    $user = $request->user();

                    if ($user->hasRole('admin')) {
                        return redirect()->route('dashboard');
                    }

                    if ($user->hasRole('leader')) {
                        return redirect()->route('questionnaire.index');
                    }

                    return redirect('/');
                }
            };
        });
    }

    public function boot(): void
    {
        // Render login page via Inertia
        Fortify::loginView(function () {
            return Inertia::render('auth/login/page');
        });

        // Custom authentication logic — redirect based on role after login
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();

            if ($user && Hash::check($request->password, $user->password)) {
                return $user;
            }
        });
    }
}
