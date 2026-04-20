<?php

namespace App\Repositories;

use App\Models\Schedule;
use Carbon\Carbon;

class ScheduleRepository
{
    public function getForUser(?string $course, ?int $year, ?int $semesterLevel, ?string $groupName = null, ?string $dayOfWeek = null)
    {
        $query = Schedule::with('room');

        if ($course && $year !== null && $semesterLevel !== null) {
            $query->where('course', $course)
                ->where('year', $year)
                ->where('semester_level', $semesterLevel);
        } elseif ($groupName) {
            $query->where('group_name', $groupName);
        }

        if ($dayOfWeek) {
            $query->where('day_of_week', $dayOfWeek);
        }

        return $query->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
    }

    public function getForToday(?string $course = null, ?int $year = null, ?int $semesterLevel = null, ?string $groupName = null)
    {
        $today = Carbon::now()->format('l');

        $query = Schedule::with('room')
            ->where('day_of_week', $today);

        if ($course && $year !== null && $semesterLevel !== null) {
            $query->where('course', $course)
                ->where('year', $year)
                ->where('semester_level', $semesterLevel);
        } elseif ($groupName) {
            $query->where('group_name', $groupName);
        }

        return $query->orderBy('start_time')->get();
    }

    public function getForWeek(?string $course = null, ?int $year = null, ?int $semesterLevel = null, ?string $groupName = null)
    {
        $query = Schedule::with('room');

        if ($course && $year !== null && $semesterLevel !== null) {
            $query->where('course', $course)
                ->where('year', $year)
                ->where('semester_level', $semesterLevel);
        } elseif ($groupName) {
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
