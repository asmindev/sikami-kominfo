<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AhpCriteria extends Model
{
    use HasFactory;

    protected $table = 'ahp_criteria';

    protected $fillable = ['name', 'code', 'order'];
}
