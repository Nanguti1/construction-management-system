<?php

namespace App\Actions;

use App\Models\Purchase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeletePurchaseAction
{
    public function execute(Purchase $purchase): void
    {
        DB::transaction(function () use ($purchase) {
            $purchase->delete();

            Log::info('Purchase deleted', ['purchase_id' => $purchase->id]);
        });
    }
}