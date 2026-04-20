<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'language',
        'photo_url',
        'bio',
        'associated_programs',
        'email',
        'url',
        'scraped_at',
    ];

    protected $casts = [
        'associated_programs' => 'array',
        'scraped_at' => 'datetime',
    ];
}
