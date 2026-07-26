<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case PARTIALLY_PAID = 'partially_paid';
    case PAID = 'paid';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::PENDING => 'Pending',
            self::PARTIALLY_PAID => 'Partially Paid',
            self::PAID => 'Paid',
            self::CANCELLED => 'Cancelled',
        };
    }

    public function canBePaid(): bool
    {
        return in_array($this, [self::DRAFT, self::PENDING, self::PARTIALLY_PAID]);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this, [self::DRAFT, self::PENDING, self::PARTIALLY_PAID]);
    }
}
