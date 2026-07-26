<?php

namespace App\Concerns;

trait CalculatesTotals
{
    protected function calculateSubtotal(array $items, string $priceField = 'unit_price'): float
    {
        return array_reduce($items, function ($carry, $item) use ($priceField) {
            $unitPrice = is_array($item) ? $item[$priceField] : $item->$priceField;
            $quantity = is_array($item) ? $item['quantity'] : $item->quantity;
            return $carry + ($unitPrice * $quantity);
        }, 0);
    }

    protected function calculateTotalDiscount(array $items): float
    {
        return array_reduce($items, function ($carry, $item) {
            $discount = is_array($item) ? ($item['discount'] ?? 0) : $item->discount;
            return $carry + $discount;
        }, 0);
    }

    protected function calculateTotalTax(array $items): float
    {
        return array_reduce($items, function ($carry, $item) {
            $tax = is_array($item) ? ($item['tax'] ?? 0) : $item->tax;
            return $carry + $tax;
        }, 0);
    }

    protected function calculateGrandTotal(float $subtotal, float $discount, float $tax): float
    {
        return $subtotal - $discount + $tax;
    }
}
