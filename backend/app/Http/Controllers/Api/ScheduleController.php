<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\ScheduleRepository;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    protected ScheduleRepository $scheduleRepo;

    public function __construct(ScheduleRepository $scheduleRepo)
    {
        $this->scheduleRepo = $scheduleRepo;
    }

    public function my(Request $request)
    {
        $user = $request->user();
        $schedule = $this->scheduleRepo->getForToday(
            $user->course,
            $user->year,
            $user->semester_level,
            $user->student_id
        );

        return response()->json([
            'success' => true,
            'data' => $schedule->map(fn($s) => [
                'id' => $s->id,
                'subject' => $s->subject,
                'lecturer' => $s->lecturer,
                'room' => $s->room ? ['number' => $s->room->number, 'floor' => $s->room->floor] : null,
                'day_of_week' => $s->day_of_week,
                'start_time' => $s->start_time,
                'end_time' => $s->end_time,
                'group_name' => $s->group_name,
            ]),
            'message' => 'Today\'s schedule',
        ]);
    }

    public function week(Request $request)
    {
        $user = $request->user();
        $schedule = $this->scheduleRepo->getForWeek(
            $user->course,
            $user->year,
            $user->semester_level,
            $user->student_id
        );

        return response()->json([
            'success' => true,
            'data' => $schedule->map(fn($s) => [
                'id' => $s->id,
                'subject' => $s->subject,
                'lecturer' => $s->lecturer,
                'room' => $s->room ? ['number' => $s->room->number, 'floor' => $s->room->floor] : null,
                'day_of_week' => $s->day_of_week,
                'start_time' => $s->start_time,
                'end_time' => $s->end_time,
                'group_name' => $s->group_name,
            ]),
            'message' => 'Weekly schedule',
        ]);
    }
}
