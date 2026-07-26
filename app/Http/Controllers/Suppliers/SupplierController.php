<?php

namespace App\Http\Controllers\Suppliers;

use App\Actions\CreateSupplierAction;
use App\Actions\DeleteSupplierAction;
use App\Actions\UpdateSupplierAction;
use App\DTOs\SupplierData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Suppliers\StoreSupplierRequest;
use App\Http\Requests\Suppliers\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function __construct(
        private CreateSupplierAction $createSupplierAction,
        private UpdateSupplierAction $updateSupplierAction,
        private DeleteSupplierAction $deleteSupplierAction
    ) {}

    public function index(): Response
    {
        $suppliers = Supplier::query()
            ->withCount('purchases')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('suppliers/index', [
            'suppliers' => $suppliers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('suppliers/create');
    }

    public function store(StoreSupplierRequest $request): RedirectResponse
    {
        $data = SupplierData::fromArray($request->validated());
        $this->createSupplierAction->execute($data);

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier created successfully.');
    }

    public function show(Supplier $supplier): Response
    {
        $supplier->load(['purchases' => function ($query) {
            $query->orderBy('purchase_date', 'desc')->limit(10);
        }]);

        return Inertia::render('suppliers/show', [
            'supplier' => $supplier,
        ]);
    }

    public function edit(Supplier $supplier): Response
    {
        return Inertia::render('suppliers/edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        $data = SupplierData::fromArray($request->validated());
        $this->updateSupplierAction->execute($supplier, $data);

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $this->deleteSupplierAction->execute($supplier);

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier deleted successfully.');
    }
}
