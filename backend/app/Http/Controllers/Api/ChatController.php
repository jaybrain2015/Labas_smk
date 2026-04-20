<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Repositories\ScheduleRepository;
use App\Repositories\RoomRepository;
use App\Repositories\EventRepository;
use App\Models\StudyProgram;
use App\Models\Lecturer;
use App\Models\News;
use App\Models\FaqEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\StreamedResponse;
use GuzzleHttp\Client;


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
        $todaySchedule = $this->scheduleRepo->getForToday(
            $user->course,
            $user->year,
            $user->semester_level,
            $user->student_id
        );
        $rooms = $this->roomRepo->getAllWithAvailability();
        $events = $this->eventRepo->getUpcoming(3);

        $faqs = FaqEntry::latest()->take(10)->get();
 
        $programs = StudyProgram::take(10)->get();
        $lecturers = Lecturer::take(10)->get();
        $newsFeed = News::latest()->take(5)->get();

        $userContext = [
            'user_name' => $user->name,
            'user_email' => $user->email,
            'student_id' => $user->student_id,
            'course' => $user->course,
            'year' => $user->year,
            'semester_level' => $user->semester_level,
            'role' => $user->role,
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
            'faqs' => $faqs->map(fn($f) => [
                'question' => $f->question,
                'answer' => $f->answer,
            ])->toArray(),
            'programs' => $programs->map(fn($p) => [
                'title' => $p->title,
                'language' => $p->language,
                'degree' => $p->degree,
                'url' => $p->url,
            ])->toArray(),
            'lecturers' => $lecturers->map(fn($l) => [
                'name' => $l->name,
                'bio' => $l->bio,
                'programs' => $l->associated_programs,
                'email' => $l->email,
            ])->toArray(),
            'news' => $newsFeed->map(fn($n) => [
                'title' => $n->title,
                'published_date' => $n->published_date?->toDateString(),
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

    public function stream(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $user = $request->user();
        $message = $request->input('message');

        // Build user context
        $todaySchedule = $this->scheduleRepo->getForToday(
            $user->course,
            $user->year,
            $user->semester_level,
            $user->student_id
        );
        $rooms = $this->roomRepo->getAllWithAvailability();
        $events = $this->eventRepo->getUpcoming(3);

        $faqs = FaqEntry::latest()->take(10)->get();
 
        $programs = StudyProgram::take(10)->get();
        $lecturers = Lecturer::take(10)->get();
        $newsFeed = News::latest()->take(5)->get();

        $userContext = [
            'user_name' => $user->name,
            'user_email' => $user->email,
            'student_id' => $user->student_id,
            'course' => $user->course,
            'year' => $user->year,
            'semester_level' => $user->semester_level,
            'role' => $user->role,
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
            'faqs' => $faqs->map(fn($f) => [
                'question' => $f->question,
                'answer' => $f->answer,
            ])->toArray(),
            'programs' => $programs->map(fn($p) => [
                'title' => $p->title,
                'language' => $p->language,
                'degree' => $p->degree,
                'url' => $p->url,
            ])->toArray(),
            'lecturers' => $lecturers->map(fn($l) => [
                'name' => $l->name,
                'bio' => $l->bio,
                'programs' => $l->associated_programs,
                'email' => $l->email,
            ])->toArray(),
            'news' => $newsFeed->map(fn($n) => [
                'title' => $n->title,
                'published_date' => $n->published_date?->toDateString(),
            ])->toArray(),
        ];

        $aiServiceUrl = env('AI_SERVICE_URL', 'http://ai-service:8001');

        return new StreamedResponse(function () use ($aiServiceUrl, $message, $userContext, $user) {
            $client = new Client();
            
            try {
                $response = $client->post("{$aiServiceUrl}/chat/stream", [
                    'json' => [
                        'message' => $message,
                        'user_context' => $userContext,
                        'language' => $user->language_preference,
                    ],
                    'stream' => true,
                    'read_timeout' => 300,
                ]);

                $body = $response->getBody();
                $fullResponse = "";

                while (!$body->eof()) {
                    $chunk = $body->read(1024);
                    $fullResponse .= $chunk;
                    echo $chunk;
                    if (ob_get_level() > 0) ob_flush();
                    flush();
                }

                // Save to history after stream ends successfully
                $this->saveToHistory($user, $message, $fullResponse);

            } catch (\Exception $e) {
                \Log::error("Chat Stream Error: " . $e->getMessage());
                // Send error message to frontend via the stream
                echo " [Error: Could not reach AI service. Please try again.] ";
                if (ob_get_level() > 0) ob_flush();
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no', // Disable Nginx buffering
        ]);
    }

    private function saveToHistory($user, $message, $aiContent)
    {
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
            'content' => $aiContent,
            'timestamp' => now()->toISOString(),
        ];

        $messages = array_slice($messages, -50);
        $session->update(['messages' => $messages]);
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

    public function clearHistory(Request $request)
    {
        $user = $request->user();
        ChatSession::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Chat history cleared',
        ]);
    }
}
