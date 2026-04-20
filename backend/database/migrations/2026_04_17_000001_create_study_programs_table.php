<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('study_programs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('language', 5)->default('lt');
            $table->string('degree')->nullable();
            $table->string('field')->nullable();
            $table->json('study_modes')->nullable();
            $table->json('languages_of_instruction')->nullable();
            $table->json('locations')->nullable();
            $table->integer('cost_semester_eur')->nullable();
            $table->integer('cost_year_eur')->nullable();
            $table->json('competencies')->nullable();
            $table->json('knowledge_areas')->nullable();
            $table->json('career_paths')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('url')->nullable();
            $table->timestamp('scraped_at')->nullable();
            $table->timestamps();

            $table->index('language');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('study_programs');
    }
};
