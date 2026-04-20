<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lecturers', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('language', 5)->default('lt');
            $table->string('photo_url')->nullable();
            $table->text('bio')->nullable();
            $table->json('associated_programs')->nullable();
            $table->string('email')->nullable();
            $table->string('url')->nullable();
            $table->timestamp('scraped_at')->nullable();
            $table->timestamps();

            $table->index('language');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lecturers');
    }
};
