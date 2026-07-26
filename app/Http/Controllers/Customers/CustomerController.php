<?php

namespace App\Http\Controllers\Customers;

use App\Actions\CreateCustomerAction;
use App\Actions\DeleteCustomerAction;
use App\Actions\UpdateCustomerAction;
use App\DTOs\CustomerData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customers\StoreCustomerRequest;
use App\Http\Requests\Customers\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        private CreateCustomerAction $createCustomerAction,
        private UpdateCustomerAction $updateCustomerAction,
        private DeleteCustomerAction $deleteCustomerAction
    ) {}

    public function index(): Response
    {
        $customers = Customer::query()
            ->withCount('invoices')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('customers/index', [
            'customers' => $customers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('customers/create');
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $data = CustomerData::fromArray($request->validated());
        $this->createCustomerAction->execute($data);

        return redirect()->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer): Response
    {
        $customer->load(['invoices' => function ($query) {
            $query->orderBy('invoice_date', 'desc')->limit(10);
        }]);

        return Inertia::render('customers/show', [
            'customer' => $customer,
        ]);
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('customers/edit', [
            'customer' => $customer,
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $data = CustomerData::fromArray($request->validated());
        $this->updateCustomerAction->execute($customer, $data);

        return redirect()->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $this->deleteCustomerAction->execute($customer);

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
