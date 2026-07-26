<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = ProductCategory::query()
            ->withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('Inventory/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Inventory/Categories/Create');
    }

    public function store(): RedirectResponse
    {
        // Implementation would go here
        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function show(ProductCategory $category): Response
    {
        $category->load('products');

        return Inertia::render('Inventory/Categories/Show', [
            'category' => $category,
        ]);
    }

    public function edit(ProductCategory $category): Response
    {
        return Inertia::render('Inventory/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(ProductCategory $category): RedirectResponse
    {
        // Implementation would go here
        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(ProductCategory $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}