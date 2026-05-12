<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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

    public function down(): void
    {
        Schema::dropIfExists('ahp_results');
    }
};
