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
        if (!Schema::hasTable('restaurant_settings')) {
            return;
        }

        if (!Schema::hasColumn('restaurant_settings', 'sections')) {
            Schema::table('restaurant_settings', function (Blueprint $table) {
                $table->json('sections')->nullable()->after('logo');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('restaurant_settings') && Schema::hasColumn('restaurant_settings', 'sections')) {
            Schema::table('restaurant_settings', function (Blueprint $table) {
                $table->dropColumn('sections');
            });
        }
    }
};
