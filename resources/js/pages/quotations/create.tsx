import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import { FormDate } from '@/components/form/form-date';
import { FormCurrency } from '@/components/form/form-currency';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { index, store } from '@/routes/quotations';
import { useState } from 'react';

interface Customer {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    selling_price: number;
}

interface Props {
    customers: Customer[];
    products: Product[];
}

export default function QuotationCreate({ customers, products }: Props) {
    const [items, setItems] = useState([
        { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax: 0 }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        quotation_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        notes: '',
        items: items,
    });

    const addItem = () => {
        const newItems = [...items, { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax: 0 }];
        setItems(newItems);
        setData('items', newItems);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
        setData('items', newItems);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const subtotal = item.quantity * item.unit_price;
            const discount = subtotal * (item.discount / 100);
            const tax = (subtotal - discount) * (item.tax / 100);
            return total + subtotal - discount + tax;
        }, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    const customerOptions = customers.map(c => ({ value: c.id.toString(), label: c.name }));
    const productOptions = products.map(p => ({ value: p.id.toString(), label: `${p.name} (${p.sku})` }));

    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'expired', label: 'Expired' },
    ];

    return (
        <>
            <Head title="Create Quotation" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Quotations
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Create Quotation</h1>
                        <p className="text-muted-foreground">
                            Add a new customer quotation
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quotation Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormSelect
                                    label="Customer"
                                    options={customerOptions}
                                    value={data.customer_id}
                                    onValueChange={(value) => setData('customer_id', value)}
                                    error={errors.customer_id}
                                    id="customer_id"
                                    required
                                />

                                <FormSelect
                                    label="Status"
                                    options={statusOptions}
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                    error={errors.status}
                                    id="status"
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormDate
                                    label="Quotation Date"
                                    value={data.quotation_date}
                                    onChange={(e) => setData('quotation_date', e.target.value)}
                                    error={errors.quotation_date}
                                    id="quotation_date"
                                    required
                                />

                                <FormDate
                                    label="Expiry Date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                    error={errors.expiry_date}
                                    id="expiry_date"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Quotation Items</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Item
                                    </Button>
                                </div>

                                {items.map((item, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormSelect
                                                label="Product"
                                                options={productOptions}
                                                value={item.product_id}
                                                onValueChange={(value) => updateItem(index, 'product_id', value)}
                                                error={errors.items?.[index]?.product_id}
                                                id={`product_${index}`}
                                                required
                                            />

                                            <FormInput
                                                label="Quantity"
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                                error={errors.items?.[index]?.quantity}
                                                id={`quantity_${index}`}
                                                required
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <FormCurrency
                                                label="Unit Price"
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                                                error={errors.items?.[index]?.unit_price}
                                                id={`unit_price_${index}`}
                                                required
                                            />

                                            <FormInput
                                                label="Discount (%)"
                                                type="number"
                                                value={item.discount}
                                                onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value))}
                                                error={errors.items?.[index]?.discount}
                                                id={`discount_${index}`}
                                            />

                                            <FormInput
                                                label="Tax (%)"
                                                type="number"
                                                value={item.tax}
                                                onChange={(e) => updateItem(index, 'tax', parseFloat(e.target.value))}
                                                error={errors.items?.[index]?.tax}
                                                id={`tax_${index}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-2xl font-bold">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <FormInput
                                label="Notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                error={errors.notes}
                                id="notes"
                            />

                            <div className="flex justify-end gap-4">
                                <Link href={index().url}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Quotation'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

QuotationCreate.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: 'Quotations',
            href: index().url,
        },
        {
            title: 'Create',
            href: '#',
        },
    ],
};
