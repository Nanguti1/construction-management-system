import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/form-input';
import { FormDate } from '@/components/form/form-date';
import { FormSelect } from '@/components/form/form-select';
import { ArrowLeft, BarChart3, Download } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function SalesReport() {
    const customerOptions = [
        { value: '', label: 'All Customers' },
        { value: '1', label: 'Customer 1' },
        { value: '2', label: 'Customer 2' },
    ];

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'partially_paid', label: 'Partially Paid' },
    ];

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
                            View and analyze sales data
                        </p>
                    </div>
                    <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Report Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-4">
                            <FormDate
                                label="Start Date"
                                id="start_date"
                            />

                            <FormDate
                                label="End Date"
                                id="end_date"
                            />

                            <FormSelect
                                label="Customer"
                                options={customerOptions}
                                id="customer"
                            />

                            <FormSelect
                                label="Status"
                                options={statusOptions}
                                id="status"
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <Button variant="outline">
                                Reset Filters
                            </Button>
                            <Button>
                                Generate Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Report Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-muted-foreground">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Select filters and generate a report to view results</p>
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
