<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('edit products');
    }

    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'required', 'exists:product_categories,id'],
            'unit_id' => ['sometimes', 'required', 'exists:units,id'],
            'sku' => ['sometimes', 'required', 'string', 'max:50', 'unique:products,sku,'.$this->route('product')->id],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'cost_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'selling_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'minimum_stock' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
