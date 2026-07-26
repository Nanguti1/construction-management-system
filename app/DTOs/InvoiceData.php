<?php

namespace App\DTOs;

class InvoiceData
{
    public function __construct(
        public readonly string $customerId,
        public readonly ?string $quotationId,
        public readonly ?string $invoiceNumber,
        public readonly ?string $invoiceDate,
        public readonly ?string $dueDate,
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
            quotationId: $data['quotation_id'] ?? null,
            invoiceNumber: $data['invoice_number'] ?? null,
            invoiceDate: $data['invoice_date'] ?? null,
            dueDate: $data['due_date'] ?? null,
            status: $data['status'] ?? 'draft',
            notes: $data['notes'] ?? null,
            items: $items,
        );
    }

    public function toArray(): array
    {
        return [
            'customer_id' => $this->customerId,
            'quotation_id' => $this->quotationId,
            'invoice_number' => $this->invoiceNumber,
            'invoice_date' => $this->invoiceDate,
            'due_date' => $this->dueDate,
            'status' => $this->status,
            'notes' => $this->notes,
            'items' => array_map(fn ($item) => $item->toArray(), $this->items),
        ];
    }
}
