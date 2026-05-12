<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('questionnaire_id')
                ->constrained('questionnaires')
                ->cascadeOnDelete();
            $table->foreignId('question_id')
                ->constrained('questions')
                ->cascadeOnDelete();
            /**
             * Nilai jawaban KAMI mengikuti skala kategoris:
             *   0 = Tidak Dilakukan
             *   1 = Dalam Perencanaan
             *   2 = Diterapkan Sebagian
             *   3 = Diterapkan Menyeluruh
             *
             * Skor akhir dihitung di KamiService:
             *   actual_score = score × score_weight (dari tabel questions)
             * Contoh: jawaban 3 pada pertanyaan Level 2 → 3 × 6 = 18
             */
            $table->tinyInteger('score'); // nilai 0–3
            $table->timestamps();

            // Satu jawaban per pertanyaan per kuesioner
            $table->unique(['questionnaire_id', 'question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
