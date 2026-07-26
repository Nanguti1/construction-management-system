<?php

namespace App\Services;

use App\Actions\ConvertQuotationToInvoiceAction;
use App\Actions\CreateInvoiceAction;
use App\Actions\CreateQuotationAction;
use App\Actions\RecordPaymentAction;
use App\DTOs\InvoiceData;
use App\DTOs\PaymentData;
use App\DTOs\QuotationData;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Quotation;

class SalesService
{
    public function __construct(
        private CreateQuotationAction $createQuotationAction,
        private CreateInvoiceAction $createInvoiceAction,
        private ConvertQuotationToInvoiceAction $convertQuotationToInvoiceAction,
        private RecordPaymentAction $recordPaymentAction
    ) {}

    public function createQuotation(QuotationData $data): Quotation
    {
        return $this->createQuotationAction->execute($data);
    }

    public function createInvoice(InvoiceData $data): Invoice
    {
        return $this->createInvoiceAction->execute($data);
    }

    public function convertQuotationToInvoice(Quotation $quotation, InvoiceData $data): Invoice
    {
        return $this->convertQuotationToInvoiceAction->execute($quotation, $data);
    }

    public function recordPayment(PaymentData $data): Payment
    {
        return $this->recordPaymentAction->execute($data);
    }
}