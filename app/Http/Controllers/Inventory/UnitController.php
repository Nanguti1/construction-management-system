<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(): Response
    {
        $units = Unit::query()
            ->withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('inventory/units/index', [
            'units' => $units,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/units/create');
    }

    public function store(StoreUnitRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Unit::create([
            'name' => $validated['name'],
            'abbreviation' => $validated['abbreviation'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function show(Unit $unit): Response
    {
        $unit->load('products');

        return Inertia::render('inventory/units/show', [
            'unit' => $unit,
        ]);
    }

    public function edit(Unit $unit): Response
    {
        return Inertia::render('inventory/units/edit', [
            'unit' => $unit,
        ]);
    }

    public function update(UpdateUnitRequest $request, Unit $unit): RedirectResponse
    {
        $validated = $request->validated();

        $unit->update([
            'name' => $validated['name'],
            'abbreviation' => $validated['abbreviation'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('units.index')
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $unit->delete();

        return redirect()->route('units.index')
            ->with('success', 'Unit deleted successfully.');
    }
}
