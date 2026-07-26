import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, FileText, Calendar, CreditCard, Trash2 } from 'lucide-react';
import { index, destroy } from '@/routes/payments';
import { useForm } from '@inertiajs/react';

interface Payment {
    id: number;
    payment_date: string;
    invoice_number: string;
    customer_name: string;
    amount: number;
    payment_method: string;
    reference_number: string | null;
    notes: string | null;
}

interface Props {
    payment: Payment;
}

export default function PaymentShow({ payment }: Props) {
    const { delete: deleteForm } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this payment?')) {
            deleteForm(destroy(payment.id).url);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <>
            <Head title={`Payment - ${payment.invoice_number}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Payments
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Payment Details</h1>
                        <p className="text-muted-foreground">
                            {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                    </div>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Invoice Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Invoice #:</span>
                                <span className="ml-2 font-medium">{payment.invoice_number}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Customer:</span>
                                <span className="ml-2 font-medium">{payment.customer_name}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Payment Date:</span>
                                <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Method:</span>
                                <span className="capitalize">{payment.payment_method}</span>
                            </div>
                            {payment.reference_number && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Reference #:</span>
                                    <span className="ml-2">{payment.reference_number}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center text-2xl font-bold">
                            <span className="flex items-center gap-2">
                                <DollarSign className="h-6 w-6" />
                                Amount Paid:
                            </span>
                            <span className="text-green-600">{formatCurrency(payment.amount)}</span>
                        </div>
                        {payment.notes && (
                            <div className="border-t pt-4">
                                <span className="text-sm text-muted-foreground">Notes:</span>
                                <p className="mt-1 text-sm">{payment.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PaymentShow.layout = {
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
            title: 'Show',
            href: '#',
        },
    ],
};
