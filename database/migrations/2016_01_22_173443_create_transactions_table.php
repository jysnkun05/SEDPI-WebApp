<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('investor')->create('transactions', function (Blueprint $table) {
            $table->increments('id');
            $table->date('transactionDate');
            $table->integer('transaction_type_id');
            $table->decimal('amount', 12, 2);
            $table->decimal('runningBalance', 12, 2);
            $table->text('notes')->nullable();
            $table->integer('investor_id');
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
        Schema::connection('investor')->drop('transactions');
    }
}
