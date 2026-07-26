import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type InvoiceStatus = 'draft' | 'pending' | 'partially_paid' | 'paid' | 'cancelled';
type PurchaseStatus = 'pending' | 'received' | 'cancelled';
type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
type ProductStatus = 'active' | 'inactive' | 'low_stock';

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
    const variants: Record<InvoiceStatus, string> = {
        draft: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        partially_paid: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        paid: 'bg-green-100 text-green-800 hover:bg-green-200',
        cancelled: 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    const labels: Record<InvoiceStatus, string> = {
        draft: 'Draft',
        pending: 'Pending',
        partially_paid: 'Partially Paid',
        paid: 'Paid',
        cancelled: 'Cancelled',
    };

    return (
        <Badge className={cn(variants[status], 'capitalize')}>
            {labels[status]}
        </Badge>
    );
}

export function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
    const variants: Record<PurchaseStatus, string> = {
        pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        received: 'bg-green-100 text-green-800 hover:bg-green-200',
        cancelled: 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    const labels: Record<PurchaseStatus, string> = {
        pending: 'Pending',
        received: 'Received',
        cancelled: 'Cancelled',
    };

    return (
        <Badge className={cn(variants[status], 'capitalize')}>
            {labels[status]}
        </Badge>
    );
}

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
    const variants: Record<QuotationStatus, string> = {
        draft: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        sent: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        accepted: 'bg-green-100 text-green-800 hover:bg-green-200',
        rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
        expired: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    };

    const labels: Record<QuotationStatus, string> = {
        draft: 'Draft',
        sent: 'Sent',
        accepted: 'Accepted',
        rejected: 'Rejected',
        expired: 'Expired',
    };

    return (
        <Badge className={cn(variants[status], 'capitalize')}>
            {labels[status]}
        </Badge>
    );
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
    const variants: Record<ProductStatus, string> = {
        active: 'bg-green-100 text-green-800 hover:bg-green-200',
        inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        low_stock: 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    const labels: Record<ProductStatus, string> = {
        active: 'Active',
        inactive: 'Inactive',
        low_stock: 'Low Stock',
    };

    return (
        <Badge className={cn(variants[status], 'capitalize')}>
            {labels[status]}
        </Badge>
    );
}