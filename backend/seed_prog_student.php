<?php
use App\Models\User;
use App\Models\Schedule;
use App\Models\Room;
use Illuminate\Support\Facades\Hash;

$user = User::updateOrCreate(
    ['email' => 'prog@student.smk.lt'],
    [
        'name' => 'Student Programmer',
        'password' => 'password',
        'student_id' => 'SMK-2024-PROG',
        'role' => 'student',
        'language_preference' => 'en',
        'course' => 'Programming and Multimedia Studies',
        'year' => 1,
        'semester_level' => 1,
    ]
);

$room = Room::first();

Schedule::updateOrCreate(
    [
        'course' => 'Programming and Multimedia Studies',
        'year' => 1,
        'semester_level' => 1,
        'day_of_week' => 'Saturday',
        'start_time' => '09:00',
    ],
    [
        'subject' => 'Advanced Java Programming',
        'lecturer' => 'Dr. Code',
        'room_id' => $room->id,
        'end_time' => '10:30',
        'group_name' => 'SMK-2024-PROG',
        'semester' => 'Spring 2026',
    ]
);

Schedule::updateOrCreate(
    [
        'course' => 'Programming and Multimedia Studies',
        'year' => 1,
        'semester_level' => 1,
        'day_of_week' => 'Saturday',
        'start_time' => '10:45',
    ],
    [
        'subject' => 'Multimedia Systems',
        'lecturer' => 'Prof. Media',
        'room_id' => $room->id,
        'end_time' => '12:15',
        'group_name' => 'SMK-2024-PROG',
        'semester' => 'Spring 2026',
    ]
);

echo "User and schedule created successfully.\n";
