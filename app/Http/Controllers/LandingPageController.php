<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LandingPageController extends Controller
{
    /**
     * Show the landing page.
     */
    public function index(Request $request)
    {
        // If user is logged in, redirect to the main app (call page)
        if (Auth::check()) {
            return redirect()->route('call');
        }
        return Inertia::render('LandingPage');
    }
}

