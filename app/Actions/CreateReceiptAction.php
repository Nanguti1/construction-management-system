<?php

namespace App\Actions;

use App\Exceptions\DuplicateReceiptException;
use App\Models\Payment;
use App\Models\Receipt;
use App\Support\DocumentNumberGenerator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateReceiptAction
{
    public function execute(Payment $payment): Receipt
    {
        return DB::transaction(function () use ($payment) {
            if ($payment->receipt) {
                throw new DuplicateReceiptException($payment->id);
            }

            $receipt = Receipt::create([
                'payment_id' => $payment->id,
                'receipt_number' => DocumentNumberGenerator::generateReceiptNumber(),
                'receipt_date' => $payment->payment_date,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            Log::info('Receipt created', ['receipt_id' => $receipt->id, 'payment_id' => $payment->id]);

            return $receipt;
        });
    }
}
