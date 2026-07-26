import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.ComponentProps<typeof Input> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function FormInput({ 
    label, 
    error, 
    containerClassName, 
    className, 
    id, 
    ...props 
}: FormInputProps) {
    return (
        <div className={cn('space-y-2', containerClassName)}>
            {label && (
                <Label htmlFor={id} className={cn(error && 'text-destructive')}>
                    {label}
                </Label>
            )}
            <Input
                id={id}
                className={cn(error && 'border-destructive', className)}
                {...props}
            />
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}