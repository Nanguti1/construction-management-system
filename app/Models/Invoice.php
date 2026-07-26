<?php

namespace App\Models;

use App\Concerns\HasInventoryMovements;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, HasInventoryMovements, HasUuids, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'quotation_id',
        'invoice_number',
        'invoice_date',
        'due_date',
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
            'invoice_date' => 'date',
            'due_date' => 'date',
        ];
    }

    public function getOutstandingBalanceAttribute(): float
    {
        $grandTotal = $this->grand_total ?? 0;
        $paidAmount = $this->payments()->sum('amount');

        return $grandTotal - $paidAmount;
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
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
