<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    public function __construct(string $productName, int $requested, int $available)
    {
        parent::__construct(
            "Insufficient stock for product '{$productName}'. Requested: {$requested}, Available: {$available}"
        );
    }
}
