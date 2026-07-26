import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ArrowLeft, Package, Edit, Trash2 } from 'lucide-react';
import { index, edit, destroy } from '@/routes/units';
import { useForm } from '@inertiajs/react';

interface Unit {
    id: number;
    name: string;
    abbreviation: string;
    description: string | null;
    is_active: boolean;
    products: Array<{
        id: number;
        name: string;
        sku: string;
        stock_quantity: number;
        status: string;
    }>;
}

interface Props {
    unit: Unit;
}

export default function UnitShow({ unit }: Props) {
    const { delete: deleteForm } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this unit?')) {
            deleteForm(destroy(unit.name).url);
        }
    };

    const productColumns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (product: any) => (
                <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.sku}</div>
                </div>
            ),
        },
        {
            key: 'stock_quantity',
            label: 'Stock',
            sortable: true,
            render: (product: any) => product.stock_quantity,
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (product: any) => (
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

    return (
        <>
            <Head title={`Unit - ${unit.name}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Units
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{unit.name}</h1>
                        <p className="text-muted-foreground">
                            {unit.abbreviation}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(unit.name).url}>
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
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Abbreviation:</span>
                                <span className="ml-2 font-medium">{unit.abbreviation}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        unit.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {unit.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            {unit.description && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Description:</span>
                                    <p className="mt-1 text-sm">{unit.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Total Products:</span>
                                <span className="font-medium">{unit.products.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Products using this Unit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={unit.products}
                            columns={productColumns}
                            searchable={false}
                            emptyState={{
                                title: 'No products found',
                                description: 'This unit is not used by any products yet',
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UnitShow.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '/inventory',
        },
        {
            title: 'Units',
            href: '/units',
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};
