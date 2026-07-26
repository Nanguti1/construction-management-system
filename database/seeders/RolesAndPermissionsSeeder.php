<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Customers
            'view customers',
            'create customers',
            'edit customers',
            'delete customers',

            // Suppliers
            'view suppliers',
            'create suppliers',
            'edit suppliers',
            'delete suppliers',

            // Products
            'view products',
            'create products',
            'edit products',
            'delete products',

            // Categories
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            // Units
            'view units',
            'create units',
            'edit units',
            'delete units',

            // Purchases
            'view purchases',
            'create purchases',
            'edit purchases',
            'delete purchases',

            // Quotations
            'view quotations',
            'create quotations',
            'edit quotations',
            'delete quotations',

            // Invoices
            'view invoices',
            'create invoices',
            'edit invoices',
            'delete invoices',

            // Payments
            'view payments',
            'create payments',
            'edit payments',
            'delete payments',

            // Receipts
            'view receipts',
            'create receipts',
            'edit receipts',
            'delete receipts',

            // Stock Movements
            'view stock movements',
            'adjust stock',

            // Reports
            'view reports',

            // Users Management
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Roles & Permissions Management
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'manage permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Create roles and assign permissions

        // Admin role - has all permissions
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);
        $adminRole->givePermissionTo(Permission::all());

        // Manager role - has all permissions except user/role management
        $managerRole = Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => 'web',
        ]);
        $managerPermissions = Permission::whereNotIn('name', [
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'manage permissions',
        ])->get();
        $managerRole->givePermissionTo($managerPermissions);

        // User role - basic view permissions only
        $userRole = Role::firstOrCreate([
            'name' => 'user',
            'guard_name' => 'web',
        ]);
        $userPermissions = Permission::whereIn('name', [
            'view customers',
            'view suppliers',
            'view products',
            'view categories',
            'view units',
            'view purchases',
            'view quotations',
            'view invoices',
            'view payments',
            'view receipts',
            'view stock movements',
            'view reports',
        ])->get();
        $userRole->givePermissionTo($userPermissions);
    }
}
