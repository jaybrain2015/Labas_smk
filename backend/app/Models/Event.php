<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'starts_at',
        'ends_at',
        'category',
        'image_path',
        'is_editorial',
        'editorial_category',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image_path) return null;
        
        // If it's already a full URL, return it
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }
        
        // Remove storage/ from the beginning if it exists to prevent double prefixing
        $path = $this->image_path;
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, 8);
        }
        
        return asset('storage/' . $path);
    }

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }
}
