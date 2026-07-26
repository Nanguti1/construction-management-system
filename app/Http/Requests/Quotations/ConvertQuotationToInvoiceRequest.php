<?php

namespace App\Http\Requests\Quotations;

use Illuminate\Foundation\Http\FormRequest;

class ConvertQuotationToInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('create invoices');
    }

    public function rules(): array
    {
        return [
            'invoice_number' => ['required', 'string', 'max:50'],
            'invoice_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date', 'after:invoice_date'],
            'status' => ['sometimes', 'required', 'string', 'in:draft,pending,partially_paid,paid,cancelled'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
