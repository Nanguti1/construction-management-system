<?php

namespace App\Http\Controllers\Quotations;

use App\Actions\CreateQuotationAction;
use App\Actions\ConvertQuotationToInvoiceAction;
use App\DTOs\QuotationData;
use App\DTOs\InvoiceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Quotations\StoreQuotationRequest;
use App\Http\Requests\Quotations\UpdateQuotationRequest;
use App\Http\Requests\Quotations\ConvertQuotationToInvoiceRequest;
use App\Models\Quotation;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuotationController extends Controller
{
    public function __construct(
        private CreateQuotationAction $createQuotationAction,
        private ConvertQuotationToInvoiceAction $convertQuotationToInvoiceAction
    ) {}

    public function index(): Response
    {
        $quotations = Quotation::query()
            ->with(['customer', 'invoice'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Quotations/Index', [
            'quotations' => $quotations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Quotations/Create');
    }

    public function store(StoreQuotationRequest $request): RedirectResponse
    {
        $data = QuotationData::fromArray($request->validated());
        $this->createQuotationAction->execute($data);

        return redirect()->route('quotations.index')
            ->with('success', 'Quotation created successfully.');
    }

    public function show(Quotation $quotation): Response
    {
        $quotation->load(['customer', 'quotationItems.product', 'invoice']);

        return Inertia::render('Quotations/Show', [
            'quotation' => $quotation,
        ]);
    }

    public function edit(Quotation $quotation): Response
    {
        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): RedirectResponse
    {
        $data = QuotationData::fromArray($request->validated());
        $quotation->update($data->toArray());

        return redirect()->route('quotations.index')
            ->with('success', 'Quotation updated successfully.');
    }

    public function convertToInvoice(ConvertQuotationToInvoiceRequest $request, Quotation $quotation): RedirectResponse
    {
        $data = new InvoiceData(
            customerId: $quotation->customer_id,
            quotationId: $quotation->id,
            invoiceNumber: $request->input('invoice_number'),
            invoiceDate: $request->input('invoice_date'),
            dueDate: $request->input('due_date'),
            status: $request->input('status', 'pending'),
            notes: $request->input('notes'),
            items: [], // Items will be populated from quotation
        );

        $invoice = $this->convertQuotationToInvoiceAction->execute($quotation, $data);

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Quotation converted to invoice successfully.');
    }

    public function destroy(Quotation $quotation): RedirectResponse
    {
        $quotation->delete();

        return redirect()->route('quotations.index')
            ->with('success', 'Quotation deleted successfully.');
    }
}