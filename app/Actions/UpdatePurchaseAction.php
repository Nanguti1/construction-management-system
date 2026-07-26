<?php

namespace App\Actions;

use App\DTOs\PurchaseData;
use App\DTOs\PurchaseItemData;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdatePurchaseAction
{
    public function execute(Purchase $purchase, PurchaseData $data): Purchase
    {
        return DB::transaction(function () use ($purchase, $data) {
            $purchase->update([
                'supplier_id' => $data->supplierId,
                'purchase_number' => $data->purchaseNumber,
                'purchase_date' => $data->purchaseDate,
                'status' => $data->status,
                'notes' => $data->notes,
                'updated_by' => auth()->id(),
            ]);

            // Delete existing items
            $purchase->purchaseItems()->delete();

            // Create new items
            foreach ($data->items as $itemData) {
                $this->createPurchaseItem($purchase, $itemData);
            }

            Log::info('Purchase updated', ['purchase_id' => $purchase->id]);

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