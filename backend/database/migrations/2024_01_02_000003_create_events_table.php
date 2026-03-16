<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->enum('category', ['academic', 'social', 'deadline'])->default('academic');
            $table->timestamps();

            $table->index('starts_at');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
