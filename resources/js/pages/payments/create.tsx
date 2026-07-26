import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import { FormDate } from '@/components/form/form-date';
import { FormCurrency } from '@/components/form/form-currency';
import { FormTextarea } from '@/components/form/form-textarea';
import { ArrowLeft } from 'lucide-react';
import { index, store } from '@/routes/payments';

interface Invoice {
    id: number;
    invoice_number: string;
    customer_name: string;
    outstanding_balance: number;
}

interface Props {
    invoices: Invoice[];
}

export default function PaymentCreate({ invoices }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        amount: 0,
        payment_method: 'cash',
        reference_number: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    const invoiceOptions = (invoices || [])
        .filter(inv => inv.outstanding_balance > 0)
        .map(inv => ({
            value: inv.id.toString(),
            label: `${inv.invoice_number} - ${inv.customer_name} (Balance: $${inv.outstanding_balance.toFixed(2)})`
        }));

    const paymentMethodOptions = [
        { value: 'cash', label: 'Cash' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'check', label: 'Check' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'mobile_money', label: 'Mobile Money' },
    ];

    return (
        <>
            <Head title="Create Payment" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Payments
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Create Payment</h1>
                        <p className="text-muted-foreground">
                            Record a new payment
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormSelect
                                label="Invoice"
                                options={invoiceOptions}
                                value={data.invoice_id}
                                onValueChange={(value) => setData('invoice_id', value)}
                                error={errors.invoice_id}
                                id="invoice_id"
                                required
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormDate
                                    label="Payment Date"
                                    value={data.payment_date}
                                    onChange={(e) => setData('payment_date', e.target.value)}
                                    error={errors.payment_date}
                                    id="payment_date"
                                    required
                                />

                                <FormCurrency
                                    label="Amount"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', parseFloat(e.target.value))}
                                    error={errors.amount}
                                    id="amount"
                                    required
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormSelect
                                    label="Payment Method"
                                    options={paymentMethodOptions}
                                    value={data.payment_method}
                                    onValueChange={(value) => setData('payment_method', value)}
                                    error={errors.payment_method}
                                    id="payment_method"
                                    required
                                />

                                <FormInput
                                    label="Reference Number"
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                    error={errors.reference_number}
                                    id="reference_number"
                                />
                            </div>

                            <FormTextarea
                                label="Notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                error={errors.notes}
                                id="notes"
                                rows={3}
                            />

                            <div className="flex justify-end gap-4">
                                <Link href={index().url}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Payment'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PaymentCreate.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: 'Payments',
            href: index().url,
        },
        {
            title: 'Create',
            href: '#',
        },
    ],
};
