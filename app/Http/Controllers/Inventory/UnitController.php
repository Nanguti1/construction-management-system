<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\ProductUnit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(): Response
    {
        $units = ProductUnit::query()
            ->withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('Inventory/Units/Index', [
            'units' => $units,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Inventory/Units/Create');
    }

    public function store(): RedirectResponse
    {
        // Implementation would go here
        return redirect()->route('units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function show(ProductUnit $unit): Response
    {
        $unit->load('products');

        return Inertia::render('Inventory/Units/Show', [
            'unit' => $unit,
        ]);
    }

    public function edit(ProductUnit $unit): Response
    {
        return Inertia::render('Inventory/Units/Edit', [
            'unit' => $unit,
        ]);
    }

    public function update(ProductUnit $unit): RedirectResponse
    {
        // Implementation would go here
        return redirect()->route('units.index')
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(ProductUnit $unit): RedirectResponse
    {
        $unit->delete();

        return redirect()->route('units.index')
            ->with('success', 'Unit deleted successfully.');
    }
}