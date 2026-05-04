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
