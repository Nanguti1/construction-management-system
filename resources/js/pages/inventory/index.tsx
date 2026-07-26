import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, Package } from 'lucide-react';
import { index as inventoryIndex, show as inventoryShow } from '@/routes/inventory';
import { index as productIndex, create as productCreate, show as productShow } from '@/routes/products';

interface Product {
    id: number;
    name: string;
    sku: string;
    category_name: string | null;
    unit_name: string | null;
    stock_quantity: number;
    selling_price: number;
    status: string;
}

interface Props {
    products: Product[];
}

export default function ProductIndex({ products }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (product: Product) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(`/products/${product.id}`);
        }
    };

    const handleEdit = (product: Product) => {
        window.location.href = `/products/${product.id}/edit`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (product: Product) => (
                <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.sku}</div>
                </div>
            ),
        },
        {
            key: 'category_name',
            label: 'Category',
            sortable: true,
            render: (product: Product) => product.category_name || '-',
        },
        {
            key: 'unit_name',
            label: 'Unit',
            sortable: true,
            render: (product: Product) => product.unit_name || '-',
        },
        {
            key: 'stock_quantity',
            label: 'Stock',
            sortable: true,
            render: (product: Product) => product.stock_quantity,
        },
        {
            key: 'selling_price',
            label: 'Price',
            sortable: true,
            render: (product: Product) => formatCurrency(product.selling_price),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (product: Product) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'low_stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {product.status}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (product: Product) => {
                window.location.href = inventoryShow(product.id).url;
            },
        },
        {
            label: 'Edit',
            onClick: handleEdit,
        },
        {
            label: 'Delete',
            onClick: handleDelete,
            destructive: true,
        },
    ];

    return (
        <>
            <Head title="Products" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground">
                            Manage your product inventory
                        </p>
                    </div>
                    <Link href={productCreate().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={products}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['name', 'sku', 'category_name']}
                    emptyState={{
                        title: 'No products found',
                        description: 'Get started by adding your first product',
                        action: {
                            label: 'Add Product',
                            onClick: () => {
                                window.location.href = productCreate().url;
                            },
                        },
                    }}
                    onRowClick={(product) => {
                        window.location.href = inventoryShow(product.id).url;
                    }}
                />
            </div>
        </>
    );
}

ProductIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: inventoryIndex().url,
        },
        {
            title: 'Products',
            href: inventoryIndex().url,
        },
    ],
};
