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

        return $rooms->map(function ($room) use ($todaySchedules, $currentTime, $now) {
            $roomSchedules = $todaySchedules->get($room->id, collect())->sortBy('start_time');

            $status = 'free';
            $currentClass = null;
            
            // Determine default closing time
            $isSaturday = $now->isSaturday();
            if ($room->type === 'library') {
                $closingTime = $isSaturday ? '16:00:00' : '20:00:00';
            } else {
                $closingTime = '20:00:00'; // School closes at 8 o'clock
            }
            
            $freeUntil = $closingTime;
            $nextClassAt = null;

            foreach ($roomSchedules as $schedule) {
                $start = $schedule->start_time;
                $end = $schedule->end_time;

                if ($currentTime >= $start && $currentTime < $end) {
                    $status = 'busy';
                    $currentClass = $schedule->subject;
                    $freeUntil = $end;

                    // Check if ending within 30 minutes
                    $endCarbon = Carbon::createFromFormat('H:i:s', $end);
                    $diffMinutes = $now->diffInMinutes($endCarbon, false);
                    if ($diffMinutes <= 30 && $diffMinutes > 0) {
                        $status = 'soon';
                    }
                    
                    continue;
                }

                if ($currentTime < $start && !$nextClassAt) {
                    $nextClassAt = $start;
                    if ($status === 'free') {
                        $freeUntil = $start;
                    }
                }
            }

            $durationMinutes = null;
            if ($status === 'free' && $freeUntil) {
                $untilCarbon = Carbon::createFromFormat('H:i:s', $freeUntil);
                $durationMinutes = (int) $now->diffInMinutes($untilCarbon, false);
                
                // If it's already past closing time, it's not free
                if ($durationMinutes < 0) {
                    $durationMinutes = 0;
                    $status = 'busy'; // Or some 'closed' status
                }
            }

            return [
                'id' => $room->id,
                'number' => $room->number,
                'name' => $room->name,
                'floor' => $room->floor,
                'building' => $room->building,
                'capacity' => $room->capacity,
                'type' => $room->type,
                'equipment' => $room->equipment,
                'status' => $status,
                'current_class' => $currentClass,
                'free_until' => substr($freeUntil, 0, 5),
                'next_class_at' => $nextClassAt ? substr($nextClassAt, 0, 5) : null,
                'duration_minutes' => $durationMinutes,
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
            'name' => $room->name,
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
