import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormDateProps extends React.ComponentProps<typeof Input> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function FormDate({ 
    label, 
    error, 
    containerClassName, 
    className, 
    id, 
    ...props 
}: FormDateProps) {
    return (
        <div className={cn('space-y-2', containerClassName)}>
            {label && (
                <Label htmlFor={id} className={cn(error && 'text-destructive')}>
                    {label}
                </Label>
            )}
            <Input
                id={id}
                type="date"
                className={cn(error && 'border-destructive', className)}
                {...props}
            />
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}