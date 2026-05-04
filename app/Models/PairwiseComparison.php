<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PairwiseComparison extends Model
{
    use HasFactory;

    protected $fillable = ['criteria1_id', 'criteria2_id', 'comparison_value'];

    public function criteria1(): BelongsTo
    {
        return $this->belongsTo(AhpCriteria::class, 'criteria1_id');
    }

    public function criteria2(): BelongsTo
    {
        return $this->belongsTo(AhpCriteria::class, 'criteria2_id');
    }
}
