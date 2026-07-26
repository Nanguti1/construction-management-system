<?php

use App\Models\Customer;
use App\Models\User;

test('admin user can edit customers', function () {
    $admin = User::where('email', 'g.nanguti@gmail.com')->first();

    if (! $admin) {
        $this->markTestSkipped('Admin user not found');
    }

    $customer = Customer::first();

    if (! $customer) {
        $this->markTestSkipped('No customer found in database');
    }

    $response = $this->actingAs($admin)
        ->get(route('customers.edit', $customer));

    $response->assertStatus(200);
});

test('admin user has edit customers permission', function () {
    $admin = User::where('email', 'g.nanguti@gmail.com')->first();

    if (! $admin) {
        $this->markTestSkipped('Admin user not found');
    }

    $this->assertTrue($admin->can('edit customers'));
});

test('admin user has admin role', function () {
    $admin = User::where('email', 'g.nanguti@gmail.com')->first();

    if (! $admin) {
        $this->markTestSkipped('Admin user not found');
    }

    $this->assertTrue($admin->hasRole('admin'));
});
