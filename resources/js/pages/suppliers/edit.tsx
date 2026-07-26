import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { ArrowLeft } from 'lucide-react';
import { index, update, show } from '@/routes/suppliers';

interface Supplier {
    id: number;
    name: string;
    company_name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    tax_pin: string | null;
    notes: string | null;
    is_active: boolean;
}

interface Props {
    supplier: Supplier;
}

export default function SupplierEdit({ supplier }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name,
        company_name: supplier.company_name || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        tax_pin: supplier.tax_pin || '',
        notes: supplier.notes || '',
        is_active: supplier.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(supplier.id).url);
    };

    return (
        <>
            <Head title="Edit Supplier" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Suppliers
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Edit Supplier</h1>
                        <p className="text-muted-foreground">
                            Update supplier information
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Supplier Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormInput
                                label="Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                id="name"
                                required
                            />

                            <FormInput
                                label="Company Name"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                error={errors.company_name}
                                id="company_name"
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormInput
                                    label="Phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    error={errors.phone}
                                    id="phone"
                                />

                                <FormInput
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    id="email"
                                />
                            </div>

                            <FormTextarea
                                label="Address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                error={errors.address}
                                id="address"
                                rows={3}
                            />

                            <FormInput
                                label="Tax PIN"
                                value={data.tax_pin}
                                onChange={(e) => setData('tax_pin', e.target.value)}
                                error={errors.tax_pin}
                                id="tax_pin"
                            />

                            <FormTextarea
                                label="Notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                error={errors.notes}
                                id="notes"
                                rows={3}
                            />

                            <FormCheckbox
                                label="Active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                error={errors.is_active}
                                id="is_active"
                            />

                            <div className="flex justify-end gap-4">
                                <Link href={show(supplier.id).url}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Supplier'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SupplierEdit.layout = {
    breadcrumbs: [
        {
            title: 'Suppliers',
            href: index().url,
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
