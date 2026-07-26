<?php

namespace App\DTOs;

class PurchaseItemData
{
    public function __construct(
        public readonly string $productId,
        public readonly int $quantity,
        public readonly float $unitCost,
        public readonly float $discount,
        public readonly float $tax,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            productId: $data['product_id'],
            quantity: $data['quantity'],
            unitCost: $data['unit_cost'],
            discount: $data['discount'] ?? 0,
            tax: $data['tax'] ?? 0,
        );
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'quantity' => $this->quantity,
            'unit_cost' => $this->unitCost,
            'discount' => $this->discount,
            'tax' => $this->tax,
        ];
    }

    public function lineTotal(): float
    {
        return ($this->unitCost * $this->quantity) - $this->discount + $this->tax;
    }
}
