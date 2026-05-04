<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KamiIndex extends Model
{
    use HasFactory;

    protected $table = 'kami_indexes';

    protected $fillable = [
        'user_id',
        'total_score',
        'category',
        'calculated_at'
    ];

    protected function casts(): array
    {
        return [
            'calculated_at' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function domainScores(): HasMany
    {
        return $this->hasMany(DomainScore::class);
    }
}
