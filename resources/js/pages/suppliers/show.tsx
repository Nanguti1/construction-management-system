import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ArrowLeft, Phone, Mail, MapPin, FileText, Edit, Trash2 } from 'lucide-react';
import { index, edit } from '@/routes/suppliers';
import { useForm } from '@inertiajs/react';

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
    purchases: Array<{
        id: number;
        purchase_number: string;
        purchase_date: string;
        grand_total: number;
        status: string;
    }>;
}

interface Props {
    supplier: Supplier;
}

export default function SupplierShow({ supplier }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            destroy(edit(supplier.id).url);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const purchaseColumns = [
        {
            key: 'purchase_number',
            label: 'Purchase #',
            sortable: true,
        },
        {
            key: 'purchase_date',
            label: 'Date',
            sortable: true,
        },
        {
            key: 'grand_total',
            label: 'Total',
            sortable: true,
            render: (purchase: any) => formatCurrency(purchase.grand_total),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (purchase: any) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : purchase.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {purchase.status}
                </span>
            ),
        },
    ];

    return (
        <>
            <Head title={`Supplier - ${supplier.name}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Suppliers
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{supplier.name}</h1>
                        <p className="text-muted-foreground">
                            {supplier.company_name && `Company: ${supplier.company_name}`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(supplier.id).url}>
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
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {supplier.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{supplier.phone}</span>
                                </div>
                            )}
                            {supplier.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{supplier.email}</span>
                                </div>
                            )}
                            {supplier.address && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                    <span>{supplier.address}</span>
                                </div>
                            )}
                            {supplier.tax_pin && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Tax PIN:</span>
                                    <span className="ml-2">{supplier.tax_pin}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        supplier.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {supplier.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            {supplier.notes && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Notes:</span>
                                    <p className="mt-1 text-sm">{supplier.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Purchases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={supplier.purchases}
                            columns={purchaseColumns}
                            searchable={false}
                            emptyState={{
                                title: 'No purchases found',
                                description: 'This supplier has no purchases yet',
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SupplierShow.layout = {
    breadcrumbs: [
        {
            title: 'Suppliers',
            href: index().url,
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};
