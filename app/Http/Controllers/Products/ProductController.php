<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with('category', 'unit')
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                $product->category_name = $product->category?->name ?? null;
                $product->unit_name = $product->unit?->name ?? null;

                return $product;
            });

        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        $categories = ProductCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $units = Unit::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('products/create', [
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Product::create([
            'category_id' => $validated['category_id'],
            'unit_id' => $validated['unit_id'],
            'sku' => $validated['sku'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'cost_price' => $validated['cost_price'],
            'selling_price' => $validated['selling_price'],
            'minimum_stock' => $validated['minimum_stock'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product): Response
    {
        $product->load('category', 'unit');

        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        $categories = ProductCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $units = Unit::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $product->update([
            'category_id' => $validated['category_id'],
            'unit_id' => $validated['unit_id'],
            'sku' => $validated['sku'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'cost_price' => $validated['cost_price'],
            'selling_price' => $validated['selling_price'],
            'minimum_stock' => $validated['minimum_stock'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
