<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RestaurantSetting extends Model
{
    use HasFactory;

    protected $table = 'restaurant_settings';

    protected $fillable = [
        'name',
        'logo',
        'sections',
        'background_type',
        'background_image',
        'background_video',
    ];

    protected $casts = [
        'sections' => 'array',
    ];
}
