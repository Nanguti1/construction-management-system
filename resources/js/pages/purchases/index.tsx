import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, ShoppingCart } from 'lucide-react';
import { index, create, show, edit } from '@/routes/purchases';

interface Purchase {
    id: number;
    purchase_number: string;
    purchase_date: string;
    supplier_name: string;
    grand_total: number;
    status: string;
}

interface Props {
    purchases: Purchase[];
}

export default function PurchaseIndex({ purchases }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (purchase: Purchase) => {
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

    const columns = [
        {
            key: 'purchase_number',
            label: 'Purchase #',
            sortable: true,
        },
        {
            key: 'purchase_date',
            label: 'Date',
            sortable: true,
            render: (purchase: Purchase) => new Date(purchase.purchase_date).toLocaleDateString(),
        },
        {
            key: 'supplier_name',
            label: 'Supplier',
            sortable: true,
        },
        {
            key: 'grand_total',
            label: 'Total',
            sortable: true,
            render: (purchase: Purchase) => formatCurrency(purchase.grand_total),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (purchase: Purchase) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : purchase.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {purchase.status}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (purchase: Purchase) => {
                window.location.href = show(purchase.id).url;
            },
        },
        {
            label: 'Edit',
            onClick: (purchase: Purchase) => {
                window.location.href = edit(purchase.id).url;
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
            <Head title="Purchases" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
                        <p className="text-muted-foreground">
                            Manage purchase orders
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Purchase
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={purchases}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['purchase_number', 'supplier_name']}
                    emptyState={{
                        title: 'No purchases found',
                        description: 'Get started by adding your first purchase',
                        action: {
                            label: 'Add Purchase',
                            onClick: () => {
                                window.location.href = create().url;
                            },
                        },
                    }}
                    onRowClick={(purchase) => {
                        window.location.href = show(purchase.id).url;
                    }}
                />
            </div>
        </>
    );
}

PurchaseIndex.layout = {
    breadcrumbs: [
        {
            title: 'Purchases',
            href: index().url,
        },
    ],
};
