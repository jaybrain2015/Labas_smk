<?php

namespace App\Repositories;

use App\Models\Event;
use Carbon\Carbon;

class EventRepository
{
    public function getAll(?string $category = null)
    {
        $query = Event::where('starts_at', '>=', Carbon::now()->startOfDay())
            ->orderBy('starts_at');

        if ($category) {
            $query->where('category', $category);
        }

        return $query->get();
    }

    public function getUpcoming(int $limit = 5)
    {
        return Event::where('starts_at', '>=', Carbon::now())
            ->orderBy('starts_at')
            ->limit($limit)
            ->get();
    }
}
