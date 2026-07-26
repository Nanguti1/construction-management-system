import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, Package } from 'lucide-react';
import { index, create, show, edit, destroy } from '@/routes/units';

interface Unit {
    id: number;
    name: string;
    abbreviation: string;
    description: string | null;
    is_active: boolean;
    products_count: number;
}

interface Props {
    units: Unit[];
}

export default function UnitIndex({ units }: Props) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (unit: Unit) => {
        if (confirm('Are you sure you want to delete this unit?')) {
            deleteForm(destroy(unit.name).url);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (unit: Unit) => (
                <div>
                    <div className="font-medium">{unit.name}</div>
                    <div className="text-sm text-muted-foreground">{unit.abbreviation}</div>
                </div>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            sortable: true,
            render: (unit: Unit) => unit.description || '-',
        },
        {
            key: 'products_count',
            label: 'Products',
            sortable: true,
            render: (unit: Unit) => unit.products_count,
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (unit: Unit) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        unit.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {unit.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (unit: Unit) => {
                window.location.href = show(unit.name).url;
            },
        },
        {
            label: 'Edit',
            onClick: (unit: Unit) => {
                window.location.href = edit(unit.name).url;
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
            <Head title="Units" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Units</h1>
                        <p className="text-muted-foreground">
                            Manage measurement units
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Unit
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={units}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['name', 'abbreviation', 'description']}
                    emptyState={{
                        title: 'No units found',
                        description: 'Get started by adding your first unit',
                        action: {
                            label: 'Add Unit',
                            onClick: () => {
                                window.location.href = create().url;
                            },
                        },
                    }}
                    onRowClick={(unit) => {
                        window.location.href = show(unit.name).url;
                    }}
                />
            </div>
        </>
    );
}

UnitIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '/inventory',
        },
        {
            title: 'Units',
            href: index().url,
        },
    ],
};
