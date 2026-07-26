<?php

namespace App\Http\Controllers\Payments;

use App\Actions\RecordPaymentAction;
use App\DTOs\PaymentData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payments\StorePaymentRequest;
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
            ->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Payments/Create');
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

        return Inertia::render('Payments/Show', [
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