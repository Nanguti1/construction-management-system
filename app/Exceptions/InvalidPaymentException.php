<?php

namespace App\Exceptions;

use Exception;

class InvalidPaymentException extends Exception
{
    public static function exceedsBalance(string $invoiceNumber, float $amount, float $balance): self
    {
        return new self(
            "Payment amount ({$amount}) exceeds outstanding balance ({$balance}) for invoice '{$invoiceNumber}'."
        );
    }

    public static function invoiceCannotAcceptPayment(string $invoiceNumber, string $status): self
    {
        return new self("Invoice '{$invoiceNumber}' with status '{$status}' cannot accept payments.");
    }
}
