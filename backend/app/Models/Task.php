<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;
    /**
     * polja koja se smeju menjati
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'is_completed',
        'due_date',
        'user_id',
    ];

    /**
     * atributi koji se trebaju konvrtovati
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'due_date' => 'datetime',
        ];
    }

    //povezivanje sa korisnikom
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
