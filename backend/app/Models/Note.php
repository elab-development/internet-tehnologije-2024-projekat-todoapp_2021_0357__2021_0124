<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    /**
     * polja koja se smeju menjati
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'content',
        'user_id',
    ];

    /**
     * povezivanje sa korisnikom
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
