import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormCheckboxProps extends React.ComponentProps<typeof Checkbox> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function FormCheckbox({ 
    label, 
    error, 
    containerClassName, 
    className, 
    id, 
    ...props 
}: FormCheckboxProps) {
    return (
        <div className={cn('space-y-2', containerClassName)}>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={id}
                    className={cn(error && 'border-destructive', className)}
                    {...props}
                />
                {label && (
                    <Label 
                        htmlFor={id} 
                        className={cn('cursor-pointer', error && 'text-destructive')}
                    >
                        {label}
                    </Label>
                )}
            </div>
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}