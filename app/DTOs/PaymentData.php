<?php

namespace App\DTOs;

class PaymentData
{
    public function __construct(
        public readonly string $invoiceId,
        public readonly string $paymentDate,
        public readonly float $amount,
        public readonly string $paymentMethod,
        public readonly ?string $referenceNumber,
        public readonly ?string $notes,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            invoiceId: $data['invoice_id'],
            paymentDate: $data['payment_date'],
            amount: $data['amount'],
            paymentMethod: $data['payment_method'],
            referenceNumber: $data['reference_number'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'invoice_id' => $this->invoiceId,
            'payment_date' => $this->paymentDate,
            'amount' => $this->amount,
            'payment_method' => $this->paymentMethod,
            'reference_number' => $this->referenceNumber,
            'notes' => $this->notes,
        ];
    }
}
