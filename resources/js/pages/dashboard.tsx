import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Package, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { dashboard } from '@/routes';
import { Link } from '@inertiajs/react';

interface DashboardProps {
    sales_report: {
        total_sales: number;
        total_payments: number;
        outstanding_balance: number;
        invoice_count: number;
    };
    purchase_report: {
        total_purchases: number;
        purchase_count: number;
    };
    inventory_report: {
        total_products: number;
        stock_levels: Array<{
            product: any;
            current_stock: number;
        }>;
    };
    customer_report: {
        total_customers: number;
        top_customers: any[];
    };
    profit_loss_report: {
        total_sales: number;
        total_purchases: number;
        gross_profit: number;
    };
    quotation_conversion: {
        total_quotations: number;
        converted_quotations: number;
        conversion_rate: number;
    };
}

export default function Dashboard({
    sales_report,
    purchase_report,
    inventory_report,
    customer_report,
    profit_loss_report,
    quotation_conversion,
}: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const lowStockProducts = inventory_report.stock_levels.filter(
        (item) => item.current_stock < 10
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your construction business
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(sales_report.total_sales)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {sales_report.invoice_count} invoices this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Outstanding Balance
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(sales_report.outstanding_balance)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                From {sales_report.invoice_count} invoices
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Customers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {customer_report.total_customers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active customers
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Products
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {inventory_report.total_products}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {lowStockProducts.length} low stock
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Purchases
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(purchase_report.total_purchases)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {purchase_report.purchase_count} purchases
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Gross Profit
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(profit_loss_report.gross_profit)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Quotation Conversion
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {quotation_conversion.conversion_rate.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {quotation_conversion.converted_quotations} of {quotation_conversion.total_quotations}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive">Low Stock Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {lowStockProducts.slice(0, 5).map((item) => (
                                    <div
                                        key={item.product.id}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm">{item.product.name}</span>
                                        <span className="text-sm font-medium text-destructive">
                                            {item.current_stock} units
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {lowStockProducts.length > 5 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    And {lowStockProducts.length - 5} more...
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Link href="/customers/create">
                                <button className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors">
                                    <Users className="h-5 w-5 mb-2" />
                                    <div className="font-medium">Add Customer</div>
                                    <div className="text-sm text-muted-foreground">
                                        Create new customer
                                    </div>
                                </button>
                            </Link>
                            <Link href="/quotations/create">
                                <button className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors">
                                    <ShoppingCart className="h-5 w-5 mb-2" />
                                    <div className="font-medium">New Quotation</div>
                                    <div className="text-sm text-muted-foreground">
                                        Create quotation
                                    </div>
                                </button>
                            </Link>
                            <Link href="/invoices/create">
                                <button className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors">
                                    <DollarSign className="h-5 w-5 mb-2" />
                                    <div className="font-medium">New Invoice</div>
                                    <div className="text-sm text-muted-foreground">
                                        Create invoice
                                    </div>
                                </button>
                            </Link>
                            <Link href="/purchases/create">
                                <button className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors">
                                    <Package className="h-5 w-5 mb-2" />
                                    <div className="font-medium">New Purchase</div>
                                    <div className="text-sm text-muted-foreground">
                                        Record purchase
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
