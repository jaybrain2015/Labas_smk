<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Event;
use Illuminate\Support\Facades\Schema;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

$data = [
    'title' => 'International Scientific Symposium: Navigating Volatility with Meaning',
    'description' => 'On November 12, 2026, Vilnius will host the international scientific conference-symposium "Navigating Volatility with Meaning: Societal Wellbeing, Education, and Work," bringing together academics, practitioners, policymakers, and business leaders from Lithuania and abroad.',
    'location' => 'Vilnius',
    'category' => 'Academic news',
    'starts_at' => '2026-11-12 09:00:00',
    'ends_at' => '2026-11-12 17:00:00',
    'image_path' => 'events/symposium.png',
    'is_editorial' => true,
    'editorial_category' => 'Academic'
];

try {
    Event::truncate();
    $event = Event::create($data);
    echo "SUCCESS: Event created with ID: " . $event->id . "\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
