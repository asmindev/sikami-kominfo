<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->enum('domain', [
                'governance',
                'risk_management',
                'framework',
                'asset_management',
                'technology',
            ]);
            // Nomor pertanyaan dari KAMI 5.0, misal: "2.1", "3.10", "6.35"
            $table->string('indicator', 10);
            // Level kematangan: 1 = fondasi, 2 = berkembang, 3 = terkelola
            $table->tinyInteger('maturity_level');
            $table->text('question_text');
            // Bobot skor per pertanyaan: level 1 = 3, level 2 = 6, level 3 = 9
            // Disimpan eksplisit agar perhitungan tidak bergantung pada hardcode
            $table->tinyInteger('score_weight');
            // Urutan tampil dalam kuesioner (global, antar domain)
            $table->integer('order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
