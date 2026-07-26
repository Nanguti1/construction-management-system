<?php

namespace App\Exceptions;

use Exception;

class DuplicateReceiptException extends Exception
{
    public function __construct(string $paymentId)
    {
        parent::__construct("A receipt already exists for payment '{$paymentId}'.");
    }
}
