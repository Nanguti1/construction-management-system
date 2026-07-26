<?php

namespace App\Exceptions;

use Exception;

class BusinessException extends Exception
{
    public static function generic(string $message): self
    {
        return new self($message);
    }
}
