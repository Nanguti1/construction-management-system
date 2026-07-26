<?php

namespace App\Actions;

use App\Concerns\CalculatesTotals;
use App\DTOs\ItemData;
use App\DTOs\QuotationData;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Support\DocumentNumberGenerator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateQuotationAction
{
    use CalculatesTotals;

    public function execute(QuotationData $data): Quotation
    {
        return DB::transaction(function () use ($data) {
            $totals = $this->calculateTotals($data->items);

            $quotation = Quotation::create([
                'customer_id' => $data->customerId,
                'quotation_number' => $data->quotationNumber ?? DocumentNumberGenerator::generateQuotationNumber(),
                'quotation_date' => $data->date,
                'expiry_date' => $data->expiryDate,
                'status' => $data->status,
                'notes' => $data->notes,
                'subtotal' => $totals['subtotal'],
                'tax' => $totals['tax'],
                'discount' => $totals['discount'],
                'grand_total' => $totals['grand_total'],
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            foreach ($data->items as $itemData) {
                $this->createQuotationItem($quotation, $itemData);
            }

            Log::info('Quotation created', ['quotation_id' => $quotation->id, 'quotation_number' => $quotation->quotation_number]);

            return $quotation->load('quotationItems');
        });
    }

    protected function createQuotationItem(Quotation $quotation, ItemData $itemData): QuotationItem
    {
        return QuotationItem::create([
            'quotation_id' => $quotation->id,
            'product_id' => $itemData->productId,
            'quantity' => $itemData->quantity,
            'unit_price' => $itemData->unitPrice,
            'discount' => $itemData->discount,
            'tax' => $itemData->tax,
            'line_total' => $itemData->lineTotal(),
        ]);
    }
}
