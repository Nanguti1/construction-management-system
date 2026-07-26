<?php

namespace App\Http\Controllers;

use App\Services\ReportingService;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private ReportingService $reportingService
    ) {}

    public function index(): Response
    {
        $startDate = Carbon::now()->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        $salesReport = $this->reportingService->getSalesReport($startDate, $endDate);
        $purchaseReport = $this->reportingService->getPurchaseReport($startDate, $endDate);
        $inventoryReport = $this->reportingService->getInventoryReport();
        $customerReport = $this->reportingService->getCustomerReport($startDate, $endDate);
        $profitLossReport = $this->reportingService->getProfitLossReport($startDate, $endDate);
        $quotationConversion = $this->reportingService->getQuotationConversionRate($startDate, $endDate);

        return Inertia::render('dashboard', [
            'sales_report' => $salesReport,
            'purchase_report' => $purchaseReport,
            'inventory_report' => $inventoryReport,
            'customer_report' => $customerReport,
            'profit_loss_report' => $profitLossReport,
            'quotation_conversion' => $quotationConversion,
        ]);
    }
}
