<?php

namespace App\Http\Requests\Quotations;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('create quotations');
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'quotation_number' => ['nullable', 'string', 'max:50'],
            'quotation_date' => ['required', 'date'],
            'expiry_date' => ['nullable', 'date', 'after:quotation_date'],
            'status' => ['sometimes', 'required', 'string', 'in:draft,sent,accepted,rejected,expired'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'items.*.tax' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
