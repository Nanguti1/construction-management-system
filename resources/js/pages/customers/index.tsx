import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, Phone, Mail, MapPin } from 'lucide-react';
import { index, create, show, edit } from '@/routes/customers';

interface Customer {
    id: number;
    name: string;
    type: string;
    company_name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    is_active: boolean;
    invoices_count: number;
}

interface Props {
    customers: Customer[];
}

export default function CustomerIndex({ customers }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (customer: Customer) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            destroy(edit(customer.id).url);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (customer: Customer) => (
                <div>
                    <div className="font-medium">{customer.name}</div>
                    {customer.company_name && (
                        <div className="text-sm text-muted-foreground">{customer.company_name}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (customer: Customer) => (
                <span className="capitalize">{customer.type}</span>
            ),
        },
        {
            key: 'contact',
            label: 'Contact',
            render: (customer: Customer) => (
                <div className="space-y-1">
                    {customer.phone && (
                        <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                        </div>
                    )}
                    {customer.email && (
                        <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {customer.email}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'invoices_count',
            label: 'Invoices',
            sortable: true,
            render: (customer: Customer) => customer.invoices_count,
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (customer: Customer) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {customer.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (customer: Customer) => {
                window.location.href = show(customer.id).url;
            },
        },
        {
            label: 'Edit',
            onClick: (customer: Customer) => {
                window.location.href = edit(customer.id).url;
            },
        },
        {
            label: 'Delete',
            onClick: handleDelete,
            destructive: true,
        },
    ];

    return (
        <>
            <Head title="Customers" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                        <p className="text-muted-foreground">
                            Manage your customer database
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Customer
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={customers}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['name', 'company_name', 'email', 'phone']}
                    emptyState={{
                        title: 'No customers found',
                        description: 'Get started by adding your first customer',
                        action: {
                            label: 'Add Customer',
                            onClick: () => {
                                window.location.href = create().url;
                            },
                        },
                    }}
                    onRowClick={(customer) => {
                        window.location.href = show(customer.id).url;
                    }}
                />
            </div>
        </>
    );
}

CustomerIndex.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: index().url,
        },
    ],
};