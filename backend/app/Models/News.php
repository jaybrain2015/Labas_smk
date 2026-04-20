<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $table = 'news';

    protected $fillable = [
        'slug',
        'title',
        'language',
        'published_date',
        'body',
        'dates',
        'times',
        'rooms',
        'url',
        'scraped_at',
    ];

    protected $casts = [
        'published_date' => 'date',
        'dates' => 'array',
        'times' => 'array',
        'rooms' => 'array',
        'scraped_at' => 'datetime',
    ];
}
