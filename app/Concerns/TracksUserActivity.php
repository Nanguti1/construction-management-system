<?php

namespace App\Concerns;

use Illuminate\Support\Facades\Auth;

trait TracksUserActivity
{
    protected function setCreatedBy(): void
    {
        if (Auth::check()) {
            $this->created_by = Auth::id();
        }
    }

    protected function setUpdatedBy(): void
    {
        if (Auth::check()) {
            $this->updated_by = Auth::id();
        }
    }

    protected function setAuditFields(): void
    {
        $this->setCreatedBy();
        $this->setUpdatedBy();
    }
}
