<?php

namespace App\DTOs;

class StockAdjustmentData
{
    public function __construct(
        public readonly string $productId,
        public readonly int $quantity,
        public readonly string $movementType,
        public readonly ?string $notes,
        public readonly string $movementDate,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            productId: $data['product_id'],
            quantity: $data['quantity'],
            movementType: $data['movement_type'],
            notes: $data['notes'] ?? null,
            movementDate: $data['movement_date'] ?? now()->toDateString(),
        );
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'quantity' => $this->quantity,
            'movement_type' => $this->movementType,
            'notes' => $this->notes,
            'movement_date' => $this->movementDate,
        ];
    }
}
