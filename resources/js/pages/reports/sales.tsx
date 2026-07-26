import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, Download, DollarSign, FileText, Users } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface SalesReportProps {
    report: {
        total_sales: number;
        total_payments: number;
        outstanding_balance: number;
        invoice_count: number;
        invoices: any[];
    };
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function SalesReport({ report, filters }: SalesReportProps) {
    return (
        <>
            <Head title="Sales Report" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Sales Report</h1>
                        <p className="text-muted-foreground">
                            View and analyze sales data from {filters.start_date} to {filters.end_date}
                        </p>
                    </div>
                    <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Sales
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${parseFloat(report.total_sales || 0).toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Payments
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${parseFloat(report.total_payments || 0).toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Outstanding Balance
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${parseFloat(report.outstanding_balance || 0).toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Invoices
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {report.invoice_count}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Invoice Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Invoice #</th>
                                        <th className="text-left p-2">Customer</th>
                                        <th className="text-left p-2">Date</th>
                                        <th className="text-left p-2">Status</th>
                                        <th className="text-right p-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.invoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b">
                                            <td className="p-2">{invoice.invoice_number}</td>
                                            <td className="p-2">{invoice.customer?.name || 'N/A'}</td>
                                            <td className="p-2">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                                            <td className="p-2 capitalize">{invoice.status}</td>
                                            <td className="p-2 text-right">${parseFloat(invoice.grand_total || 0).toFixed(2)}</td>
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

SalesReport.layout = {
    breadcrumbs: [
        {
            title: 'Reports',
            href: '/reports',
        },
        {
            title: 'Sales Report',
            href: '/reports/sales',
        },
    ],
};
