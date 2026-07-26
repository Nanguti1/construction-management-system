<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quotation extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'quotation_number',
        'quotation_date',
        'expiry_date',
        'status',
        'notes',
        'subtotal',
        'tax',
        'discount',
        'grand_total',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'quotation_date' => 'date',
            'expiry_date' => 'date',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
