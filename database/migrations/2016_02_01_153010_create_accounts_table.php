<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('investor')->create('accounts', function (Blueprint $table) {
            $table->uuid('id');
            $table->string('name');
            $table->string('type');
            $table->decimal('balance', 15, 2)->default(0.00);
            $table->uuid('user_id')->default('');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('investor')->drop('accounts');
    }
}
