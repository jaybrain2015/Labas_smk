<?php
use App\Models\Room;

Room::updateOrCreate(
    ['number' => 'LIB'],
    [
        'name' => 'SMK Library',
        'floor' => 2,
        'building' => 'Building B',
        'capacity' => 100,
        'type' => 'library',
    ]
);
echo "Library room added.\n";
