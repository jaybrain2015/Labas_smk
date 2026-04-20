<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyProgram extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'language',
        'degree',
        'field',
        'study_modes',
        'languages_of_instruction',
        'locations',
        'cost_semester_eur',
        'cost_year_eur',
        'competencies',
        'knowledge_areas',
        'career_paths',
        'contact_email',
        'contact_phone',
        'url',
        'scraped_at',
    ];

    protected $casts = [
        'study_modes' => 'array',
        'languages_of_instruction' => 'array',
        'locations' => 'array',
        'competencies' => 'array',
        'knowledge_areas' => 'array',
        'career_paths' => 'array',
        'scraped_at' => 'datetime',
    ];
}
