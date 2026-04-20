<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->string('name')->nullable();
            $table->integer('floor');
            $table->string('building')->default('Vilnius Campus');
            $table->integer('capacity')->default(30);
            $table->enum('type', ['lecture', 'lab', 'seminar'])->default('lecture');
            $table->json('equipment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
