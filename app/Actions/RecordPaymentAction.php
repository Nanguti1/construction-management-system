<?php

namespace App\Actions;

use App\DTOs\PaymentData;
use App\Enums\InvoiceStatus;
use App\Exceptions\DuplicateReceiptException;
use App\Exceptions\InvoiceAlreadyPaidException;
use App\Exceptions\InvalidPaymentException;
use App\Models\Invoice;
use App\Models\Payment;
use App\Support\DocumentNumberGenerator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RecordPaymentAction
{
    public function execute(PaymentData $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $invoice = Invoice::findOrFail($data->invoiceId);
            
            $this->validatePayment($invoice, $data->amount);
            
            $payment = Payment::create([
                'invoice_id' => $data->invoiceId,
                'payment_date' => $data->paymentDate,
                'amount' => $data->amount,
                'payment_method' => $data->paymentMethod,
                'reference_number' => $data->referenceNumber,
                'notes' => $data->notes,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            // Update invoice status based on payment
            $this->updateInvoiceStatus($invoice);

            // Generate receipt
            $this->generateReceipt($payment);

            Log::info('Payment recorded', [
                'payment_id' => $payment->id,
                'invoice_id' => $invoice->id,
                'amount' => $data->amount,
            ]);

            return $payment->load('receipt');
        });
    }

    protected function validatePayment(Invoice $invoice, float $amount): void
    {
        $status = InvoiceStatus::from($invoice->status);
        
        if (!$status->canBePaid()) {
            throw InvalidPaymentException::invoiceCannotAcceptPayment(
                $invoice->invoice_number,
                $status->label()
            );
        }

        $outstandingBalance = $this->getOutstandingBalance($invoice);
        
        if ($amount > $outstandingBalance) {
            throw InvalidPaymentException::exceedsBalance(
                $invoice->invoice_number,
                $amount,
                $outstandingBalance
            );
        }
    }

    protected function getOutstandingBalance(Invoice $invoice): float
    {
        $total = $invoice->invoiceItems->sum('line_total');
        $paid = $invoice->payments->sum('amount');
        return $total - $paid;
    }

    protected function updateInvoiceStatus(Invoice $invoice): void
    {
        $outstandingBalance = $this->getOutstandingBalance($invoice);
        
        if ($outstandingBalance <= 0) {
            $invoice->update([
                'status' => InvoiceStatus::PAID->value,
                'updated_by' => auth()->id(),
            ]);
        } else {
            $invoice->update([
                'status' => InvoiceStatus::PARTIALLY_PAID->value,
                'updated_by' => auth()->id(),
            ]);
        }
    }

    protected function generateReceipt(Payment $payment): void
    {
        if ($payment->receipt) {
            throw new DuplicateReceiptException($payment->id);
        }

        $payment->receipt()->create([
            'receipt_number' => DocumentNumberGenerator::generateReceiptNumber(),
            'receipt_date' => $payment->payment_date,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        Log::info('Receipt generated', ['payment_id' => $payment->id]);
    }
}
