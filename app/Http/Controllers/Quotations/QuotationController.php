<?php

namespace App\Http\Controllers\Quotations;

use App\Actions\ConvertQuotationToInvoiceAction;
use App\Actions\CreateQuotationAction;
use App\DTOs\InvoiceData;
use App\DTOs\QuotationData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Quotations\ConvertQuotationToInvoiceRequest;
use App\Http\Requests\Quotations\StoreQuotationRequest;
use App\Http\Requests\Quotations\UpdateQuotationRequest;
use App\Models\Customer;
use App\Models\Product;
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
            ->with(['customer', 'invoice', 'quotationItems'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($quotation) {
                // Calculate grand_total from items if not set in database
                $grandTotal = $quotation->grand_total;
                if ($grandTotal === null || $grandTotal === 0) {
                    $grandTotal = $quotation->quotationItems->sum('calculated_line_total');
                }

                return [
                    'id' => $quotation->id,
                    'quotation_number' => $quotation->quotation_number,
                    'quotation_date' => $quotation->quotation_date->format('Y-m-d'),
                    'customer_name' => $quotation->customer?->name ?? 'N/A',
                    'grand_total' => $grandTotal,
                    'status' => $quotation->status,
                    'invoice_id' => $quotation->invoice?->id,
                ];
            });

        return Inertia::render('quotations/index', [
            'quotations' => $quotations,
        ]);
    }

    public function create(): Response
    {
        $customers = Customer::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'selling_price']);

        return Inertia::render('quotations/create', [
            'customers' => $customers,
            'products' => $products,
        ]);
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
        $quotation->customer_name = $quotation->customer?->name ?? 'N/A';
        $quotation->customer_phone = $quotation->customer?->phone ?? null;
        $quotation->customer_email = $quotation->customer?->email ?? null;
        $quotation->items = $quotation->quotationItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product_name' => $item->product->name ?? 'N/A',
                'product_sku' => $item->product->sku ?? 'N/A',
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'discount' => $item->discount,
                'tax' => $item->tax,
                'subtotal' => $item->line_total,
            ];
        });
        // Calculate grand_total from items if not set in database
        $grandTotal = $quotation->grand_total;
        if ($grandTotal === null || $grandTotal === 0) {
            $grandTotal = $quotation->quotationItems->sum('calculated_line_total');
        }
        $quotation->grand_total = $grandTotal;

        return Inertia::render('quotations/show', [
            'quotation' => $quotation,
        ]);
    }

    public function edit(Quotation $quotation): Response
    {
        $customers = Customer::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'selling_price']);

        $quotation->load('quotationItems');
        $quotation->items = $quotation->quotationItems->map(function ($item) {
            return [
                'product_id' => (string) $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => (string) $item->unit_price,
                'discount' => $item->discount,
                'tax' => $item->tax,
            ];
        });

        return Inertia::render('quotations/edit', [
            'quotation' => $quotation,
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): RedirectResponse
    {
        $validated = $request->validated();

        // Keep existing quotation number if not provided
        if (! isset($validated['quotation_number'])) {
            $validated['quotation_number'] = $quotation->quotation_number;
        }

        $data = QuotationData::fromArray($validated);
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
