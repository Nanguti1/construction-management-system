import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormCurrencyProps extends Omit<React.ComponentProps<typeof Input>, 'type'> {
    label?: string;
    error?: string;
    containerClassName?: string;
    currency?: string;
}

export function FormCurrency({ 
    label, 
    error, 
    containerClassName, 
    className, 
    id,
    currency = '$',
    ...props 
}: FormCurrencyProps) {
    return (
        <div className={cn('space-y-2', containerClassName)}>
            {label && (
                <Label htmlFor={id} className={cn(error && 'text-destructive')}>
                    {label}
                </Label>
            )}
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {currency}
                </span>
                <Input
                    id={id}
                    type="number"
                    step="0.01"
                    className={cn('pl-8', error && 'border-destructive', className)}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}