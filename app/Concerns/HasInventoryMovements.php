<?php

namespace App\Concerns;

use App\Enums\StockMovementType;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasInventoryMovements
{
    public function stockMovements(): MorphMany
    {
        return $this->morphMany(StockMovement::class, 'reference');
    }

    protected function createStockMovement(
        string $productId,
        int $quantity,
        StockMovementType $movementType,
        ?string $notes = null,
        ?string $movementDate = null
    ): StockMovement {
        return StockMovement::create([
            'product_id' => $productId,
            'movement_type' => $movementType->value,
            'quantity' => $quantity,
            'reference_type' => $this->getMorphClass(),
            'reference_id' => $this->id,
            'notes' => $notes,
            'movement_date' => $movementDate ?? now()->toDateString(),
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);
    }
}
