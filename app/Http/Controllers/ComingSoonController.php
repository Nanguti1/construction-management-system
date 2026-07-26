<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ComingSoonController extends Controller
{
    public function index(string $feature): Response
    {
        return Inertia::render('ComingSoon', [
            'feature' => $feature,
        ]);
    }
}
