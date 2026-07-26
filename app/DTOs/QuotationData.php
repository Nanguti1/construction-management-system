<?php

namespace App\DTOs;

class QuotationData
{
    public function __construct(
        public readonly string $customerId,
        public readonly ?string $quotationNumber,
        public readonly ?string $date,
        public readonly ?string $expiryDate,
        public readonly string $status,
        public readonly ?string $notes,
        public readonly array $items,
    ) {}

    public static function fromArray(array $data): self
    {
        $items = array_map(
            fn ($item) => ItemData::fromArray($item),
            $data['items'] ?? []
        );

        return new self(
            customerId: $data['customer_id'],
            quotationNumber: $data['quotation_number'] ?? null,
            date: $data['quotation_date'] ?? $data['date'] ?? null,
            expiryDate: $data['expiry_date'] ?? null,
            status: $data['status'] ?? 'draft',
            notes: $data['notes'] ?? null,
            items: $items,
        );
    }

    public function toArray(): array
    {
        return [
            'customer_id' => $this->customerId,
            'quotation_number' => $this->quotationNumber,
            'quotation_date' => $this->date,
            'expiry_date' => $this->expiryDate,
            'status' => $this->status,
            'notes' => $this->notes,
            'items' => array_map(fn ($item) => $item->toArray(), $this->items),
        ];
    }
}
