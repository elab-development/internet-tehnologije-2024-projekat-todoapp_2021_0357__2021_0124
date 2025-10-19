<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Task",
 *     type="object",
 *     title="Zadatak",
 *     description="Model zadatka u aplikaciji",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Kupiti mleko"),
 *     @OA\Property(property="is_completed", type="boolean", example=false),
 *     @OA\Property(property="due_date", type="string", format="date", nullable=true, example="2024-12-31"),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

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
