<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'student_id',
        'role',
        'language_preference',
        'course',
        'year',
        'semester_level',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function chatSessions()
    {
        return $this->hasMany(ChatSession::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'course', 'course')
            ->where('year', $this->year)
            ->where('semester_level', $this->semester_level);
    }
}
