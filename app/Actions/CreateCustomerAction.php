<?php

namespace App\Actions;

use App\DTOs\CustomerData;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateCustomerAction
{
    public function execute(CustomerData $data): Customer
    {
        return DB::transaction(function () use ($data) {
            $customer = Customer::create([
                'type' => $data->type,
                'name' => $data->name,
                'company_name' => $data->companyName,
                'phone' => $data->phone,
                'email' => $data->email,
                'address' => $data->address,
                'tax_pin' => $data->taxPin,
                'notes' => $data->notes,
                'is_active' => $data->isActive,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            Log::info('Customer created', ['customer_id' => $customer->id]);

            return $customer;
        });
    }
}
