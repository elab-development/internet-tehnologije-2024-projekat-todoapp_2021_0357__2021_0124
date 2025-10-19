<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Note",
 *     type="object",
 *     title="Beleška",
 *     description="Model beleške u aplikaciji",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Moja beleška"),
 *     @OA\Property(property="content", type="string", example="Sadržaj beleške..."),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="tags", type="array", @OA\Items(ref="#/components/schemas/Tag"), nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

class Note extends Model
{
    use HasFactory;
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

    //veza sa tagovima
    
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
