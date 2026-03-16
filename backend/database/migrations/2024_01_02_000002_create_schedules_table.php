<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->string('lecturer');
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->string('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('group_name')->nullable();
            $table->string('semester')->nullable();
            $table->timestamps();

            $table->index(['day_of_week', 'start_time', 'end_time']);
            $table->index('room_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
