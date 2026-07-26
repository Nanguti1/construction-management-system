import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { ArrowLeft } from 'lucide-react';
import { index, store } from '@/routes/customers';

export default function CustomerCreate() {
    const { data, setData, post, processing, errors } = useForm({
        type: 'individual',
        name: '',
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

    const customerTypes = [
        { value: 'individual', label: 'Individual' },
        { value: 'company', label: 'Company' },
    ];

    return (
        <>
            <Head title="Create Customer" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Customers
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Create Customer</h1>
                        <p className="text-muted-foreground">
                            Add a new customer to your database
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormSelect
                                    label="Customer Type"
                                    options={customerTypes}
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                    error={errors.type}
                                    id="type"
                                />

                                <FormInput
                                    label="Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    id="name"
                                    required
                                />
                            </div>

                            {data.type === 'company' && (
                                <FormInput
                                    label="Company Name"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    error={errors.company_name}
                                    id="company_name"
                                    required
                                />
                            )}

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
                                    {processing ? 'Creating...' : 'Create Customer'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CustomerCreate.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: index().url,
        },
        {
            title: 'Create',
            href: '#',
        },
    ],
};