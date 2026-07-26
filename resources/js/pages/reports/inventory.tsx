import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, Download, Package, Box, AlertTriangle } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface InventoryReportProps {
    report: {
        total_products: number;
        stock_levels: Array<{
            product: any;
            current_stock: number;
        }>;
    };
}

export default function InventoryReport({ report }: InventoryReportProps) {
    const lowStockProducts = report.stock_levels.filter(
        (item) => item.current_stock < 10
    );
    const outOfStockProducts = report.stock_levels.filter(
        (item) => item.current_stock <= 0
    );

    return (
        <>
            <Head title="Inventory Report" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Inventory Report</h1>
                        <p className="text-muted-foreground">
                            View and analyze inventory data
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
                                Total Products
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {report.total_products}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                In Stock
                            </CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {report.stock_levels.filter((item) => item.current_stock > 0).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Low Stock
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {lowStockProducts.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Out of Stock
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {outOfStockProducts.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Stock Levels
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Product</th>
                                        <th className="text-left p-2">SKU</th>
                                        <th className="text-left p-2">Category</th>
                                        <th className="text-right p-2">Current Stock</th>
                                        <th className="text-right p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.stock_levels.map((item) => (
                                        <tr key={item.product.id} className="border-b">
                                            <td className="p-2">{item.product.name}</td>
                                            <td className="p-2">{item.product.sku}</td>
                                            <td className="p-2">{item.product.category?.name || 'N/A'}</td>
                                            <td className="p-2 text-right">{item.current_stock}</td>
                                            <td className="p-2 text-right">
                                                {item.current_stock <= 0 ? (
                                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                                ) : item.current_stock < 10 ? (
                                                    <span className="text-yellow-600 font-medium">Low Stock</span>
                                                ) : (
                                                    <span className="text-green-600 font-medium">In Stock</span>
                                                )}
                                            </td>
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

InventoryReport.layout = {
    breadcrumbs: [
        {
            title: 'Reports',
            href: '/reports',
        },
        {
            title: 'Inventory Report',
            href: '/reports/inventory',
        },
    ],
};
