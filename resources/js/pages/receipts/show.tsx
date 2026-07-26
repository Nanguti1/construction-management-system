import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Printer, Receipt, DollarSign, Calendar, CreditCard, FileText, User } from 'lucide-react';
import { show } from '@/routes/receipts';
import { index as paymentIndex } from '@/routes/payments';

interface ReceiptItem {
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Receipt {
    id: number;
    receipt_number: string;
    payment_date: string;
    customer_name: string;
    customer_address: string | null;
    customer_phone: string | null;
    invoice_number: string;
    amount: number;
    payment_method: string;
    reference_number: string | null;
    notes: string | null;
    items: ReceiptItem[];
}

interface Props {
    receipt: Receipt;
}

export default function ReceiptShow({ receipt }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Receipt - ${receipt.receipt_number}`} />
            <div className="space-y-6 print:space-y-0">
                <div className="flex items-center justify-between no-print">
                    <div>
                        <Link href={paymentIndex().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Payments
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Receipt</h1>
                        <p className="text-muted-foreground">
                            {receipt.receipt_number}
                        </p>
                    </div>
                    <Button onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Receipt
                    </Button>
                </div>

                <Card className="print:border-none print:shadow-none">
                    <CardHeader className="print:px-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Payment Receipt
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                {receipt.receipt_number}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 print:px-0">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Customer:</div>
                                        <div className="font-medium">{receipt.customer_name}</div>
                                    </div>
                                </div>
                                {receipt.customer_address && (
                                    <div className="ml-6">
                                        <div className="text-sm text-muted-foreground">Address:</div>
                                        <div className="text-sm">{receipt.customer_address}</div>
                                    </div>
                                )}
                                {receipt.customer_phone && (
                                    <div className="ml-6">
                                        <div className="text-sm text-muted-foreground">Phone:</div>
                                        <div className="text-sm">{receipt.customer_phone}</div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Invoice #:</div>
                                        <div className="font-medium">{receipt.invoice_number}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Payment Date:</div>
                                        <div className="font-medium">{new Date(receipt.payment_date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Payment Method:</div>
                                        <div className="font-medium capitalize">{receipt.payment_method}</div>
                                    </div>
                                </div>
                                {receipt.reference_number && (
                                    <div className="ml-6">
                                        <div className="text-sm text-muted-foreground">Reference #:</div>
                                        <div className="text-sm">{receipt.reference_number}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {receipt.items && receipt.items.length > 0 && (
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-4">Payment Details</h3>
                                <div className="space-y-2">
                                    {receipt.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>{item.product_name} x {item.quantity}</span>
                                            <span>{formatCurrency(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-2xl font-bold">
                                <span className="flex items-center gap-2">
                                    <DollarSign className="h-6 w-6" />
                                    Total Amount Paid:
                                </span>
                                <span className="text-green-600">{formatCurrency(receipt.amount)}</span>
                            </div>
                        </div>

                        {receipt.notes && (
                            <div className="border-t pt-4">
                                <div className="text-sm text-muted-foreground">Notes:</div>
                                <p className="mt-1 text-sm">{receipt.notes}</p>
                            </div>
                        )}

                        <div className="border-t pt-4 text-center text-sm text-muted-foreground print:mt-8">
                            <p>Thank you for your payment!</p>
                            <p className="mt-2">Generated on {new Date().toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ReceiptShow.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: 'Receipts',
            href: '#',
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};
