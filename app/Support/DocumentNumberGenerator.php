<?php

namespace App\Support;

class DocumentNumberGenerator
{
    public static function generateQuotationNumber(): string
    {
        $year = now()->year;
        $prefix = "QT-{$year}";
        $sequence = self::getNextSequence($prefix);
        return "{$prefix}" . str_pad($sequence, 6, '0', STR_PAD_LEFT);
    }

    public static function generateInvoiceNumber(): string
    {
        $year = now()->year;
        $prefix = "INV-{$year}";
        $sequence = self::getNextSequence($prefix);
        return "{$prefix}" . str_pad($sequence, 6, '0', STR_PAD_LEFT);
    }

    public static function generatePurchaseNumber(): string
    {
        $year = now()->year;
        $prefix = "PUR-{$year}";
        $sequence = self::getNextSequence($prefix);
        return "{$prefix}" . str_pad($sequence, 6, '0', STR_PAD_LEFT);
    }

    public static function generateReceiptNumber(): string
    {
        $year = now()->year;
        $prefix = "RCP-{$year}";
        $sequence = self::getNextSequence($prefix);
        return "{$prefix}" . str_pad($sequence, 6, '0', STR_PAD_LEFT);
    }

    protected static function getNextSequence(string $prefix): int
    {
        // This is a simple implementation. In production, you might want to:
        // 1. Use a database sequence table
        // 2. Use Redis for distributed systems
        // 3. Use locking to prevent race conditions
        
        $cacheKey = "document_sequence_{$prefix}";
        $sequence = cache()->get($cacheKey, 0);
        $sequence++;
        cache()->put($cacheKey, $sequence, now()->addYear());
        
        return $sequence;
    }

    public static function resetSequence(string $prefix): void
    {
        $cacheKey = "document_sequence_{$prefix}";
        cache()->forget($cacheKey);
    }
}
