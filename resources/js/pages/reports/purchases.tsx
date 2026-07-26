import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, Download, DollarSign, FileText, Package } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PurchaseReportProps {
    report: {
        total_purchases: number;
        purchase_count: number;
        purchases: any[];
    };
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function PurchaseReport({ report, filters }: PurchaseReportProps) {
    return (
        <>
            <Head title="Purchase Report" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Purchase Report</h1>
                        <p className="text-muted-foreground">
                            View and analyze purchase data from {filters.start_date} to {filters.end_date}
                        </p>
                    </div>
                    <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Purchases
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${parseFloat(report.total_purchases || 0).toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Purchase Orders
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {report.purchase_count}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Order Value
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${report.purchase_count > 0 ? (parseFloat(report.total_purchases || 0) / report.purchase_count).toFixed(2) : '0.00'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Purchase Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">PO #</th>
                                        <th className="text-left p-2">Supplier</th>
                                        <th className="text-left p-2">Date</th>
                                        <th className="text-left p-2">Status</th>
                                        <th className="text-right p-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.purchases.map((purchase) => (
                                        <tr key={purchase.id} className="border-b">
                                            <td className="p-2">{purchase.purchase_number}</td>
                                            <td className="p-2">{purchase.supplier?.name || 'N/A'}</td>
                                            <td className="p-2">{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                                            <td className="p-2 capitalize">{purchase.status}</td>
                                            <td className="p-2 text-right">${parseFloat(purchase.grand_total || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PurchaseReport.layout = {
    breadcrumbs: [
        {
            title: 'Reports',
            href: '/reports',
        },
        {
            title: 'Purchase Report',
            href: '/reports/purchases',
        },
    ],
};
