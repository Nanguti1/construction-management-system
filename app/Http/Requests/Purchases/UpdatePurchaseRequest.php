<?php

namespace App\Http\Requests\Purchases;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('edit purchases');
    }

    public function rules(): array
    {
        return [
            'supplier_id' => ['sometimes', 'required', 'exists:suppliers,id'],
            'purchase_number' => ['nullable', 'string', 'max:50'],
            'purchase_date' => ['sometimes', 'required', 'date'],
            'status' => ['sometimes', 'required', 'string', 'in:pending,received,cancelled'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['sometimes', 'required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'items.*.tax' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
