<?php

namespace App\Actions;

use App\DTOs\InvoiceData;
use App\DTOs\ItemData;
use App\Enums\InvoiceStatus;
use App\Enums\QuotationStatus;
use App\Exceptions\InvalidQuotationException;
use App\Models\Quotation;
use App\Support\DocumentNumberGenerator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConvertQuotationToInvoiceAction
{
    public function execute(Quotation $quotation, InvoiceData $data): Invoice
    {
        return DB::transaction(function () use ($quotation, $data) {
            if ($quotation->invoice) {
                throw InvalidQuotationException::alreadyConverted($quotation->quotation_number);
            }

            $status = QuotationStatus::from($quotation->status);
            if (!$status->canBeConvertedToInvoice()) {
                throw InvalidQuotationException::cannotConvert(
                    "Quotation status '{$status->label()}' does not allow conversion"
                );
            }

            // Prepare invoice data from quotation
            $items = $quotation->quotationItems->map(function ($item) {
                return new ItemData(
                    productId: $item->product_id,
                    quantity: $item->quantity,
                    unitPrice: $item->unit_price,
                    discount: $item->discount,
                    tax: $item->tax,
                );
            })->toArray();

            $invoiceData = new InvoiceData(
                customerId: $quotation->customer_id,
                quotationId: $quotation->id,
                invoiceNumber: $data->invoiceNumber,
                invoiceDate: $data->invoiceDate,
                dueDate: $data->dueDate,
                status: $data->status,
                notes: $data->notes,
                items: $items,
            );

            // Create invoice using the CreateInvoiceAction
            $createInvoiceAction = new CreateInvoiceAction();
            $invoice = $createInvoiceAction->execute($invoiceData);

            // Update quotation status
            $quotation->update([
                'status' => QuotationStatus::ACCEPTED->value,
                'updated_by' => auth()->id(),
            ]);

            Log::info('Quotation converted to invoice', [
                'quotation_id' => $quotation->id,
                'invoice_id' => $invoice->id,
            ]);

            return $invoice;
        });
    }
}
