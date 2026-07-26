<?php

namespace App\Http\Controllers;

use App\Services\ReportingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(
        private ReportingService $reportingService
    ) {}

    public function sales(Request $request): Response
    {
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->startOfMonth();

        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now()->endOfDay();

        $report = $this->reportingService->getSalesReport($startDate, $endDate);

        return Inertia::render('reports/sales', [
            'report' => $report,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    public function purchases(Request $request): Response
    {
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : Carbon::now()->startOfMonth();

        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now()->endOfDay();

        $report = $this->reportingService->getPurchaseReport($startDate, $endDate);

        return Inertia::render('reports/purchases', [
            'report' => $report,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    public function inventory(): Response
    {
        $report = $this->reportingService->getInventoryReport();

        return Inertia::render('reports/inventory', [
            'report' => $report,
        ]);
    }
}
