<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'subject',
        'lecturer',
        'room_id',
        'day_of_week',
        'start_time',
        'end_time',
        'group_name',
        'semester',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
