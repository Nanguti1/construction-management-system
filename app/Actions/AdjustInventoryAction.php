<?php

namespace App\Actions;

use App\DTOs\StockAdjustmentData;
use App\Enums\StockMovementType;
use App\Models\StockMovement;
use App\Support\InventoryManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdjustInventoryAction
{
    public function __construct(
        private InventoryManager $inventoryManager
    ) {}

    public function execute(StockAdjustmentData $data): StockMovement
    {
        return DB::transaction(function () use ($data) {
            $movementType = StockMovementType::from($data->movementType);

            // Validate if it's a stock decrease
            if ($movementType->decreasesStock()) {
                $this->inventoryManager->validateStockAvailability(
                    $data->productId,
                    $data->quantity
                );
            }

            $stockMovement = $this->inventoryManager->recordAdjustment(
                $data->productId,
                $data->quantity,
                $data->notes,
                $data->movementDate
            );

            Log::info('Inventory adjusted', [
                'stock_movement_id' => $stockMovement->id,
                'product_id' => $data->productId,
                'quantity' => $data->quantity,
                'movement_type' => $data->movementType,
            ]);

            return $stockMovement;
        });
    }
}
