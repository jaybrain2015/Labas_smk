<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject',
        'group_name',
        'user_id',
        'message',
        'is_lecturer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
