<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;

class EventController extends Controller
{
    protected EventRepository $eventRepo;

    public function __construct(EventRepository $eventRepo)
    {
        $this->eventRepo = $eventRepo;
    }

    public function index(Request $request)
    {
        $category = $request->query('category');
        $events = $this->eventRepo->getAll($category);

        return response()->json([
            'success' => true,
            'data' => $events,
            'message' => 'All events',
        ]);
    }

    public function upcoming()
    {
        $events = $this->eventRepo->getUpcoming(5);

        return response()->json([
            'success' => true,
            'data' => $events,
            'message' => 'Upcoming events',
        ]);
    }
}
