<?php

namespace App\Repositories;

use App\Models\Schedule;
use Carbon\Carbon;

class ScheduleRepository
{
    public function getForUser(string $groupName, ?string $dayOfWeek = null)
    {
        $query = Schedule::with('room')
            ->where('group_name', $groupName);

        if ($dayOfWeek) {
            $query->where('day_of_week', $dayOfWeek);
        }

        return $query->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
    }

    public function getForToday(?string $groupName = null)
    {
        $today = Carbon::now()->format('l'); // Monday, Tuesday, etc.

        $query = Schedule::with('room')
            ->where('day_of_week', $today);

        if ($groupName) {
            $query->where('group_name', $groupName);
        }

        return $query->orderBy('start_time')->get();
    }

    public function getForWeek(?string $groupName = null)
    {
        $query = Schedule::with('room');

        if ($groupName) {
            $query->where('group_name', $groupName);
        }

        return $query->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
    }

    public function getForRoom(int $roomId, ?string $dayOfWeek = null)
    {
        $query = Schedule::where('room_id', $roomId);

        if ($dayOfWeek) {
            $query->where('day_of_week', $dayOfWeek);
        }

        return $query->orderBy('start_time')->get();
    }
}
