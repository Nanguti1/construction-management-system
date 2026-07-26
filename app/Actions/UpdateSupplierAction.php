<?php

namespace App\Actions;

use App\DTOs\SupplierData;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateSupplierAction
{
    public function execute(Supplier $supplier, SupplierData $data): Supplier
    {
        return DB::transaction(function () use ($supplier, $data) {
            $supplier->update([
                'company_name' => $data->companyName,
                'contact_person' => $data->contactPerson,
                'phone' => $data->phone,
                'email' => $data->email,
                'address' => $data->address,
                'notes' => $data->notes,
                'is_active' => $data->isActive,
                'updated_by' => auth()->id(),
            ]);

            Log::info('Supplier updated', ['supplier_id' => $supplier->id]);

            return $supplier->fresh();
        });
    }
}
