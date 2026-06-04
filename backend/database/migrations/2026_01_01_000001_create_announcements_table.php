<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->string('sticker_name');
            $table->string('sticker_country');
            $table->string('sticker_position');
            $table->string('sticker_number');
            $table->string('sticker_rarity')->default('Comum');
            $table->string('photo_path')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('condition');
            $table->integer('quantity')->default(1);
            $table->text('description')->nullable();
            $table->string('status')->default('Ativo');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
