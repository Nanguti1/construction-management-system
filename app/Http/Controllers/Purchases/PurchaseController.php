<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\CreatePurchaseAction;
use App\Actions\UpdatePurchaseAction;
use App\Actions\ReceivePurchaseAction;
use App\Actions\DeletePurchaseAction;
use App\DTOs\PurchaseData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchaseRequest;
use App\Http\Requests\Purchases\UpdatePurchaseRequest;
use App\Models\Purchase;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function __construct(
        private CreatePurchaseAction $createPurchaseAction,
        private UpdatePurchaseAction $updatePurchaseAction,
        private ReceivePurchaseAction $receivePurchaseAction,
        private DeletePurchaseAction $deletePurchaseAction
    ) {}

    public function index(): Response
    {
        $purchases = Purchase::query()
            ->with(['supplier', 'purchaseItems'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Purchases/Create');
    }

    public function store(StorePurchaseRequest $request): RedirectResponse
    {
        $data = PurchaseData::fromArray($request->validated());
        $this->createPurchaseAction->execute($data);

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase created successfully.');
    }

    public function show(Purchase $purchase): Response
    {
        $purchase->load(['supplier', 'purchaseItems.product', 'stockMovements']);

        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase,
        ]);
    }

    public function edit(Purchase $purchase): Response
    {
        return Inertia::render('Purchases/Edit', [
            'purchase' => $purchase,
        ]);
    }

    public function update(UpdatePurchaseRequest $request, Purchase $purchase): RedirectResponse
    {
        $data = PurchaseData::fromArray($request->validated());
        $this->updatePurchaseAction->execute($purchase, $data);

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase updated successfully.');
    }

    public function receive(Purchase $purchase): RedirectResponse
    {
        $this->receivePurchaseAction->execute($purchase->id);

        return redirect()->route('purchases.show', $purchase)
            ->with('success', 'Purchase received successfully.');
    }

    public function destroy(Purchase $purchase): RedirectResponse
    {
        $this->deletePurchaseAction->execute($purchase);

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase deleted successfully.');
    }
}