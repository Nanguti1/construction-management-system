import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { ArrowLeft } from 'lucide-react';
import { index, store } from '@/routes/suppliers';

export default function SupplierCreate() {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        phone: '',
        email: '',
        address: '',
        tax_pin: '',
        notes: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    return (
        <>
            <Head title="Create Supplier" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Suppliers
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Create Supplier</h1>
                        <p className="text-muted-foreground">
                            Add a new supplier to your database
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
                                label="Company Name"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                error={errors.company_name}
                                id="company_name"
                                required
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
                                <Link href={index().url}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Supplier'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SupplierCreate.layout = {
    breadcrumbs: [
        {
            title: 'Suppliers',
            href: index().url,
        },
        {
            title: 'Create',
            href: '#',
        },
    ],
};
