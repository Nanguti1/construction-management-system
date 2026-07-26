<?php

namespace App\Actions;

use App\DTOs\SupplierData;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateSupplierAction
{
    public function execute(SupplierData $data): Supplier
    {
        return DB::transaction(function () use ($data) {
            $supplier = Supplier::create([
                'company_name' => $data->companyName,
                'contact_person' => $data->contactPerson,
                'phone' => $data->phone,
                'email' => $data->email,
                'address' => $data->address,
                'tax_pin' => $data->taxPin,
                'notes' => $data->notes,
                'is_active' => $data->isActive,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            Log::info('Supplier created', ['supplier_id' => $supplier->id]);

            return $supplier;
        });
    }
}
