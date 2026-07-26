<?php

namespace App\Actions;

use App\Enums\PurchaseStatus;
use App\Models\Purchase;
use App\Support\InventoryManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReceivePurchaseAction
{
    public function __construct(
        private InventoryManager $inventoryManager
    ) {}

    public function execute(Purchase $purchase): Purchase
    {
        return DB::transaction(function () use ($purchase) {
            if (! in_array($purchase->status, [PurchaseStatus::PENDING->value, PurchaseStatus::PARTIAL->value])) {
                throw new \Exception('Purchase cannot be received in its current status');
            }

            $purchase->update([
                'status' => PurchaseStatus::RECEIVED->value,
                'updated_by' => auth()->id(),
            ]);

            // Create stock movements for all items
            foreach ($purchase->purchaseItems as $item) {
                $this->inventoryManager->recordPurchaseMovement(
                    $item->product_id,
                    $item->quantity,
                    $purchase->getMorphClass(),
                    $purchase->id,
                    "Purchase received: {$purchase->purchase_number}"
                );
            }

            Log::info('Purchase received', ['purchase_id' => $purchase->id, 'purchase_number' => $purchase->purchase_number]);

            return $purchase->fresh();
        });
    }
}
