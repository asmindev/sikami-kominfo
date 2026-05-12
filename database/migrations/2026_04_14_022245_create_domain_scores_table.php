<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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

    public function down(): void
    {
        Schema::dropIfExists('domain_scores');
    }
};
