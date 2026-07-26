<?php

namespace App\Services;

use App\Actions\CreatePurchaseAction;
use App\Actions\ReceivePurchaseAction;
use App\DTOs\PurchaseData;
use App\Models\Purchase;

class PurchaseService
{
    public function __construct(
        private CreatePurchaseAction $createPurchaseAction,
        private ReceivePurchaseAction $receivePurchaseAction
    ) {}

    public function createPurchase(PurchaseData $data): Purchase
    {
        return $this->createPurchaseAction->execute($data);
    }

    public function receivePurchase(int $purchaseId): Purchase
    {
        return $this->receivePurchaseAction->execute($purchaseId);
    }
}