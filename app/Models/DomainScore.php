<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DomainScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'kami_index_id',
        'domain_name',
        'domain_score',
        'ahp_weight',
        'final_score',
    ];

    public function kamiIndex(): BelongsTo
    {
        return $this->belongsTo(KamiIndex::class);
    }
}
