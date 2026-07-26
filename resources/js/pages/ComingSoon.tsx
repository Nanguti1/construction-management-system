import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ComingSoonProps {
    feature: string;
}

export default function ComingSoon({ feature }: ComingSoonProps) {
    const featureTitle = feature
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <>
            <Head title={`${featureTitle} - Coming Soon`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{featureTitle}</h1>
                        <p className="text-muted-foreground">
                            Feature under development
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Construction className="h-16 w-16 text-muted-foreground mb-4" />
                        <CardTitle className="text-2xl mb-2">Coming Soon</CardTitle>
                        <p className="text-muted-foreground text-center max-w-md">
                            The {featureTitle} feature is currently under development. 
                            We're working hard to bring you this functionality.
                        </p>
                        <div className="mt-8">
                            <Link href="/dashboard">
                                <Button>
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ComingSoon.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Coming Soon',
            href: '#',
        },
    ],
};
