<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

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
        $isEditorial = $request->has('is_editorial') ? $request->boolean('is_editorial') : null;
        $lang = $request->query('lang', 'lt');

        $events = $this->eventRepo->getAll($category, $isEditorial);
        $user = $request->user();
        $lang = $lang ?: ($user ? $user->language_preference : 'lt');

        if ($lang !== 'lt' && count($events) > 0) {
            $events = $this->translateEvents($events, $lang);
        }

        return response()->json([
            'success' => true,
            'data' => $events,
            'message' => 'All events',
        ]);
    }

    protected function translateEvents($events, $targetLang)
    {
        $aiUrl = env('AI_SERVICE_URL', 'http://ai-service:8001') . '/translate';
        
        $translatedEvents = collect();
        $itemsToTranslate = [];

        foreach ($events as $event) {
            $cacheKey = "event_translation_{$event->id}_{$targetLang}";
            if (Cache::has($cacheKey)) {
                $translation = Cache::get($cacheKey);
                $event->title = $translation['title'] ?? $event->title;
                $event->description = $translation['description'] ?? $event->description;
                $event->editorial_category = $translation['editorial_category'] ?? $event->editorial_category;
                $event->location = $translation['location'] ?? $event->location;
                $translatedEvents->push($event);
            } else {
                $itemsToTranslate[] = [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'editorial_category' => $event->editorial_category,
                    'location' => $event->location,
                ];
            }
        }

        if (empty($itemsToTranslate)) {
            return $events;
        }

        try {
            $response = Http::timeout(10)->post($aiUrl, [
                'items' => $itemsToTranslate,
                'target_language' => $targetLang
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $translatedItems = $data['translated']['translated_items'] ?? [];
                
                // Map back to events and cache
                $translatedMap = [];
                foreach ($translatedItems as $ti) {
                    if (isset($ti['id'])) {
                        $translatedMap[$ti['id']] = $ti;
                        // Cache for 24 hours
                        Cache::put("event_translation_{$ti['id']}_{$targetLang}", $ti, now()->addHours(24));
                    }
                }

                foreach ($events as $event) {
                    if (isset($translatedMap[$event->id])) {
                        $ti = $translatedMap[$event->id];
                        $event->title = $ti['title'] ?? $event->title;
                        $event->description = $ti['description'] ?? $event->description;
                        $event->editorial_category = $ti['editorial_category'] ?? $event->editorial_category;
                        $event->location = $ti['location'] ?? $event->location;
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("Translation failed: " . $e->getMessage());
        }

        return $events;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'category' => 'required|in:academic,social,deadline',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_editorial' => 'boolean',
            'editorial_category' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('events', 'public');
        }

        $event = $this->eventRepo->create($validated);

        return response()->json([
            'success' => true,
            'data' => $event,
            'message' => 'Event created successfully',
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'starts_at' => 'date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'category' => 'in:academic,social,deadline',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_editorial' => 'boolean',
            'editorial_category' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('events', 'public');
        }

        $event = $this->eventRepo->update($id, $validated);

        // Clear translations cache
        foreach (['en', 'ru'] as $lang) {
            Cache::forget("event_translation_{$id}_{$lang}");
        }

        return response()->json([
            'success' => true,
            'data' => $event,
            'message' => 'Event updated successfully',
        ]);
    }

    public function destroy(int $id)
    {
        $this->eventRepo->delete($id);

        // Clear translations cache
        foreach (['en', 'ru'] as $lang) {
            Cache::forget("event_translation_{$id}_{$lang}");
        }

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully',
        ]);
    }

    public function show(Request $request, int $id)
    {
        $event = $this->eventRepo->find($id);
        $lang = $request->query('lang');
        $user = $request->user();
        $lang = $lang ?: ($user ? $user->language_preference : 'lt');

        if ($lang !== 'lt') {
            $events = $this->translateEvents(collect([$event]), $lang);
            $event = $events->first();
        }

        return response()->json([
            'success' => true,
            'data' => $event,
            'message' => 'Event details',
        ]);
    }

    public function upcoming(Request $request)
    {
        $events = $this->eventRepo->getUpcoming(5);
        $lang = $request->query('lang');
        $user = $request->user();
        $lang = $lang ?: ($user ? $user->language_preference : 'lt');

        if ($lang !== 'lt' && count($events) > 0) {
            $events = $this->translateEvents($events, $lang);
        }

        return response()->json([
            'success' => true,
            'data' => $events,
            'message' => 'Upcoming events',
        ]);
    }
}
