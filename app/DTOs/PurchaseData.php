<?php

namespace App\DTOs;

class PurchaseData
{
    public function __construct(
        public readonly string $supplierId,
        public readonly string $purchaseNumber,
        public readonly string $purchaseDate,
        public readonly string $status,
        public readonly ?string $notes,
        public readonly array $items,
    ) {}

    public static function fromArray(array $data): self
    {
        $items = array_map(
            fn($item) => PurchaseItemData::fromArray($item),
            $data['items'] ?? []
        );

        return new self(
            supplierId: $data['supplier_id'],
            purchaseNumber: $data['purchase_number'],
            purchaseDate: $data['purchase_date'],
            status: $data['status'] ?? 'pending',
            notes: $data['notes'] ?? null,
            items: $items,
        );
    }

    public function toArray(): array
    {
        return [
            'supplier_id' => $this->supplierId,
            'purchase_number' => $this->purchaseNumber,
            'purchase_date' => $this->purchaseDate,
            'status' => $this->status,
            'notes' => $this->notes,
            'items' => array_map(fn($item) => $item->toArray(), $this->items),
        ];
    }
}
