import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { ArrowLeft } from 'lucide-react';
import { index, update } from '@/routes/products';

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
}

interface Product {
    id: number;
    category_id: number;
    unit_id: number;
    sku: string;
    name: string;
    description: string | null;
    cost_price: number;
    selling_price: number;
    minimum_stock: number;
    is_active: boolean;
}

interface Props {
    product: Product;
    categories: Category[];
    units: Unit[];
}

export default function ProductEdit({ product, categories, units }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        category_id: product.category_id?.toString() || '',
        unit_id: product.unit_id?.toString() || '',
        sku: product.sku,
        name: product.name,
        description: product.description || '',
        cost_price: product.cost_price?.toString() || '',
        selling_price: product.selling_price?.toString() || '',
        minimum_stock: product.minimum_stock?.toString() || '',
        is_active: product.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(product.id).url);
    };

    const categoryOptions = categories.map(c => ({ value: c.id.toString(), label: c.name }));
    const unitOptions = units.map(u => ({ value: u.id.toString(), label: u.name }));

    return (
        <>
            <Head title="Edit Product" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Edit Product</h1>
                        <p className="text-muted-foreground">
                            Update product information
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormSelect
                                    label="Category"
                                    options={categoryOptions}
                                    value={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                    error={errors.category_id}
                                    id="category_id"
                                    required
                                />

                                <FormSelect
                                    label="Unit"
                                    options={unitOptions}
                                    value={data.unit_id}
                                    onValueChange={(value) => setData('unit_id', value)}
                                    error={errors.unit_id}
                                    id="unit_id"
                                    required
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormInput
                                    label="SKU"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    error={errors.sku}
                                    id="sku"
                                    required
                                />

                                <FormInput
                                    label="Product Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    id="name"
                                    required
                                />
                            </div>

                            <FormTextarea
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={errors.description}
                                id="description"
                                rows={3}
                            />

                            <div className="grid gap-6 md:grid-cols-3">
                                <FormInput
                                    label="Cost Price"
                                    type="number"
                                    step="0.01"
                                    value={data.cost_price}
                                    onChange={(e) => setData('cost_price', e.target.value)}
                                    error={errors.cost_price}
                                    id="cost_price"
                                    required
                                />

                                <FormInput
                                    label="Selling Price"
                                    type="number"
                                    step="0.01"
                                    value={data.selling_price}
                                    onChange={(e) => setData('selling_price', e.target.value)}
                                    error={errors.selling_price}
                                    id="selling_price"
                                    required
                                />

                                <FormInput
                                    label="Minimum Stock"
                                    type="number"
                                    value={data.minimum_stock}
                                    onChange={(e) => setData('minimum_stock', e.target.value)}
                                    error={errors.minimum_stock}
                                    id="minimum_stock"
                                />
                            </div>

                            <FormCheckbox
                                label="Active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                error={errors.is_active}
                                id="is_active"
                            />

                            <div className="flex justify-end gap-4">
                                <Link href={index().url}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Product'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProductEdit.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: index().url,
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};