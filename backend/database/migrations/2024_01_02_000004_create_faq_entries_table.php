<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faq_entries', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('answer');
            $table->string('category')->nullable();
            $table->string('language', 5)->default('en');
            $table->timestamps();

            $table->index('category');
            $table->index('language');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faq_entries');
    }
};
