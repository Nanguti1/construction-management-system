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

        return Inertia::render('inventory/index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load('category');
        $movements = $this->inventoryService->getProductMovements($product->id, 50);

        return Inertia::render('inventory/show', [
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
            ->with(['product', 'createdBy'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($movement) {
                return [
                    'id' => $movement->id,
                    'product_name' => $movement->product->name ?? 'N/A',
                    'product_sku' => $movement->product->sku ?? 'N/A',
                    'type' => $movement->movement_type,
                    'quantity' => $movement->quantity,
                    'reference_type' => $movement->reference_type,
                    'reference_number' => $movement->reference_id,
                    'notes' => $movement->notes,
                    'created_at' => $movement->created_at,
                ];
            });

        return Inertia::render('inventory/movements', [
            'movements' => $movements,
        ]);
    }
}
