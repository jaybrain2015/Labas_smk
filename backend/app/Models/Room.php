<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'number',
        'name',
        'floor',
        'building',
        'capacity',
        'type',
        'equipment',
    ];

    protected function casts(): array
    {
        return [
            'equipment' => 'array',
        ];
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
