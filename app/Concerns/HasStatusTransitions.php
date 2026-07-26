<?php

namespace App\Concerns;

trait HasStatusTransitions
{
    abstract public function getStatus(): string;

    abstract public function setStatus(string $status): void;

    public function canTransitionTo(string $newStatus): bool
    {
        return $this->getValidTransitions()[$this->getStatus()] === $newStatus;
    }

    public function transitionTo(string $newStatus): bool
    {
        if (! $this->canTransitionTo($newStatus)) {
            return false;
        }

        $this->setStatus($newStatus);

        return true;
    }

    abstract protected function getValidTransitions(): array;
}
