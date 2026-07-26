import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { ArrowLeft } from 'lucide-react';
import { index, update, show } from '@/routes/units';

interface Unit {
    id: number;
    name: string;
    abbreviation: string;
    description: string | null;
    is_active: boolean;
}

interface Props {
    unit: Unit;
}

export default function UnitEdit({ unit }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: unit.name,
        abbreviation: unit.abbreviation,
        description: unit.description || '',
        is_active: unit.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(unit.name).url);
    };

    return (
        <>
            <Head title="Edit Unit" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Units
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">Edit Unit</h1>
                        <p className="text-muted-foreground">
                            Update unit information
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Unit Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormInput
                                    label="Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    id="name"
                                    required
                                />

                                <FormInput
                                    label="Abbreviation"
                                    value={data.abbreviation}
                                    onChange={(e) => setData('abbreviation', e.target.value)}
                                    error={errors.abbreviation}
                                    id="abbreviation"
                                    required
                                />
                            </div>

                            <FormTextarea
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={errors.description}
                                id="description"
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
                                <Link href={show(unit.name).url}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Unit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UnitEdit.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '/inventory',
        },
        {
            title: 'Units',
            href: '/units',
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
