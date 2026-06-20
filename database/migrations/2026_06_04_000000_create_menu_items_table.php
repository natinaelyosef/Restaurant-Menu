<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('desc');
            $table->decimal('price', 8, 2);
            $table->string('category');
            $table->string('badge')->nullable();
            $table->string('badgeText')->nullable();
            $table->json('tags')->nullable();
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->string('image');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
