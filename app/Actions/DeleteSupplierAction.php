<?php

namespace App\Actions;

use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeleteSupplierAction
{
    public function execute(Supplier $supplier): void
    {
        DB::transaction(function () use ($supplier) {
            $supplier->delete();

            Log::info('Supplier deleted', ['supplier_id' => $supplier->id]);
        });
    }
}
