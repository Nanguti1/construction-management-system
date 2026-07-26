<?php

namespace App\Services;

use App\Actions\AdjustInventoryAction;
use App\DTOs\StockAdjustmentData;
use App\Models\StockMovement;

class InventoryService
{
    public function __construct(
        private AdjustInventoryAction $adjustInventoryAction
    ) {}

    public function adjustStock(StockAdjustmentData $data): StockMovement
    {
        return $this->adjustInventoryAction->execute($data);
    }

    public function getProductStock(int $productId): int
    {
        return StockMovement::where('product_id', $productId)
            ->sum('quantity');
    }

    public function getProductMovements(int $productId, ?int $limit = null)
    {
        $query = StockMovement::where('product_id', $productId)
            ->with(['user', 'movable'])
            ->orderBy('created_at', 'desc');

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }
}
