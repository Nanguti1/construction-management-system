import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ArrowLeft, Phone, Mail, MapPin, FileText, Edit, Trash2 } from 'lucide-react';
import { index, edit } from '@/routes/customers';
import { useForm } from '@inertiajs/react';

interface Customer {
    id: number;
    name: string;
    type: string;
    company_name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    tax_pin: string | null;
    notes: string | null;
    is_active: boolean;
    invoices: Array<{
        id: number;
        invoice_number: string;
        invoice_date: string;
        grand_total: number;
        status: string;
    }>;
}

interface Props {
    customer: Customer;
}

export default function CustomerShow({ customer }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this customer?')) {
            destroy(edit(customer.id).url);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const invoiceColumns = [
        {
            key: 'invoice_number',
            label: 'Invoice #',
            sortable: true,
        },
        {
            key: 'invoice_date',
            label: 'Date',
            sortable: true,
        },
        {
            key: 'grand_total',
            label: 'Total',
            sortable: true,
            render: (invoice: any) => formatCurrency(invoice.grand_total),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (invoice: any) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {invoice.status}
                </span>
            ),
        },
    ];

    return (
        <>
            <Head title={`Customer - ${customer.name}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Customers
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{customer.name}</h1>
                        <p className="text-muted-foreground">
                            {customer.company_name && `Company: ${customer.company_name}`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(customer.id).url}>
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
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {customer.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{customer.phone}</span>
                                </div>
                            )}
                            {customer.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{customer.email}</span>
                                </div>
                            )}
                            {customer.address && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                    <span>{customer.address}</span>
                                </div>
                            )}
                            {customer.tax_pin && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Tax PIN:</span>
                                    <span className="ml-2">{customer.tax_pin}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Type:</span>
                                <span className="ml-2 capitalize">{customer.type}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        customer.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {customer.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            {customer.notes && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Notes:</span>
                                    <p className="mt-1 text-sm">{customer.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={customer.invoices}
                            columns={invoiceColumns}
                            searchable={false}
                            emptyState={{
                                title: 'No invoices found',
                                description: 'This customer has no invoices yet',
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CustomerShow.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: index().url,
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};