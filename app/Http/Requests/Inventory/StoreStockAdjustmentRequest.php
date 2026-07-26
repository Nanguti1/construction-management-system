<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('adjust inventory');
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'movement_type' => ['required', 'string', 'in:adjustment_in,adjustment_out,damage,loss,theft'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'movement_date' => ['required', 'date'],
        ];
    }
}
