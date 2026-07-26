<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\CreateInvoiceAction;
use App\Actions\UpdateInvoiceAction;
use App\Actions\VoidInvoiceAction;
use App\DTOs\InvoiceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Invoices\StoreInvoiceRequest;
use App\Http\Requests\Invoices\UpdateInvoiceRequest;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Quotation;
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
            ->with(['customer', 'payments', 'invoiceItems'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($invoice) {
                $paidAmount = $invoice->payments->sum('amount');

                // Calculate grand_total from items if not set in database
                $grandTotal = $invoice->grand_total;
                if ($grandTotal === null || $grandTotal === 0) {
                    $grandTotal = $invoice->invoiceItems->sum('calculated_line_total');
                }

                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'invoice_date' => $invoice->invoice_date->format('Y-m-d'),
                    'customer_name' => $invoice->customer?->name ?? 'N/A',
                    'grand_total' => $grandTotal,
                    'paid_amount' => $paidAmount,
                    'outstanding_balance' => $grandTotal - $paidAmount,
                    'status' => $invoice->status,
                ];
            });

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
        ]);
    }

    public function create(): Response
    {
        $customers = Customer::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $quotations = Quotation::query()
            ->where('status', 'accepted')
            ->whereDoesntHave('invoice')
            ->with('customer')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'quotation_number', 'customer_id']);

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'selling_price']);

        return Inertia::render('invoices/create', [
            'customers' => $customers,
            'quotations' => $quotations,
            'products' => $products,
        ]);
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

        $paidAmount = $invoice->payments->sum('amount');

        $invoice->customer_name = $invoice->customer?->name ?? 'N/A';
        $invoice->customer_phone = $invoice->customer?->phone ?? null;
        $invoice->customer_email = $invoice->customer?->email ?? null;
        $invoice->items = $invoice->invoiceItems->map(function ($item) {
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
        $grandTotal = $invoice->grand_total;
        if ($grandTotal === null || $grandTotal === 0) {
            $grandTotal = $invoice->invoiceItems->sum('calculated_line_total');
        }
        $invoice->grand_total = $grandTotal;
        $invoice->paid_amount = $paidAmount;
        $invoice->outstanding_balance = $grandTotal - $paidAmount;

        return Inertia::render('invoices/show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice): Response
    {
        $customers = Customer::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $quotations = Quotation::query()
            ->where('status', 'accepted')
            ->whereDoesntHave('invoice')
            ->orWhere('id', $invoice->quotation_id)
            ->with('customer')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'quotation_number', 'customer_id']);

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'selling_price']);

        $invoice->load('invoiceItems');
        $invoice->items = $invoice->invoiceItems->map(function ($item) {
            return [
                'product_id' => (string) $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => (string) $item->unit_price,
                'discount' => $item->discount,
                'tax' => $item->tax,
            ];
        });

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
            'customers' => $customers,
            'quotations' => $quotations,
            'products' => $products,
        ]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $validated = $request->validated();

        // Keep existing invoice number if not provided
        if (! isset($validated['invoice_number'])) {
            $validated['invoice_number'] = $invoice->invoice_number;
        }

        $data = InvoiceData::fromArray($validated);
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
