<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AhpResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'criteria_id', 
        'weight', 
        'eigen_value', 
        'ci', 
        'cr', 
        'lambda_max', 
        'is_consistent'
    ];

    protected function casts(): array
    {
        return [
            'is_consistent' => 'boolean',
        ];
    }

    public function criteria(): BelongsTo
    {
        return $this->belongsTo(AhpCriteria::class, 'criteria_id');
    }
}
