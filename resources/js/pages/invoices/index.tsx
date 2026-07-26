import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, FileText } from 'lucide-react';
import { index, create, show, edit } from '@/routes/invoices';

interface Invoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    customer_name: string;
    grand_total: number;
    paid_amount: number;
    outstanding_balance: number;
    status: string;
}

interface Props {
    invoices: Invoice[];
}

export default function InvoiceIndex({ invoices }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (invoice: Invoice) => {
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

    const columns = [
        {
            key: 'invoice_number',
            label: 'Invoice #',
            sortable: true,
        },
        {
            key: 'invoice_date',
            label: 'Date',
            sortable: true,
            render: (invoice: Invoice) => new Date(invoice.invoice_date).toLocaleDateString(),
        },
        {
            key: 'customer_name',
            label: 'Customer',
            sortable: true,
        },
        {
            key: 'grand_total',
            label: 'Total',
            sortable: true,
            render: (invoice: Invoice) => formatCurrency(invoice.grand_total),
        },
        {
            key: 'outstanding_balance',
            label: 'Balance',
            sortable: true,
            render: (invoice: Invoice) => (
                <span className={invoice.outstanding_balance > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                    {formatCurrency(invoice.outstanding_balance)}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (invoice: Invoice) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            ),
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (invoice: Invoice) => {
                window.location.href = show(invoice.id).url;
            },
        },
        {
            label: 'Edit',
            onClick: (invoice: Invoice) => {
                window.location.href = edit(invoice.id).url;
            },
        },
        {
            label: 'Delete',
            onClick: handleDelete,
            destructive: true,
        },
    ];

    return (
        <>
            <Head title="Invoices" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                        <p className="text-muted-foreground">
                            Manage customer invoices
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Invoice
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={invoices}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['invoice_number', 'customer_name']}
                    emptyState={{
                        title: 'No invoices found',
                        description: 'Get started by adding your first invoice',
                        action: {
                            label: 'Add Invoice',
                            onClick: () => {
                                window.location.href = create().url;
                            },
                        },
                    }}
                    onRowClick={(invoice) => {
                        window.location.href = show(invoice.id).url;
                    }}
                />
            </div>
        </>
    );
}

InvoiceIndex.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: 'Invoices',
            href: index().url,
        },
    ],
};
