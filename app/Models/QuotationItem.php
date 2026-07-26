<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'quotation_id',
        'product_id',
        'quantity',
        'unit_price',
        'discount',
        'tax',
        'line_total',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'discount' => 'decimal:2',
            'tax' => 'decimal:2',
            'line_total' => 'decimal:2',
        ];
    }

    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getCalculatedLineTotalAttribute(): float
    {
        $subtotal = $this->unit_price * $this->quantity;
        $discountAmount = $subtotal * ($this->discount / 100);
        $taxAmount = ($subtotal - $discountAmount) * ($this->tax / 100);

        return $subtotal - $discountAmount + $taxAmount;
    }
}
