<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Hapus kolom score_weight — tidak dipakai lagi sejak formula
            // beralih ke lookup tabel resmi BSSN (scoreMatrix di KamiService)
            $table->dropColumn('score_weight');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->tinyInteger('score_weight')->after('maturity_level');
        });
    }
};
