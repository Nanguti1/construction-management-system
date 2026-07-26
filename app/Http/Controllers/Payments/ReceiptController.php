<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Receipt;
use Inertia\Inertia;
use Inertia\Response;

class ReceiptController extends Controller
{
    public function show(Receipt $receipt): Response
    {
        $receipt->load(['payment.invoice.customer', 'payment.invoice.invoiceItems']);

        return Inertia::render('receipts/show', [
            'receipt' => $receipt,
        ]);
    }
}
