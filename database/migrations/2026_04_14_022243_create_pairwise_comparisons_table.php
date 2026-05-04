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
