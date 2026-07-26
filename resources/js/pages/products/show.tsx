import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react';
import { index, edit } from '@/routes/products';

interface Product {
    id: number;
    name: string;
    sku: string;
    description: string | null;
    cost_price: number;
    selling_price: number;
    minimum_stock: number;
    is_active: boolean;
    category_name: string | null;
    unit_name: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(`/products/${product.id}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title={`Product - ${product.name}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{product.name}</h1>
                        <p className="text-muted-foreground">{product.sku}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(product.id).url}>
                            <Button>
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
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">SKU</label>
                                <p className="text-lg font-semibold">{product.sku}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Category</label>
                                <p className="text-lg">{product.category_name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Unit</label>
                                <p className="text-lg">{product.unit_name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <p className="text-lg">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            product.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Stock</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Cost Price</label>
                                <p className="text-lg font-semibold">{formatCurrency(product.cost_price)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Selling Price</label>
                                <p className="text-lg font-semibold">{formatCurrency(product.selling_price)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Minimum Stock</label>
                                <p className="text-lg">{product.minimum_stock}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {product.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{product.description}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Timestamps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Created At</label>
                            <p className="text-lg">{formatDate(product.created_at)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                            <p className="text-lg">{formatDate(product.updated_at)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProductShow.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: index().url,
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};