import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    Truck,
    Package,
    ShoppingCart,
    FileText,
    DollarSign,
    Receipt,
    BarChart3,
    Settings
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { movements } from '@/routes/inventory';
import type { NavItem } from '@/types';
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

export function AppSidebar() {

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                <SidebarGroup>
                    <SidebarGroupLabel>Customers & Suppliers</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/customers" prefetch>
                                    <Users className="h-4 w-4" />
                                    <span>Customers</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/suppliers" prefetch>
                                    <Truck className="h-4 w-4" />
                                    <span>Suppliers</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Inventory</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/categories" prefetch>
                                    <Package className="h-4 w-4" />
                                    <span>Categories</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/units" prefetch>
                                    <Package className="h-4 w-4" />
                                    <span>Units</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/products" prefetch>
                                    <Package className="h-4 w-4" />
                                    <span>Products</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/inventory" prefetch>
                                    <Package className="h-4 w-4" />
                                    <span>Stock Overview</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href={movements().url} prefetch>
                                    <Package className="h-4 w-4" />
                                    <span>Stock Movements</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Purchases</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/purchases" prefetch>
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>Purchases</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Sales</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/quotations" prefetch>
                                    <FileText className="h-4 w-4" />
                                    <span>Quotations</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/invoices" prefetch>
                                    <FileText className="h-4 w-4" />
                                    <span>Invoices</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/payments" prefetch>
                                    <DollarSign className="h-4 w-4" />
                                    <span>Payments</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/receipts" prefetch>
                                    <Receipt className="h-4 w-4" />
                                    <span>Receipts</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Reports</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/reports/sales" prefetch>
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Sales Report</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/reports/purchases" prefetch>
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Purchase Report</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/reports/inventory" prefetch>
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Inventory Report</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/users" prefetch>
                                    <Users className="h-4 w-4" />
                                    <span>Users</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/roles" prefetch>
                                    <Users className="h-4 w-4" />
                                    <span>Roles</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/permissions" prefetch>
                                    <Users className="h-4 w-4" />
                                    <span>Permissions</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/settings" prefetch>
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
