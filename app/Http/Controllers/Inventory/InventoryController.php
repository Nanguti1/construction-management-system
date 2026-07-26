<?php

namespace App\Http\Controllers\Inventory;

use App\Actions\AdjustInventoryAction;
use App\DTOs\StockAdjustmentData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreStockAdjustmentRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function __construct(
        private AdjustInventoryAction $adjustInventoryAction,
        private InventoryService $inventoryService
    ) {}

    public function index(): Response
    {
        $products = Product::query()
            ->with('category')
            ->get()
            ->map(function ($product) {
                $product->current_stock = $this->inventoryService->getProductStock($product->id);
                return $product;
            });

        return Inertia::render('Inventory/Index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load('category');
        $movements = $this->inventoryService->getProductMovements($product->id, 50);

        return Inertia::render('Inventory/Show', [
            'product' => $product,
            'movements' => $movements,
        ]);
    }

    public function adjust(StoreStockAdjustmentRequest $request): RedirectResponse
    {
        $data = StockAdjustmentData::fromArray($request->validated());
        $movement = $this->adjustInventoryAction->execute($data);

        return redirect()->route('inventory.show', $data->productId)
            ->with('success', 'Stock adjusted successfully.');
    }

    public function movements(): Response
    {
        $movements = StockMovement::query()
            ->with(['product', 'user', 'movable'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return Inertia::render('Inventory/Movements', [
            'movements' => $movements,
        ]);
    }
}