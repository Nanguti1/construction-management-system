<?php

namespace App\Actions;

use App\Concerns\CalculatesTotals;
use App\DTOs\PurchaseData;
use App\DTOs\PurchaseItemData;
use App\Enums\PurchaseStatus;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Support\DocumentNumberGenerator;
use App\Support\InventoryManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreatePurchaseAction
{
    use CalculatesTotals;

    public function __construct(
        private InventoryManager $inventoryManager
    ) {}

    public function execute(PurchaseData $data): Purchase
    {
        return DB::transaction(function () use ($data) {
            $purchase = Purchase::create([
                'supplier_id' => $data->supplierId,
                'purchase_number' => $data->purchaseNumber ?: DocumentNumberGenerator::generatePurchaseNumber(),
                'purchase_date' => $data->purchaseDate,
                'status' => $data->status,
                'notes' => $data->notes,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            foreach ($data->items as $itemData) {
                $this->createPurchaseItem($purchase, $itemData);
                
                // Create stock movement for received items
                if ($data->status === PurchaseStatus::RECEIVED->value) {
                    $this->inventoryManager->recordPurchaseMovement(
                        $itemData->productId,
                        $itemData->quantity,
                        $purchase->getMorphClass(),
                        $purchase->id,
                        "Purchase: {$purchase->purchase_number}"
                    );
                }
            }

            Log::info('Purchase created', ['purchase_id' => $purchase->id, 'purchase_number' => $purchase->purchase_number]);

            return $purchase->load('purchaseItems');
        });
    }

    protected function createPurchaseItem(Purchase $purchase, PurchaseItemData $itemData): PurchaseItem
    {
        return PurchaseItem::create([
            'purchase_id' => $purchase->id,
            'product_id' => $itemData->productId,
            'quantity' => $itemData->quantity,
            'unit_cost' => $itemData->unitCost,
            'discount' => $itemData->discount,
            'tax' => $itemData->tax,
            'line_total' => $itemData->lineTotal(),
        ]);
    }
}
