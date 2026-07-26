<?php

namespace App\Enums;

enum PurchaseStatus: string
{
    case PENDING = 'pending';
    case RECEIVED = 'received';
    case CANCELLED = 'cancelled';
    case PARTIAL = 'partial';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::RECEIVED => 'Received',
            self::CANCELLED => 'Cancelled',
            self::PARTIAL => 'Partial',
        };
    }

    public function canBeReceived(): bool
    {
        return in_array($this, [self::PENDING, self::PARTIAL]);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this, [self::PENDING, self::PARTIAL]);
    }
}
