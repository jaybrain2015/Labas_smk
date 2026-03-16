<?php

namespace App\Repositories;

use App\Models\Room;
use App\Models\Schedule;
use Carbon\Carbon;

class RoomRepository
{
    public function getAllWithAvailability()
    {
        $rooms = Room::all();
        $now = Carbon::now();
        $today = $now->format('l');
        $currentTime = $now->format('H:i:s');

        $todaySchedules = Schedule::where('day_of_week', $today)->get()->groupBy('room_id');

        return $rooms->map(function ($room) use ($todaySchedules, $currentTime) {
            $roomSchedules = $todaySchedules->get($room->id, collect());

            $status = 'free';
            $currentClass = null;

            foreach ($roomSchedules as $schedule) {
                $start = $schedule->start_time;
                $end = $schedule->end_time;

                if ($currentTime >= $start && $currentTime < $end) {
                    $status = 'busy';
                    $currentClass = $schedule->subject;

                    // Check if ending within 30 minutes
                    $endCarbon = Carbon::createFromFormat('H:i:s', $end);
                    $diffMinutes = Carbon::now()->diffInMinutes($endCarbon, false);
                    if ($diffMinutes <= 30 && $diffMinutes > 0) {
                        $status = 'soon';
                    }
                    break;
                }
            }

            return [
                'id' => $room->id,
                'number' => $room->number,
                'floor' => $room->floor,
                'building' => $room->building,
                'capacity' => $room->capacity,
                'type' => $room->type,
                'equipment' => $room->equipment,
                'status' => $status,
                'current_class' => $currentClass,
            ];
        });
    }

    public function getWithTodaySchedule(int $id)
    {
        $room = Room::findOrFail($id);
        $today = Carbon::now()->format('l');
        $now = Carbon::now()->format('H:i:s');

        $todaySchedule = Schedule::where('room_id', $id)
            ->where('day_of_week', $today)
            ->orderBy('start_time')
            ->get();

        $status = 'free';
        foreach ($todaySchedule as $schedule) {
            if ($now >= $schedule->start_time && $now < $schedule->end_time) {
                $status = 'busy';
                $endCarbon = Carbon::createFromFormat('H:i:s', $schedule->end_time);
                $diffMinutes = Carbon::now()->diffInMinutes($endCarbon, false);
                if ($diffMinutes <= 30 && $diffMinutes > 0) {
                    $status = 'soon';
                }
                break;
            }
        }

        return [
            'id' => $room->id,
            'number' => $room->number,
            'floor' => $room->floor,
            'building' => $room->building,
            'capacity' => $room->capacity,
            'type' => $room->type,
            'equipment' => $room->equipment,
            'status' => $status,
            'today_schedule' => $todaySchedule->map(fn($s) => [
                'subject' => $s->subject,
                'lecturer' => $s->lecturer,
                'start_time' => $s->start_time,
                'end_time' => $s->end_time,
                'group_name' => $s->group_name,
            ]),
        ];
    }
}
