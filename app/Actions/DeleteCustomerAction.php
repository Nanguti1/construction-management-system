<?php

namespace App\Actions;

use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeleteCustomerAction
{
    public function execute(Customer $customer): bool
    {
        return DB::transaction(function () use ($customer) {
            $customerId = $customer->id;
            $result = $customer->delete();

            if ($result) {
                Log::info('Customer deleted', ['customer_id' => $customerId]);
            }

            return $result;
        });
    }
}
