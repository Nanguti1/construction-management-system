<?php

namespace App\Enums;

enum StockMovementType: string
{
    case PURCHASE = 'purchase';
    case SALE = 'sale';
    case ADJUSTMENT = 'adjustment';
    case OPENING_STOCK = 'opening_stock';
    case RETURN = 'return';

    public function label(): string
    {
        return match ($this) {
            self::PURCHASE => 'Purchase',
            self::SALE => 'Sale',
            self::ADJUSTMENT => 'Adjustment',
            self::OPENING_STOCK => 'Opening Stock',
            self::RETURN => 'Return',
        };
    }

    public function increasesStock(): bool
    {
        return in_array($this, [self::PURCHASE, self::OPENING_STOCK]);
    }

    public function decreasesStock(): bool
    {
        return in_array($this, [self::SALE, self::RETURN]);
    }
}
