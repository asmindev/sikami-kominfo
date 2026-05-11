<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kami_indexes', function (Blueprint $table) {
            $table->id();
            // refer to user (leader) rather than separate employees table
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('total_score', 10, 4);
            $table->enum('category', ['not_eligible', 'basic_framework', 'good_enough', 'good']);
            $table->date('calculated_at');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('kami_indexes');
    }
};
