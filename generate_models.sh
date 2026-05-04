#!/bin/bash
cat << 'MOD' > app/Models/Employee.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'nip', 'position'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
MOD

cat << 'MOD' > app/Models/Question.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['domain', 'indicator', 'question_text', 'order'];
}
MOD

cat << 'MOD' > app/Models/Questionnaire.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Questionnaire extends Model
{
    use HasFactory;

    protected $fillable = ['employee_id', 'submitted_at'];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }
}
MOD

cat << 'MOD' > app/Models/Answer.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = ['questionnaire_id', 'question_id', 'score'];

    public function questionnaire(): BelongsTo
    {
        return $this->belongsTo(Questionnaire::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
MOD

cat << 'MOD' > app/Models/AhpCriteria.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AhpCriteria extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'order'];
}
MOD

cat << 'MOD' > app/Models/PairwiseComparison.php
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
MOD

cat << 'MOD' > app/Models/AhpResult.php
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
MOD

cat << 'MOD' > app/Models/KamiIndex.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KamiIndex extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 
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

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function domainScores(): HasMany
    {
        return $this->hasMany(DomainScore::class);
    }
}
MOD

cat << 'MOD' > app/Models/DomainScore.php
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
        'final_score'
    ];

    public function kamiIndex(): BelongsTo
    {
        return $this->belongsTo(KamiIndex::class);
    }
}
MOD

bash generate_models.sh
