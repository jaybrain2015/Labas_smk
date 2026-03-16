<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Repositories\ScheduleRepository;
use App\Repositories\RoomRepository;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    protected ScheduleRepository $scheduleRepo;
    protected RoomRepository $roomRepo;
    protected EventRepository $eventRepo;

    public function __construct(
        ScheduleRepository $scheduleRepo,
        RoomRepository $roomRepo,
        EventRepository $eventRepo
    ) {
        $this->scheduleRepo = $scheduleRepo;
        $this->roomRepo = $roomRepo;
        $this->eventRepo = $eventRepo;
    }

    public function send(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $user = $request->user();
        $message = $request->input('message');

        // Build user context
        $todaySchedule = $this->scheduleRepo->getForToday($user->student_id);
        $rooms = $this->roomRepo->getAllWithAvailability();
        $events = $this->eventRepo->getUpcoming(3);

        $userContext = [
            'user_name' => $user->name,
            'schedule' => $todaySchedule->map(fn($s) => [
                'subject' => $s->subject,
                'lecturer' => $s->lecturer,
                'start_time' => $s->start_time,
                'end_time' => $s->end_time,
                'room_number' => $s->room?->number,
            ])->toArray(),
            'rooms' => $rooms->take(15)->map(fn($r) => [
                'number' => $r['number'],
                'status' => $r['status'],
            ])->toArray(),
            'events' => $events->map(fn($e) => [
                'title' => $e->title,
                'starts_at' => $e->starts_at?->format('Y-m-d H:i'),
                'location' => $e->location,
            ])->toArray(),
        ];

        // Call AI service
        $aiServiceUrl = env('AI_SERVICE_URL', 'http://ai-service:8001');

        try {
            $response = Http::timeout(300)->post("{$aiServiceUrl}/chat", [
                'message' => $message,
                'user_context' => $userContext,
                'language' => $user->language_preference,
            ]);

            $aiResponse = $response->json();
        } catch (\Exception $e) {
            \Log::error("Chat AI Service Error: " . $e->getMessage());
            $aiResponse = [
                'response' => 'Sorry, the AI service is temporarily unavailable. Please try again later.',
                'detected_language' => $user->language_preference,
                'suggestions' => [],
            ];
        }

        // Save to chat history
        $session = ChatSession::firstOrCreate(
            ['user_id' => $user->id],
            ['messages' => []]
        );

        $messages = $session->messages ?? [];
        $messages[] = [
            'role' => 'user',
            'content' => $message,
            'timestamp' => now()->toISOString(),
        ];
        $messages[] = [
            'role' => 'assistant',
            'content' => $aiResponse['response'] ?? 'No response',
            'timestamp' => now()->toISOString(),
        ];

        // Keep last 50 messages
        $messages = array_slice($messages, -50);
        $session->update(['messages' => $messages]);

        return response()->json([
            'success' => true,
            'data' => [
                'response' => $aiResponse['response'] ?? 'No response',
                'detected_language' => $aiResponse['detected_language'] ?? 'en',
                'suggestions' => $aiResponse['suggestions'] ?? [],
            ],
            'message' => 'Chat response',
        ]);
    }

    public function history(Request $request)
    {
        $user = $request->user();
        $session = ChatSession::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'data' => [
                'messages' => $session?->messages ?? [],
            ],
            'message' => 'Chat history',
        ]);
    }
}
