<?php

namespace App\DTOs;

class CustomerData
{
    public function __construct(
        public readonly string $type,
        public readonly string $name,
        public readonly ?string $companyName,
        public readonly ?string $phone,
        public readonly ?string $email,
        public readonly ?string $address,
        public readonly ?string $taxPin,
        public readonly ?string $notes,
        public readonly bool $isActive,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            type: $data['type'],
            name: $data['name'],
            companyName: $data['company_name'] ?? null,
            phone: $data['phone'] ?? null,
            email: $data['email'] ?? null,
            address: $data['address'] ?? null,
            taxPin: $data['tax_pin'] ?? null,
            notes: $data['notes'] ?? null,
            isActive: $data['is_active'] ?? true,
        );
    }

    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'name' => $this->name,
            'company_name' => $this->companyName,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'tax_pin' => $this->taxPin,
            'notes' => $this->notes,
            'is_active' => $this->isActive,
        ];
    }
}
