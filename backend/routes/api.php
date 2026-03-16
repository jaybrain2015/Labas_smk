<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\CourseChatController;
use App\Http\Controllers\Api\AdminController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Dummy route for redirect to avoid "Route [login] not defined"
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Chat
    Route::post('/chat', [ChatController::class, 'send']);
    Route::get('/chat/history', [ChatController::class, 'history']);

    // Course Chat
    Route::get('/course-chat', [CourseChatController::class, 'index']);
    Route::post('/course-chat', [CourseChatController::class, 'store']);


    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/me', [AuthController::class, 'update']);

    // Schedule
    Route::get('/schedule/my', [ScheduleController::class, 'my']);
    Route::get('/schedule/week', [ScheduleController::class, 'week']);

    // Rooms
    Route::get('/rooms/availability', [RoomController::class, 'availability']);
    Route::get('/rooms/{id}', [RoomController::class, 'show']);

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/upcoming', [EventController::class, 'upcoming']);

    // Admin (role check in controller)
    Route::middleware('admin')->group(function () {
        Route::post('/admin/schedule/import', [AdminController::class, 'importSchedule']);
        Route::get('/admin/stats', [AdminController::class, 'stats']);
    });
});
