<?php

namespace App\DTOs;

class ItemData
{
    public function __construct(
        public readonly string $productId,
        public readonly int $quantity,
        public readonly float $unitPrice,
        public readonly float $discount,
        public readonly float $tax,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            productId: $data['product_id'],
            quantity: $data['quantity'],
            unitPrice: $data['unit_price'],
            discount: $data['discount'] ?? 0,
            tax: $data['tax'] ?? 0,
        );
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'quantity' => $this->quantity,
            'unit_price' => $this->unitPrice,
            'discount' => $this->discount,
            'tax' => $this->tax,
        ];
    }

    public function lineTotal(): float
    {
        $subtotal = $this->unitPrice * $this->quantity;
        $discountAmount = $subtotal * ($this->discount / 100);
        $taxAmount = ($subtotal - $discountAmount) * ($this->tax / 100);

        return $subtotal - $discountAmount + $taxAmount;
    }
}
