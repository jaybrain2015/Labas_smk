<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\RoomRepository;

class RoomController extends Controller
{
    protected RoomRepository $roomRepo;

    public function __construct(RoomRepository $roomRepo)
    {
        $this->roomRepo = $roomRepo;
    }

    public function availability()
    {
        $rooms = $this->roomRepo->getAllWithAvailability();

        return response()->json([
            'success' => true,
            'data' => $rooms,
            'message' => 'Room availability',
        ]);
    }

    public function show(int $id)
    {
        $room = $this->roomRepo->getWithTodaySchedule($id);

        return response()->json([
            'success' => true,
            'data' => $room,
            'message' => 'Room details',
        ]);
    }
}
