<?php

namespace App\Actions;

use App\Enums\InvoiceStatus;
use App\Exceptions\InvoiceAlreadyPaidException;
use App\Models\Invoice;
use App\Support\InventoryManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VoidInvoiceAction
{
    public function __construct(
        private InventoryManager $inventoryManager
    ) {}

    public function execute(Invoice $invoice): Invoice
    {
        return DB::transaction(function () use ($invoice) {
            if ($invoice->status === InvoiceStatus::PAID->value) {
                throw InvoiceAlreadyPaidException::forInvoice($invoice->invoice_number);
            }

            // Reverse stock movements
            foreach ($invoice->invoiceItems as $item) {
                $this->inventoryManager->recordReturnMovement(
                    $item->product_id,
                    $item->quantity,
                    $invoice->getMorphClass(),
                    $invoice->id,
                    "Void Invoice: {$invoice->invoice_number}"
                );
            }

            $invoice->update([
                'status' => InvoiceStatus::CANCELLED->value,
                'updated_by' => auth()->id(),
            ]);

            Log::info('Invoice voided', ['invoice_id' => $invoice->id, 'invoice_number' => $invoice->invoice_number]);

            return $invoice->fresh();
        });
    }
}