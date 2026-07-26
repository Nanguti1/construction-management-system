import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, FileText } from 'lucide-react';
import { index, create, show, edit } from '@/routes/quotations';

interface Quotation {
    id: number;
    quotation_number: string;
    quotation_date: string;
    expiry_date: string;
    customer_name: string;
    grand_total: number;
    status: string;
}

interface Props {
    quotations: Quotation[];
}

export default function QuotationIndex({ quotations }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (quotation: Quotation) => {
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

    const columns = [
        {
            key: 'quotation_number',
            label: 'Quotation #',
            sortable: true,
        },
        {
            key: 'quotation_date',
            label: 'Date',
            sortable: true,
            render: (quotation: Quotation) => new Date(quotation.quotation_date).toLocaleDateString(),
        },
        {
            key: 'expiry_date',
            label: 'Expiry',
            sortable: true,
            render: (quotation: Quotation) => new Date(quotation.expiry_date).toLocaleDateString(),
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
            render: (quotation: Quotation) => formatCurrency(quotation.grand_total),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (quotation: Quotation) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            ),
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (quotation: Quotation) => {
                window.location.href = show(quotation.id).url;
            },
        },
        {
            label: 'Edit',
            onClick: (quotation: Quotation) => {
                window.location.href = edit(quotation.id).url;
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
            <Head title="Quotations" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
                        <p className="text-muted-foreground">
                            Manage customer quotations
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Quotation
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={quotations}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['quotation_number', 'customer_name']}
                    emptyState={{
                        title: 'No quotations found',
                        description: 'Get started by adding your first quotation',
                        action: {
                            label: 'Add Quotation',
                            onClick: () => {
                                window.location.href = create().url;
                            },
                        },
                    }}
                    onRowClick={(quotation) => {
                        window.location.href = show(quotation.id).url;
                    }}
                />
            </div>
        </>
    );
}

QuotationIndex.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: 'Quotations',
            href: index().url,
        },
    ],
};
