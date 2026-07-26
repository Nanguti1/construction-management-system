import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ArrowLeft, Users, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import { index, edit } from '@/routes/quotations';
import { useForm } from '@inertiajs/react';

interface QuotationItem {
    id: number;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
}

interface Quotation {
    id: number;
    quotation_number: string;
    quotation_date: string;
    expiry_date: string;
    customer_name: string;
    customer_phone: string | null;
    customer_email: string | null;
    status: string;
    notes: string | null;
    grand_total: number;
    items: QuotationItem[];
}

interface Props {
    quotation: Quotation;
}

export default function QuotationShow({ quotation }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this quotation?')) {
            destroy(edit(quotation.id).url);
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
            render: (item: QuotationItem) => (
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
            render: (item: QuotationItem) => item.quantity,
        },
        {
            key: 'unit_price',
            label: 'Unit Price',
            sortable: true,
            render: (item: QuotationItem) => formatCurrency(item.unit_price),
        },
        {
            key: 'discount',
            label: 'Discount',
            sortable: true,
            render: (item: QuotationItem) => `${item.discount}%`,
        },
        {
            key: 'tax',
            label: 'Tax',
            sortable: true,
            render: (item: QuotationItem) => `${item.tax}%`,
        },
        {
            key: 'subtotal',
            label: 'Subtotal',
            sortable: true,
            render: (item: QuotationItem) => formatCurrency(item.subtotal),
        },
    ];

    return (
        <>
            <Head title={`Quotation - ${quotation.quotation_number}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Quotations
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{quotation.quotation_number}</h1>
                        <p className="text-muted-foreground">
                            {new Date(quotation.quotation_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(quotation.id).url}>
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
                                <Users className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Name:</span>
                                <span className="ml-2 font-medium">{quotation.customer_name}</span>
                            </div>
                            {quotation.customer_phone && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Phone:</span>
                                    <span className="ml-2">{quotation.customer_phone}</span>
                                </div>
                            )}
                            {quotation.customer_email && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Email:</span>
                                    <span className="ml-2">{quotation.customer_email}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Quotation Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        quotation.status === 'accepted'
                                            ? 'bg-green-100 text-green-800'
                                            : quotation.status === 'sent'
                                            ? 'bg-blue-100 text-blue-800'
                                            : quotation.status === 'draft'
                                            ? 'bg-gray-100 text-gray-800'
                                            : quotation.status === 'rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {quotation.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Valid until:</span>
                                <span>{new Date(quotation.expiry_date).toLocaleDateString()}</span>
                            </div>
                            {quotation.notes && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Notes:</span>
                                    <p className="mt-1 text-sm">{quotation.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quotation Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={quotation.items}
                            columns={itemColumns}
                            searchable={false}
                            emptyState={{
                                title: 'No items found',
                                description: 'This quotation has no items',
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
                            <span>{formatCurrency(quotation.grand_total)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

QuotationShow.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: 'Quotations',
            href: index().url,
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};
