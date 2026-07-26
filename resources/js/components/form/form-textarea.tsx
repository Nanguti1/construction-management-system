import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.ComponentProps<typeof Textarea> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function FormTextarea({ 
    label, 
    error, 
    containerClassName, 
    className, 
    id, 
    ...props 
}: FormTextareaProps) {
    return (
        <div className={cn('space-y-2', containerClassName)}>
            {label && (
                <Label htmlFor={id} className={cn(error && 'text-destructive')}>
                    {label}
                </Label>
            )}
            <Textarea
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