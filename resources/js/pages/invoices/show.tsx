import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ArrowLeft, Users, Edit, Trash2, FileText, Calendar, DollarSign } from 'lucide-react';
import { index, edit } from '@/routes/invoices';
import { useForm } from '@inertiajs/react';

interface InvoiceItem {
    id: number;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
    discount: number;
    tax: number;
    subtotal: number;
}

interface Invoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    customer_name: string;
    customer_phone: string | null;
    customer_email: string | null;
    status: string;
    notes: string | null;
    grand_total: number;
    paid_amount: number;
    outstanding_balance: number;
    items: InvoiceItem[];
}

interface Props {
    invoice: Invoice;
}

export default function InvoiceShow({ invoice }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            destroy(edit(invoice.id).url);
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
            render: (item: InvoiceItem) => (
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
            render: (item: InvoiceItem) => item.quantity,
        },
        {
            key: 'unit_price',
            label: 'Unit Price',
            sortable: true,
            render: (item: InvoiceItem) => formatCurrency(item.unit_price),
        },
        {
            key: 'discount',
            label: 'Discount',
            sortable: true,
            render: (item: InvoiceItem) => `${item.discount}%`,
        },
        {
            key: 'tax',
            label: 'Tax',
            sortable: true,
            render: (item: InvoiceItem) => `${item.tax}%`,
        },
        {
            key: 'subtotal',
            label: 'Subtotal',
            sortable: true,
            render: (item: InvoiceItem) => formatCurrency(item.subtotal),
        },
    ];

    return (
        <>
            <Head title={`Invoice - ${invoice.invoice_number}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Invoices
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{invoice.invoice_number}</h1>
                        <p className="text-muted-foreground">
                            {new Date(invoice.invoice_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(invoice.id).url}>
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
                                <span className="ml-2 font-medium">{invoice.customer_name}</span>
                            </div>
                            {invoice.customer_phone && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Phone:</span>
                                    <span className="ml-2">{invoice.customer_phone}</span>
                                </div>
                            )}
                            {invoice.customer_email && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Email:</span>
                                    <span className="ml-2">{invoice.customer_email}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Invoice Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        invoice.status === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : invoice.status === 'partially_paid'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : invoice.status === 'draft'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {invoice.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Due Date:</span>
                                <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
                            </div>
                            {invoice.notes && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Notes:</span>
                                    <p className="mt-1 text-sm">{invoice.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={invoice.items || []}
                            columns={itemColumns}
                            searchable={false}
                            emptyState={{
                                title: 'No items found',
                                description: 'This invoice has no items',
                            }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Amount:</span>
                            <span className="font-medium">{formatCurrency(invoice.grand_total)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Paid Amount:</span>
                            <span className="font-medium text-green-600">{formatCurrency(invoice.paid_amount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
                            <span className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Outstanding Balance:
                            </span>
                            <span className={invoice.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}>
                                {formatCurrency(invoice.outstanding_balance)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

InvoiceShow.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: 'Invoices',
            href: index().url,
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};
