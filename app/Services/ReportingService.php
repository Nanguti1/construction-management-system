<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Quotation;
use App\Models\StockMovement;
use Carbon\Carbon;

class ReportingService
{
    public function getSalesReport(Carbon $startDate, Carbon $endDate): array
    {
        $invoices = Invoice::whereBetween('invoice_date', [$startDate, $endDate])
            ->with('customer', 'invoiceItems', 'payments')
            ->get();

        $totalSales = $invoices->sum('grand_total');
        $totalPayments = Payment::whereBetween('payment_date', [$startDate, $endDate])
            ->sum('amount');
        $outstandingBalance = $invoices->sum(function ($invoice) {
            return $invoice->outstanding_balance;
        });

        return [
            'total_sales' => $totalSales,
            'total_payments' => $totalPayments,
            'outstanding_balance' => $outstandingBalance,
            'invoice_count' => $invoices->count(),
            'invoices' => $invoices,
        ];
    }

    public function getPurchaseReport(Carbon $startDate, Carbon $endDate): array
    {
        $purchases = Purchase::whereBetween('purchase_date', [$startDate, $endDate])
            ->with('supplier', 'purchaseItems')
            ->get();

        $totalPurchases = $purchases->sum('grand_total');

        return [
            'total_purchases' => $totalPurchases,
            'purchase_count' => $purchases->count(),
            'purchases' => $purchases,
        ];
    }

    public function getInventoryReport(): array
    {
        $products = Product::with('category')->get();

        $stockLevels = $products->map(function ($product) {
            return [
                'product' => $product,
                'current_stock' => StockMovement::where('product_id', $product->id)
                    ->sum('quantity'),
            ];
        });

        return [
            'total_products' => $products->count(),
            'stock_levels' => $stockLevels,
        ];
    }

    public function getCustomerReport(Carbon $startDate, Carbon $endDate): array
    {
        $customers = Customer::with(['invoices' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('invoice_date', [$startDate, $endDate]);
        }])->get();

        $topCustomers = $customers->sortByDesc(function ($customer) {
            return $customer->invoices->sum('grand_total');
        })->take(10);

        return [
            'total_customers' => $customers->count(),
            'top_customers' => $topCustomers,
        ];
    }

    public function getProfitLossReport(Carbon $startDate, Carbon $endDate): array
    {
        $totalSales = Invoice::whereBetween('invoice_date', [$startDate, $endDate])
            ->sum('grand_total');

        $totalPurchases = Purchase::whereBetween('purchase_date', [$startDate, $endDate])
            ->sum('grand_total');

        $grossProfit = $totalSales - $totalPurchases;

        return [
            'total_sales' => $totalSales,
            'total_purchases' => $totalPurchases,
            'gross_profit' => $grossProfit,
        ];
    }

    public function getQuotationConversionRate(Carbon $startDate, Carbon $endDate): array
    {
        $totalQuotations = Quotation::whereBetween('quotation_date', [$startDate, $endDate])
            ->count();

        $convertedQuotations = Quotation::whereBetween('quotation_date', [$startDate, $endDate])
            ->whereHas('invoice')
            ->count();

        $conversionRate = $totalQuotations > 0
            ? ($convertedQuotations / $totalQuotations) * 100
            : 0;

        return [
            'total_quotations' => $totalQuotations,
            'converted_quotations' => $convertedQuotations,
            'conversion_rate' => $conversionRate,
        ];
    }
}
