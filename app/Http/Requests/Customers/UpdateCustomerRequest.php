<?php

namespace App\Http\Requests\Customers;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('edit customers');
    }

    public function rules(): array
    {
        return [
            'type' => ['sometimes', 'required', 'string', 'in:individual,company'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255', 'required_if:type,company'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'tax_pin' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
        ];
    }
}
