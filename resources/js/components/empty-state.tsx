import { FileX, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: 'file' | 'search' | 'custom';
    customIcon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ 
    icon = 'file', 
    customIcon, 
    title, 
    description, 
    action,
    className 
}: EmptyStateProps) {
    const icons = {
        file: <FileX className="h-12 w-12 text-gray-400" />,
        search: <Search className="h-12 w-12 text-gray-400" />,
        custom: customIcon,
    };

    return (
        <div className={cn('flex flex-col items-center justify-center py-12', className)}>
            <div className="mb-4">
                {icons[icon]}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}