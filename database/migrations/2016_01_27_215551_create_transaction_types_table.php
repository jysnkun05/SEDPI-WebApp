<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('investor')->create('transaction_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code', 2)->unique();
            $table->string('description');
            $table->string('account_type', 2);
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
        Schema::connection('investor')->drop('transaction_types');
    }
}
