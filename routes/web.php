<?php

use App\Http\Controllers\ComingSoonController;
use App\Http\Controllers\Customers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Inventory\CategoryController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\UnitController;
use App\Http\Controllers\Invoices\InvoiceController;
use App\Http\Controllers\Payments\PaymentController;
use App\Http\Controllers\Payments\ReceiptController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Purchases\PurchaseController;
use App\Http\Controllers\Quotations\QuotationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Suppliers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Customers
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index')->middleware('permission:view customers');
    Route::get('customers/create', [CustomerController::class, 'create'])->name('customers.create')->middleware('permission:create customers');
    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store')->middleware('permission:create customers');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show')->middleware('permission:view customers');
    Route::get('customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit')->middleware('permission:edit customers');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update')->middleware('permission:edit customers');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy')->middleware('permission:delete customers');

    // Suppliers
    Route::get('suppliers', [SupplierController::class, 'index'])->name('suppliers.index')->middleware('permission:view suppliers');
    Route::get('suppliers/create', [SupplierController::class, 'create'])->name('suppliers.create')->middleware('permission:create suppliers');
    Route::post('suppliers', [SupplierController::class, 'store'])->name('suppliers.store')->middleware('permission:create suppliers');
    Route::get('suppliers/{supplier}', [SupplierController::class, 'show'])->name('suppliers.show')->middleware('permission:view suppliers');
    Route::get('suppliers/{supplier}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit')->middleware('permission:edit suppliers');
    Route::put('suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update')->middleware('permission:edit suppliers');
    Route::delete('suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy')->middleware('permission:delete suppliers');

    // Products
    Route::get('products', [ProductController::class, 'index'])->name('products.index')->middleware('permission:view products');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create')->middleware('permission:create products');
    Route::post('products', [ProductController::class, 'store'])->name('products.store')->middleware('permission:create products');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show')->middleware('permission:view products');
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit')->middleware('permission:edit products');
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update')->middleware('permission:edit products');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy')->middleware('permission:delete products');

    // Purchases
    Route::resource('purchases', PurchaseController::class)
        ->middleware('permission:view purchases|create purchases|edit purchases|delete purchases');
    Route::post('purchases/{purchase}/receive', [PurchaseController::class, 'receive'])
        ->name('purchases.receive')
        ->middleware('permission:edit purchases');

    // Quotations
    Route::resource('quotations', QuotationController::class)
        ->middleware('permission:view quotations|create quotations|edit quotations|delete quotations');
    Route::post('quotations/{quotation}/convert-to-invoice', [QuotationController::class, 'convertToInvoice'])
        ->name('quotations.convert-to-invoice')
        ->middleware('permission:edit quotations');

    // Invoices
    Route::resource('invoices', InvoiceController::class)
        ->middleware('permission:view invoices|create invoices|edit invoices|delete invoices');
    Route::post('invoices/{invoice}/void', [InvoiceController::class, 'void'])
        ->name('invoices.void')
        ->middleware('permission:edit invoices');

    // Payments
    Route::resource('payments', PaymentController::class)
        ->middleware('permission:view payments|create payments|edit payments|delete payments');

    // Inventory
    Route::get('inventory', [InventoryController::class, 'index'])
        ->name('inventory.index')
        ->middleware('permission:view products');
    Route::get('inventory/movements', [InventoryController::class, 'movements'])
        ->name('inventory.movements')
        ->middleware('permission:view stock movements');
    Route::post('inventory/adjust', [InventoryController::class, 'adjust'])
        ->name('inventory.adjust')
        ->middleware('permission:adjust stock');
    Route::get('inventory/{product}', [InventoryController::class, 'show'])
        ->name('inventory.show')
        ->middleware('permission:view products');

    // Categories
    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index')->middleware('permission:view categories');
    Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create')->middleware('permission:create categories');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store')->middleware('permission:create categories');
    Route::get('categories/{category}', [CategoryController::class, 'show'])->name('categories.show')->middleware('permission:view categories');
    Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit')->middleware('permission:edit categories');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update')->middleware('permission:edit categories');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy')->middleware('permission:delete categories');

    // Units
    Route::get('units', [UnitController::class, 'index'])->name('units.index')->middleware('permission:view units');
    Route::get('units/create', [UnitController::class, 'create'])->name('units.create')->middleware('permission:create units');
    Route::post('units', [UnitController::class, 'store'])->name('units.store')->middleware('permission:create units');
    Route::get('units/{unit}', [UnitController::class, 'show'])->name('units.show')->middleware('permission:view units');
    Route::get('units/{unit}/edit', [UnitController::class, 'edit'])->name('units.edit')->middleware('permission:edit units');
    Route::put('units/{unit}', [UnitController::class, 'update'])->name('units.update')->middleware('permission:edit units');
    Route::delete('units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy')->middleware('permission:delete units');

    // Receipts
    Route::get('receipts/{receipt}', [ReceiptController::class, 'show'])
        ->name('receipts.show')
        ->middleware('permission:view receipts');

    // Reports
    Route::get('reports/sales', [ReportController::class, 'sales'])
        ->name('reports.sales')
        ->middleware('permission:view reports');
    Route::get('reports/purchases', [ReportController::class, 'purchases'])
        ->name('reports.purchases')
        ->middleware('permission:view reports');
    Route::get('reports/inventory', [ReportController::class, 'inventory'])
        ->name('reports.inventory')
        ->middleware('permission:view reports');

    // Users Management (Coming Soon)
    Route::get('users', [ComingSoonController::class, 'index'])
        ->name('users.index')
        ->defaults('feature', 'users');

    // Roles & Permissions (Coming Soon)
    Route::get('roles', [ComingSoonController::class, 'index'])
        ->name('roles.index')
        ->defaults('feature', 'roles');
    Route::get('permissions', [ComingSoonController::class, 'index'])
        ->name('permissions.index')
        ->defaults('feature', 'permissions');
});

require __DIR__.'/settings.php';
