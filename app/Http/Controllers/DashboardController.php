<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {

        $this->authorize('dashboard.view');

        return Inertia::render('dashboard/page');
    }
}
