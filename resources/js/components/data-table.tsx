import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/empty-state';
import { cn } from '@/lib/utils';

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
}

interface Action<T> {
    label: string;
    onClick: (item: T) => void;
    destructive?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: Action<T>[];
    searchable?: boolean;
    searchableFields?: (keyof T)[];
    loading?: boolean;
    emptyState?: {
        title: string;
        description: string;
        action?: {
            label: string;
            onClick: () => void;
        };
    };
    onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    actions,
    searchable = true,
    searchableFields,
    loading = false,
    emptyState,
    onRowClick,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Filter data based on search query
    const filteredData = searchable && searchQuery
        ? data.filter((item) => {
            if (!searchableFields) {
                return Object.values(item).some(
                    (value) =>
                        value !== null &&
                        value !== undefined &&
                        String(value).toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            return searchableFields.some((field) => {
                const value = item[field];
                return (
                    value !== null &&
                    value !== undefined &&
                    String(value).toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
        })
        : data;

    // Sort data
    const sortedData = sortColumn
        ? [...filteredData].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue === bValue) return 0;

            const comparison = aValue < bValue ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        })
        : filteredData;

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (sortColumn !== column) {
            return <ChevronsUpDown className="h-4 w-4 ml-2" />;
        }
        return sortDirection === 'asc' ? (
            <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
        );
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {searchable && (
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <div className="h-10 w-full rounded-md border border-input bg-background pl-8" />
                        </div>
                    </div>
                )}
                <div className="rounded-md border">
                    <div className="h-10 border-b bg-muted/50" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 border-b last:border-b-0" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {searchable && (
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key}>
                                    {column.sortable ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 font-medium"
                                            onClick={() => handleSort(column.key)}
                                        >
                                            {column.label}
                                            {getSortIcon(column.key)}
                                        </Button>
                                    ) : (
                                        column.label
                                    )}
                                </TableHead>
                            ))}
                            {actions && actions.length > 0 && (
                                <TableHead className="w-[50px]">Actions</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actions?.length ? 1 : 0)}
                                    className="h-24 text-center"
                                >
                                    {emptyState ? (
                                        <EmptyState
                                            icon="search"
                                            title={emptyState.title}
                                            description={emptyState.description}
                                            action={emptyState.action}
                                        />
                                    ) : (
                                        <EmptyState
                                            icon="search"
                                            title="No results found"
                                            description="Try adjusting your search or filters"
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedData.map((item, index) => (
                                <TableRow
                                    key={index}
                                    className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.key}>
                                            {column.render ? column.render(item) : String(item[column.key] ?? '')}
                                        </TableCell>
                                    ))}
                                    {actions && actions.length > 0 && (
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {actions.map((action, actionIndex) => (
                                                        <DropdownMenuItem
                                                            key={actionIndex}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                action.onClick(item);
                                                            }}
                                                            className={cn(
                                                                action.destructive && 'text-destructive'
                                                            )}
                                                        >
                                                            {action.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {sortedData.length > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                        Showing {sortedData.length} of {data.length} results
                    </div>
                </div>
            )}
        </div>
    );
}