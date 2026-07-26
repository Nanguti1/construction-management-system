<?php

namespace App\Actions;

use App\DTOs\CustomerData;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateCustomerAction
{
    public function execute(Customer $customer, CustomerData $data): Customer
    {
        return DB::transaction(function () use ($customer, $data) {
            $customer->update([
                'type' => $data->type,
                'name' => $data->name,
                'company_name' => $data->companyName,
                'phone' => $data->phone,
                'email' => $data->email,
                'address' => $data->address,
                'tax_pin' => $data->taxPin,
                'notes' => $data->notes,
                'is_active' => $data->isActive,
                'updated_by' => auth()->id(),
            ]);

            Log::info('Customer updated', ['customer_id' => $customer->id]);

            return $customer->fresh();
        });
    }
}
