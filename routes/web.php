<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Customers\CustomerController;
use App\Http\Controllers\Suppliers\SupplierController;
use App\Http\Controllers\Purchases\PurchaseController;
use App\Http\Controllers\Quotations\QuotationController;
use App\Http\Controllers\Invoices\InvoiceController;
use App\Http\Controllers\Payments\PaymentController;
use App\Http\Controllers\Payments\ReceiptController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\CategoryController;
use App\Http\Controllers\Inventory\UnitController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check() 
        ? redirect()->route('dashboard') 
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Customers
    Route::resource('customers', CustomerController::class);

    // Suppliers
    Route::resource('suppliers', SupplierController::class);

    // Purchases
    Route::resource('purchases', PurchaseController::class);
    Route::post('purchases/{purchase}/receive', [PurchaseController::class, 'receive'])->name('purchases.receive');

    // Quotations
    Route::resource('quotations', QuotationController::class);
    Route::post('quotations/{quotation}/convert-to-invoice', [QuotationController::class, 'convertToInvoice'])
        ->name('quotations.convert-to-invoice');

    // Invoices
    Route::resource('invoices', InvoiceController::class);
    Route::post('invoices/{invoice}/void', [InvoiceController::class, 'void'])->name('invoices.void');

    // Payments
    Route::resource('payments', PaymentController::class);

    // Inventory
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::get('inventory/{product}', [InventoryController::class, 'show'])->name('inventory.show');
    Route::post('inventory/adjust', [InventoryController::class, 'adjust'])->name('inventory.adjust');
    Route::get('inventory/movements', [InventoryController::class, 'movements'])->name('inventory.movements');
    
    // Categories
    Route::resource('categories', CategoryController::class);
    
    // Units
    Route::resource('units', UnitController::class);
    
    // Receipts
    Route::get('receipts/{receipt}', [ReceiptController::class, 'show'])->name('receipts.show');
});

require __DIR__.'/settings.php';
