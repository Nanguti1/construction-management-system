<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\CreateInvoiceAction;
use App\Actions\UpdateInvoiceAction;
use App\Actions\VoidInvoiceAction;
use App\DTOs\InvoiceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Invoices\StoreInvoiceRequest;
use App\Http\Requests\Invoices\UpdateInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function __construct(
        private CreateInvoiceAction $createInvoiceAction,
        private UpdateInvoiceAction $updateInvoiceAction,
        private VoidInvoiceAction $voidInvoiceAction
    ) {}

    public function index(): Response
    {
        $invoices = Invoice::query()
            ->with(['customer', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Invoices/Create');
    }

    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $data = InvoiceData::fromArray($request->validated());
        $this->createInvoiceAction->execute($data);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice created successfully.');
    }

    public function show(Invoice $invoice): Response
    {
        $invoice->load(['customer', 'invoiceItems.product', 'payments', 'quotation']);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice): Response
    {
        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
        ]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $data = InvoiceData::fromArray($request->validated());
        $this->updateInvoiceAction->execute($invoice, $data);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice updated successfully.');
    }

    public function void(Invoice $invoice): RedirectResponse
    {
        $this->voidInvoiceAction->execute($invoice);

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice voided successfully.');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }
}