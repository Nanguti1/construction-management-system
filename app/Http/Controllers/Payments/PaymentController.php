<?php

namespace App\Http\Controllers\Payments;

use App\Actions\RecordPaymentAction;
use App\DTOs\PaymentData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payments\StorePaymentRequest;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        private RecordPaymentAction $recordPaymentAction
    ) {}

    public function index(): Response
    {
        $payments = Payment::query()
            ->with(['invoice.customer', 'receipt'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'payment_date' => $payment->payment_date->format('Y-m-d'),
                    'amount' => $payment->amount,
                    'payment_method' => $payment->payment_method,
                    'reference_number' => $payment->reference_number,
                    'invoice_number' => $payment->invoice?->invoice_number ?? 'N/A',
                    'customer_name' => $payment->invoice?->customer?->name ?? 'N/A',
                ];
            });

        return Inertia::render('payments/index', [
            'payments' => $payments,
        ]);
    }

    public function create(): Response
    {
        $invoices = Invoice::query()
            ->with(['customer', 'payments', 'invoiceItems'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($invoice) {
                $paidAmount = $invoice->payments->sum('amount');
                $grandTotal = $invoice->grand_total ?? $invoice->invoiceItems->sum('calculated_line_total');

                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'customer_name' => $invoice->customer?->name ?? 'N/A',
                    'outstanding_balance' => $grandTotal - $paidAmount,
                    'status' => $invoice->status,
                ];
            });

        return Inertia::render('payments/create', [
            'invoices' => $invoices,
        ]);
    }

    public function store(StorePaymentRequest $request): RedirectResponse
    {
        $data = PaymentData::fromArray($request->validated());
        $payment = $this->recordPaymentAction->execute($data);

        return redirect()->route('payments.show', $payment)
            ->with('success', 'Payment recorded successfully.');
    }

    public function show(Payment $payment): Response
    {
        $payment->load(['invoice.customer', 'receipt']);

        $payment->invoice_number = $payment->invoice?->invoice_number ?? 'N/A';
        $payment->customer_name = $payment->invoice?->customer?->name ?? 'N/A';
        $payment->customer_phone = $payment->invoice?->customer?->phone ?? null;
        $payment->customer_email = $payment->invoice?->customer?->email ?? null;

        return Inertia::render('payments/show', [
            'payment' => $payment,
        ]);
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        return redirect()->route('payments.index')
            ->with('success', 'Payment deleted successfully.');
    }
}
