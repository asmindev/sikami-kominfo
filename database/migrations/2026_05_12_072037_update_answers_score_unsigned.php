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
        Schema::table('answers', function (Blueprint $table) {
            // Ubah score menjadi unsigned — hanya menerima nilai 0-255
            // Range 0-3 dijaga di application layer via validasi in:0,1,2,3
            $table->tinyInteger('score')->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->tinyInteger('score')->change();
        });
    }
};
