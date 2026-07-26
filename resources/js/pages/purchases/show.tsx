import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ArrowLeft, Truck, Edit, Trash2, FileText } from 'lucide-react';
import { index, edit } from '@/routes/purchases';
import { useForm } from '@inertiajs/react';

interface PurchaseItem {
    id: number;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_cost: number;
    discount: number;
    tax: number;
    subtotal: number;
}

interface Purchase {
    id: number;
    purchase_number: string;
    purchase_date: string;
    supplier_name: string;
    supplier_phone: string | null;
    supplier_email: string | null;
    status: string;
    notes: string | null;
    grand_total: number;
    items: PurchaseItem[];
}

interface Props {
    purchase: Purchase;
}

export default function PurchaseShow({ purchase }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this purchase?')) {
            destroy(edit(purchase.id).url);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const itemColumns = [
        {
            key: 'product_name',
            label: 'Product',
            sortable: true,
            render: (item: PurchaseItem) => (
                <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-sm text-muted-foreground">{item.product_sku}</div>
                </div>
            ),
        },
        {
            key: 'quantity',
            label: 'Quantity',
            sortable: true,
            render: (item: PurchaseItem) => item.quantity,
        },
        {
            key: 'unit_cost',
            label: 'Unit Cost',
            sortable: true,
            render: (item: PurchaseItem) => formatCurrency(item.unit_cost),
        },
        {
            key: 'discount',
            label: 'Discount',
            sortable: true,
            render: (item: PurchaseItem) => `${item.discount}%`,
        },
        {
            key: 'tax',
            label: 'Tax',
            sortable: true,
            render: (item: PurchaseItem) => `${item.tax}%`,
        },
        {
            key: 'subtotal',
            label: 'Subtotal',
            sortable: true,
            render: (item: PurchaseItem) => formatCurrency(item.subtotal),
        },
    ];

    return (
        <>
            <Head title={`Purchase - ${purchase.purchase_number}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Purchases
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{purchase.purchase_number}</h1>
                        <p className="text-muted-foreground">
                            {new Date(purchase.purchase_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(purchase.id).url}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Supplier Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Name:</span>
                                <span className="ml-2 font-medium">{purchase.supplier_name}</span>
                            </div>
                            {purchase.supplier_phone && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Phone:</span>
                                    <span className="ml-2">{purchase.supplier_phone}</span>
                                </div>
                            )}
                            {purchase.supplier_email && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Email:</span>
                                    <span className="ml-2">{purchase.supplier_email}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Purchase Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        purchase.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : purchase.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {purchase.status}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Date:</span>
                                <span className="ml-2">{new Date(purchase.purchase_date).toLocaleDateString()}</span>
                            </div>
                            {purchase.notes && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Notes:</span>
                                    <p className="mt-1 text-sm">{purchase.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Purchase Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={purchase.items}
                            columns={itemColumns}
                            searchable={false}
                            emptyState={{
                                title: 'No items found',
                                description: 'This purchase has no items',
                            }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center text-2xl font-bold">
                            <span>Total:</span>
                            <span>{formatCurrency(purchase.grand_total)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PurchaseShow.layout = {
    breadcrumbs: [
        {
            title: 'Purchases',
            href: index().url,
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};
