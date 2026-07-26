<?php

namespace App\Concerns;

trait FormatsMoney
{
    protected function formatMoney(float $amount): string
    {
        return number_format($amount, 2, '.', ',');
    }

    protected function formatMoneyWithCurrency(float $amount, string $currency = '$'): string
    {
        return $currency . $this->formatMoney($amount);
    }
}
