<?php

namespace App\Exceptions;

use Exception;

class InvalidQuotationException extends Exception
{
    public static function cannotConvert(string $reason): self
    {
        return new self("Cannot convert quotation to invoice: {$reason}");
    }

    public static function notFound(string $quotationNumber): self
    {
        return new self("Quotation '{$quotationNumber}' not found.");
    }

    public static function alreadyConverted(string $quotationNumber): self
    {
        return new self("Quotation '{$quotationNumber}' has already been converted to an invoice.");
    }
}
