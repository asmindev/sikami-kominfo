#!/bin/bash
MIG_EMP=$(ls database/migrations/*_create_employees_table.php)
MIG_QUES=$(ls database/migrations/*_create_questions_table.php)
MIG_QUEST=$(ls database/migrations/*_create_questionnaires_table.php)
MIG_ANS=$(ls database/migrations/*_create_answers_table.php)
MIG_CRI=$(ls database/migrations/*_create_ahp_criterias_table.php)
MIG_PAIR=$(ls database/migrations/*_create_pairwise_comparisons_table.php)
MIG_AHP_RES=$(ls database/migrations/*_create_ahp_results_table.php)
MIG_KAMI=$(ls database/migrations/*_create_kami_indices_table.php)
MIG_DOM=$(ls database/migrations/*_create_domain_scores_table.php)

cat << 'MIG' > $MIG_EMP
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nip', 20)->unique();
            $table->string('position', 100);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('employees'); }
};
MIG

cat << 'MIG' > $MIG_QUES
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->enum('domain', ['governance','risk_management','framework','asset_management','technology']);
            $table->string('indicator', 255);
            $table->text('question_text');
            $table->integer('order');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('questions'); }
};
MIG

cat << 'MIG' > $MIG_QUEST
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('questionnaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('questionnaires'); }
};
MIG

cat << 'MIG' > $MIG_ANS
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('questionnaire_id')->constrained('questionnaires')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->tinyInteger('score');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('answers'); }
};
MIG

cat << 'MIG' > $MIG_CRI
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('ahp_criteria', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 50)->unique();
            $table->tinyInteger('order');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('ahp_criteria'); }
};
MIG

cat << 'MIG' > $MIG_PAIR
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('pairwise_comparisons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('criteria1_id')->constrained('ahp_criteria')->cascadeOnDelete();
            $table->foreignId('criteria2_id')->constrained('ahp_criteria')->cascadeOnDelete();
            $table->decimal('comparison_value', 10, 4);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('pairwise_comparisons'); }
};
MIG

cat << 'MIG' > $MIG_AHP_RES
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('ahp_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('criteria_id')->constrained('ahp_criteria')->cascadeOnDelete();
            $table->decimal('weight', 10, 6);
            $table->decimal('eigen_value', 10, 6);
            $table->decimal('ci', 10, 6);
            $table->decimal('cr', 10, 6);
            $table->decimal('lambda_max', 10, 6);
            $table->boolean('is_consistent')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('ahp_results'); }
};
MIG

cat << 'MIG' > $MIG_KAMI
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('kami_indexes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->decimal('total_score', 10, 4);
            $table->enum('category', ['not_eligible','basic_framework','good_enough','good']);
            $table->date('calculated_at');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('kami_indexes'); }
};
MIG

cat << 'MIG' > $MIG_DOM
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('domain_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kami_index_id')->constrained('kami_indexes')->cascadeOnDelete();
            $table->string('domain_name', 100);
            $table->decimal('domain_score', 10, 4);
            $table->decimal('ahp_weight', 10, 6);
            $table->decimal('final_score', 10, 4);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('domain_scores'); }
};
MIG

bash generate_migrations.sh
