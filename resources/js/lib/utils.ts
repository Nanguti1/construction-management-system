import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(href: string | undefined | any): string {
    if (typeof href === 'string') {
        return href || '#';
    }
    if (href && typeof href === 'object' && href.url) {
        return href.url || '#';
    }
    return '#';
}