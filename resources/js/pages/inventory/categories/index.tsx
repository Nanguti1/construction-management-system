import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Plus, Package } from 'lucide-react';
import { index, create, show, edit } from '@/routes/categories';

interface Category {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    products_count: number;
}

interface Props {
    categories: Category[];
}

export default function CategoryIndex({ categories }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (category: Category) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(edit(category.id).url);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (category: Category) => (
                <div>
                    <div className="font-medium">{category.name}</div>
                    {category.description && (
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'products_count',
            label: 'Products',
            sortable: true,
            render: (category: Category) => category.products_count,
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (category: Category) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {category.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'View',
            onClick: (category: Category) => {
                window.location.href = show(category.id).url;
            },
        },
        {
            label: 'Edit',
            onClick: (category: Category) => {
                window.location.href = edit(category.id).url;
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
            <Head title="Categories" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground">
                            Manage product categories
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </Link>
                </div>

                <DataTable
                    data={categories}
                    columns={columns}
                    actions={actions}
                    searchable
                    searchableFields={['name', 'description']}
                    emptyState={{
                        title: 'No categories found',
                        description: 'Get started by adding your first category',
                        action: {
                            label: 'Add Category',
                            onClick: () => {
                                window.location.href = create().url;
                            },
                        },
                    }}
                    onRowClick={(category) => {
                        window.location.href = show(category.id).url;
                    }}
                />
            </div>
        </>
    );
}

CategoryIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '/inventory',
        },
        {
            title: 'Categories',
            href: index().url,
        },
    ],
};
