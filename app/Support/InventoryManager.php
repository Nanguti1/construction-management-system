<?php

namespace App\Support;

use App\Enums\StockMovementType;
use App\Exceptions\InsufficientStockException;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Collection;

class InventoryManager
{
    public function getCurrentStock(string $productId): int
    {
        $movements = StockMovement::where('product_id', $productId)->get();

        $total = 0;
        foreach ($movements as $movement) {
            $type = StockMovementType::from($movement->movement_type);

            if ($type->increasesStock()) {
                $total += $movement->quantity;
            } elseif ($type->decreasesStock()) {
                $total -= $movement->quantity;
            }
        }

        return max(0, $total);
    }

    public function hasSufficientStock(string $productId, int $requiredQuantity): bool
    {
        return $this->getCurrentStock($productId) >= $requiredQuantity;
    }

    public function validateStockAvailability(string $productId, int $requiredQuantity): void
    {
        if (! $this->hasSufficientStock($productId, $requiredQuantity)) {
            $product = Product::find($productId);
            $available = $this->getCurrentStock($productId);

            throw new InsufficientStockException(
                $product?->name ?? 'Unknown',
                $requiredQuantity,
                $available
            );
        }
    }

    public function recordMovement(
        string $productId,
        int $quantity,
        StockMovementType $movementType,
        ?string $referenceType = null,
        ?string $referenceId = null,
        ?string $notes = null,
        ?string $movementDate = null
    ): StockMovement {
        return StockMovement::create([
            'product_id' => $productId,
            'movement_type' => $movementType->value,
            'quantity' => $quantity,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'notes' => $notes,
            'movement_date' => $movementDate ?? now()->toDateString(),
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);
    }

    public function recordPurchaseMovement(
        string $productId,
        int $quantity,
        string $referenceType,
        string $referenceId,
        ?string $notes = null
    ): StockMovement {
        return $this->recordMovement(
            $productId,
            $quantity,
            StockMovementType::PURCHASE,
            $referenceType,
            $referenceId,
            $notes
        );
    }

    public function recordSaleMovement(
        string $productId,
        int $quantity,
        string $referenceType,
        string $referenceId,
        ?string $notes = null
    ): StockMovement {
        $this->validateStockAvailability($productId, $quantity);

        return $this->recordMovement(
            $productId,
            $quantity,
            StockMovementType::SALE,
            $referenceType,
            $referenceId,
            $notes
        );
    }

    public function recordAdjustment(
        string $productId,
        int $quantity,
        ?string $notes = null,
        ?string $movementDate = null
    ): StockMovement {
        return $this->recordMovement(
            $productId,
            $quantity,
            StockMovementType::ADJUSTMENT,
            null,
            null,
            $notes,
            $movementDate
        );
    }

    public function recordOpeningStock(
        string $productId,
        int $quantity,
        ?string $movementDate = null
    ): StockMovement {
        return $this->recordMovement(
            $productId,
            $quantity,
            StockMovementType::OPENING_STOCK,
            null,
            null,
            'Opening stock',
            $movementDate
        );
    }

    public function recordReturn(
        string $productId,
        int $quantity,
        string $referenceType,
        string $referenceId,
        ?string $notes = null
    ): StockMovement {
        return $this->recordMovement(
            $productId,
            $quantity,
            StockMovementType::RETURN,
            $referenceType,
            $referenceId,
            $notes
        );
    }

    public function recordReturnMovement(
        string $productId,
        int $quantity,
        string $referenceType,
        string $referenceId,
        ?string $notes = null
    ): StockMovement {
        return $this->recordMovement(
            $productId,
            $quantity,
            StockMovementType::RETURN,
            $referenceType,
            $referenceId,
            $notes
        );
    }

    public function getProductMovements(string $productId, ?int $limit = null): Collection
    {
        $query = StockMovement::where('product_id', $productId)
            ->orderBy('movement_date', 'desc')
            ->orderBy('created_at', 'desc');

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }

    public function getLowStockProducts(int $threshold = 10): Collection
    {
        return Product::where('is_active', true)
            ->get()
            ->filter(function ($product) use ($threshold) {
                $currentStock = $this->getCurrentStock($product->id);

                return $currentStock <= $product->minimum_stock || $currentStock < $threshold;
            });
    }
}
