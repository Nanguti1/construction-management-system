<?php

namespace App\Exceptions;

use Exception;

class InvoiceAlreadyPaidException extends Exception
{
    public function __construct(string $invoiceNumber)
    {
        parent::__construct("Invoice '{$invoiceNumber}' is already paid and cannot accept additional payments.");
    }
}
