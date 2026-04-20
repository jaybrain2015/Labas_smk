<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('language', 5)->default('lt');
            $table->date('published_date')->nullable();
            $table->text('body')->nullable();
            $table->json('dates')->nullable();
            $table->json('times')->nullable();
            $table->json('rooms')->nullable();
            $table->string('url')->nullable();
            $table->timestamp('scraped_at')->nullable();
            $table->timestamps();

            $table->index('language');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
