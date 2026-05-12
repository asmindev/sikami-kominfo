<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        $user = $request->user();
        $redirectTo = $user?->can('dashboard.view')
            ? route('dashboard')
            : route('questionnaire.index');

        return redirect()->intended($redirectTo);
    }
}
