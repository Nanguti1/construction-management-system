<?php

namespace App\Actions;

use App\Concerns\CalculatesTotals;
use App\DTOs\InvoiceData;
use App\DTOs\ItemData;
use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Support\DocumentNumberGenerator;
use App\Support\InventoryManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateInvoiceAction
{
    use CalculatesTotals;

    public function __construct(
        private InventoryManager $inventoryManager
    ) {}

    public function execute(InvoiceData $data): Invoice
    {
        return DB::transaction(function () use ($data) {
            $invoice = Invoice::create([
                'customer_id' => $data->customerId,
                'quotation_id' => $data->quotationId,
                'invoice_number' => $data->invoiceNumber,
                'invoice_date' => $data->invoiceDate,
                'due_date' => $data->dueDate,
                'status' => $data->status,
                'notes' => $data->notes,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            foreach ($data->items as $itemData) {
                $this->createInvoiceItem($invoice, $itemData);
            }

            // Only create stock movements if invoice is not in draft status
            if ($data->status !== InvoiceStatus::DRAFT->value) {
                foreach ($data->items as $itemData) {
                    $this->inventoryManager->recordSaleMovement(
                        $itemData->productId,
                        $itemData->quantity,
                        $invoice->getMorphClass(),
                        $invoice->id,
                        "Invoice: {$invoice->invoice_number}"
                    );
                }
            }

            Log::info('Invoice created', ['invoice_id' => $invoice->id, 'invoice_number' => $invoice->invoice_number]);

            return $invoice->load('invoiceItems');
        });
    }

    protected function createInvoiceItem(Invoice $invoice, ItemData $itemData): InvoiceItem
    {
        return InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'product_id' => $itemData->productId,
            'quantity' => $itemData->quantity,
            'unit_price' => $itemData->unitPrice,
            'discount' => $itemData->discount,
            'tax' => $itemData->tax,
            'line_total' => $itemData->lineTotal(),
        ]);
    }
}
