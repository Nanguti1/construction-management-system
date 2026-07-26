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
            $unitPrice = is_array($item) ? $item['unit_price'] : $item->unitPrice;
            $quantity = is_array($item) ? $item['quantity'] : $item->quantity;
            $discountPercent = is_array($item) ? ($item['discount'] ?? 0) : $item->discount;

            $subtotal = $unitPrice * $quantity;
            $discountAmount = $subtotal * ($discountPercent / 100);

            return $carry + $discountAmount;
        }, 0);
    }

    protected function calculateTotalTax(array $items): float
    {
        return array_reduce($items, function ($carry, $item) {
            $unitPrice = is_array($item) ? $item['unit_price'] : $item->unitPrice;
            $quantity = is_array($item) ? $item['quantity'] : $item->quantity;
            $discountPercent = is_array($item) ? ($item['discount'] ?? 0) : $item->discount;
            $taxPercent = is_array($item) ? ($item['tax'] ?? 0) : $item->tax;

            $subtotal = $unitPrice * $quantity;
            $discountAmount = $subtotal * ($discountPercent / 100);
            $taxableAmount = $subtotal - $discountAmount;
            $taxAmount = $taxableAmount * ($taxPercent / 100);

            return $carry + $taxAmount;
        }, 0);
    }

    protected function calculateGrandTotal(float $subtotal, float $discount, float $tax): float
    {
        return $subtotal - $discount + $tax;
    }

    protected function calculateTotals(array $items): array
    {
        $subtotal = $this->calculateSubtotal($items);
        $discount = $this->calculateTotalDiscount($items);
        $tax = $this->calculateTotalTax($items);
        $grandTotal = $this->calculateGrandTotal($subtotal, $discount, $tax);

        return [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'grand_total' => $grandTotal,
        ];
    }
}
