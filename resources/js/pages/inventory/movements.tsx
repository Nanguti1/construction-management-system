import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { ArrowLeft, Package } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { movements } from '@/routes/inventory';

interface StockMovement {
    id: number;
    product_name: string;
    product_sku: string;
    type: string;
    quantity: number;
    reference_type: string | null;
    reference_number: string | null;
    notes: string | null;
    created_at: string;
}

interface Props {
    movements: StockMovement[];
}

export default function StockMovementsIndex({ movements }: Props) {
    const columns = [
        {
            key: 'product_name',
            label: 'Product',
            sortable: true,
            render: (movement: StockMovement) => (
                <div>
                    <div className="font-medium">{movement.product_name}</div>
                    <div className="text-sm text-muted-foreground">{movement.product_sku}</div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (movement: StockMovement) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        movement.type === 'in'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                </span>
            ),
        },
        {
            key: 'quantity',
            label: 'Quantity',
            sortable: true,
            render: (movement: StockMovement) => (
                <span className={movement.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                </span>
            ),
        },
        {
            key: 'reference_type',
            label: 'Reference',
            sortable: true,
            render: (movement: StockMovement) => (
                <div>
                    {movement.reference_type && (
                        <div className="text-sm capitalize">{movement.reference_type}</div>
                    )}
                    {movement.reference_number && (
                        <div className="text-sm text-muted-foreground">{movement.reference_number}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'created_at',
            label: 'Date',
            sortable: true,
            render: (movement: StockMovement) => new Date(movement.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Head title="Stock Movements" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/inventory">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Inventory
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Stock Movements</h1>
                        <p className="text-muted-foreground">
                            Track inventory changes
                        </p>
                    </div>
                </div>

                <DataTable
                    data={movements}
                    columns={columns}
                    searchable
                    searchableFields={['product_name', 'product_sku', 'reference_number']}
                    emptyState={{
                        title: 'No stock movements found',
                        description: 'Stock movements will appear here when inventory changes',
                    }}
                />
            </div>
        </>
    );
}

StockMovementsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '/inventory',
        },
        {
            title: 'Stock Movements',
            href: movements().url,
        },
    ],
};
