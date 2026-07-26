import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, Phone, Mail, MapPin } from 'lucide-react';
import { index, create, show, edit } from '@/routes/suppliers';

interface Supplier {
    id: number;
    company_name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    is_active: boolean;
    purchases_count: number;
}

interface Props {
    suppliers: Supplier[];
}

export default function SupplierIndex({ suppliers }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (supplier: Supplier) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            destroy(edit(supplier.id).url);
        }
    };

    const columns = [
        {
            key: 'company_name',
            label: 'Company Name',
            sortable: true,
            render: (supplier: Supplier) => (
                <div className="font-medium">{supplier.company_name}</div>
            ),
        },
        {
            key: 'contact',
            label: 'Contact',
            render: (supplier: Supplier) => (
                <div className="space-y-1">
                    {supplier.phone && (
                        <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {supplier.phone}
                        </div>
                    )}
                    {supplier.email && (
                        <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {supplier.email}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'purchases_count',
            label: 'Purchases',
            sortable: true,
            render: (supplier: Supplier) => supplier.purchases_count,
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (supplier: Supplier) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplier.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {supplier.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (supplier: Supplier) => {
                window.location.href = show(supplier.id).url;
            },
        },
        {
            label: 'Edit',
            onClick: (supplier: Supplier) => {
                window.location.href = edit(supplier.id).url;
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
            <Head title="Suppliers" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                        <p className="text-muted-foreground">
                            Manage your supplier database
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Supplier
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={suppliers}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['company_name', 'email', 'phone']}
                    emptyState={{
                        title: 'No suppliers found',
                        description: 'Get started by adding your first supplier',
                        action: {
                            label: 'Add Supplier',
                            onClick: () => {
                                window.location.href = create().url;
                            },
                        },
                    }}
                    onRowClick={(supplier) => {
                        window.location.href = show(supplier.id).url;
                    }}
                />
            </div>
        </>
    );
}

SupplierIndex.layout = {
    breadcrumbs: [
        {
            title: 'Suppliers',
            href: index().url,
        },
    ],
};
