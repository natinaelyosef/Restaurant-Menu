<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'reservation_date',
        'reservation_time',
        'guests',
        'special_requests',
        'status',
        'reviewed_by',
        'review_note',
    ];

    protected $casts = [
        'reservation_date' => 'date',
        'reservation_time' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
