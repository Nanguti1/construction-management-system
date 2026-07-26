import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormSelectProps {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    value?: string;
    onValueChange: (value: string) => void;
    containerClassName?: string;
    className?: string;
    id?: string;
}

export function FormSelect({ 
    label, 
    error, 
    options, 
    placeholder = 'Select an option', 
    value, 
    onValueChange, 
    containerClassName, 
    className,
    id,
}: FormSelectProps) {
    return (
        <div className={cn('space-y-2', containerClassName)}>
            {label && (
                <Label htmlFor={id} className={cn(error && 'text-destructive')}>
                    {label}
                </Label>
            )}
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger 
                    id={id}
                    className={cn(error && 'border-destructive', className)}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}