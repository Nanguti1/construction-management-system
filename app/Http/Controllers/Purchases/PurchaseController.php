<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\CreatePurchaseAction;
use App\Actions\DeletePurchaseAction;
use App\Actions\ReceivePurchaseAction;
use App\Actions\UpdatePurchaseAction;
use App\DTOs\PurchaseData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchaseRequest;
use App\Http\Requests\Purchases\UpdatePurchaseRequest;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
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
            ->get()
            ->map(function ($purchase) {
                $purchase->supplier_name = $purchase->supplier?->company_name ?? 'N/A';

                return $purchase;
            });

        return Inertia::render('purchases/index', [
            'purchases' => $purchases,
        ]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::query()
            ->where('is_active', true)
            ->orderBy('company_name')
            ->get(['id', 'company_name']);

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'cost_price']);

        return Inertia::render('purchases/create', [
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
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
        $purchase->supplier_name = $purchase->supplier?->company_name ?? 'N/A';
        $purchase->supplier_phone = $purchase->supplier?->phone ?? null;
        $purchase->supplier_email = $purchase->supplier?->email ?? null;
        $purchase->items = $purchase->purchaseItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product_name' => $item->product->name ?? 'N/A',
                'product_sku' => $item->product->sku ?? 'N/A',
                'quantity' => $item->quantity,
                'unit_cost' => $item->unit_cost,
                'discount' => $item->discount,
                'tax' => $item->tax,
                'subtotal' => $item->line_total,
            ];
        });
        $purchase->grand_total = $purchase->purchaseItems->sum('line_total');

        return Inertia::render('purchases/show', [
            'purchase' => $purchase,
        ]);
    }

    public function edit(Purchase $purchase): Response
    {
        $suppliers = Supplier::query()
            ->where('is_active', true)
            ->orderBy('company_name')
            ->get(['id', 'company_name']);

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'cost_price']);

        $purchase->load('purchaseItems');
        $purchase->items = $purchase->purchaseItems->map(function ($item) {
            return [
                'product_id' => (string) $item->product_id,
                'quantity' => $item->quantity,
                'unit_cost' => (string) $item->unit_cost,
                'discount' => $item->discount,
                'tax' => $item->tax,
            ];
        });

        return Inertia::render('purchases/edit', [
            'purchase' => $purchase,
            'suppliers' => $suppliers,
            'products' => $products,
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
