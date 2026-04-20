<?php

namespace App\Repositories;

use App\Models\Event;
use Carbon\Carbon;

class EventRepository
{
    public function getAll(?string $category = null, ?bool $isEditorial = null)
    {
        $query = Event::orderBy('starts_at', 'desc');

        if ($category) {
            $query->where('category', $category);
        }

        if ($isEditorial !== null) {
            $query->where('is_editorial', $isEditorial);
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

    public function find(int $id)
    {
        return Event::findOrFail($id);
    }

    public function create(array $data)
    {
        return Event::create($data);
    }

    public function update(int $id, array $data)
    {
        $event = $this->find($id);
        $event->update($data);
        return $event;
    }

    public function delete(int $id)
    {
        $event = $this->find($id);
        return $event->delete();
    }
}
