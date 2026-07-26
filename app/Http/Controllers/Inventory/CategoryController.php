<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
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

        return Inertia::render('inventory/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/categories/create');
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        ProductCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function show(ProductCategory $category): Response
    {
        $category->load('products');

        return Inertia::render('inventory/categories/show', [
            'category' => $category,
        ]);
    }

    public function edit(ProductCategory $category): Response
    {
        return Inertia::render('inventory/categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, ProductCategory $category): RedirectResponse
    {
        $validated = $request->validated();

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'updated_by' => auth()->id(),
        ]);

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
