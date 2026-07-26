<?php

namespace App\Http\Requests\Invoices;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('edit invoices');
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['sometimes', 'required', 'exists:customers,id'],
            'quotation_id' => ['nullable', 'exists:quotations,id'],
            'invoice_number' => ['sometimes', 'nullable', 'string', 'max:50'],
            'invoice_date' => ['sometimes', 'required', 'date'],
            'due_date' => ['nullable', 'date', 'after:invoice_date'],
            'status' => ['sometimes', 'required', 'string', 'in:draft,pending,partially_paid,paid,cancelled'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['sometimes', 'required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'items.*.tax' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
