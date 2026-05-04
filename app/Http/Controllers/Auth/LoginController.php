<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    // Only used to render the login page (GET /login)
    // POST /login is handled automatically by Fortify
    public function create(): Response
    {
        return Inertia::render('auth/login/page');
    }
}
