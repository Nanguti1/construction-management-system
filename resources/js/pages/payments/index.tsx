import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, DollarSign } from 'lucide-react';
import { index, create, show, edit, destroy } from '@/routes/payments';

interface Payment {
    id: number;
    payment_date: string;
    invoice_number: string;
    customer_name: string;
    amount: number;
    payment_method: string;
    reference_number: string | null;
}

interface Props {
    payments: Payment[];
}

export default function PaymentIndex({ payments }: Props) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (payment: Payment) => {
        if (confirm('Are you sure you want to delete this payment?')) {
            deleteForm(destroy(payment.id).url);
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
            key: 'payment_date',
            label: 'Date',
            sortable: true,
            render: (payment: Payment) => new Date(payment.payment_date).toLocaleDateString(),
        },
        {
            key: 'invoice_number',
            label: 'Invoice #',
            sortable: true,
        },
        {
            key: 'customer_name',
            label: 'Customer',
            sortable: true,
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (payment: Payment) => (
                <span className="font-medium text-green-600">{formatCurrency(payment.amount)}</span>
            ),
        },
        {
            key: 'payment_method',
            label: 'Method',
            sortable: true,
            render: (payment: Payment) => (
                <span className="capitalize">{payment.payment_method}</span>
            ),
        },
        {
            key: 'reference_number',
            label: 'Reference',
            sortable: true,
            render: (payment: Payment) => payment.reference_number || '-',
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (payment: Payment) => {
                window.location.href = show(payment.id).url;
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
            <Head title="Payments" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                        <p className="text-muted-foreground">
                            Manage invoice payments
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Payment
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={payments}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['invoice_number', 'customer_name', 'reference_number']}
                    emptyState={{
                        title: 'No payments found',
                        description: 'Get started by adding your first payment',
                        action: {
                            label: 'Add Payment',
                            onClick: () => {
                                window.location.href = create().url;
                            },
                        },
                    }}
                    onRowClick={(payment) => {
                        window.location.href = show(payment.id).url;
                    }}
                />
            </div>
        </>
    );
}

PaymentIndex.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: 'Payments',
            href: index().url,
        },
    ],
};
