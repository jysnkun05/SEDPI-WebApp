<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateApplicantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->uuid('id');

            $table->string('firstName');
            $table->string('middleName')->nullable();
            $table->string('lastName');
            $table->string('email');

            $table->string('sex')->nullable();
            $table->date('birthDate')->nullable();
            $table->string('birthPlace')->nullable();
            $table->string('civilStatus')->nullable();
            $table->string('otherCivilStatus')->nullable();
            $table->string('spouseName')->nullable();
            $table->string('nationality')->nullable();
            $table->string('occupation')->nullable();
            $table->string('tin')->nullable();
            $table->string('sssGsis')->nullable();
            $table->string('annualIncome')->nullable();

            $table->boolean('haveAttended')->nullable();
            $table->boolean('willAttend')->nullable();
            $table->string('trainingType')->nullable();
            $table->boolean('willInvest')->nullable();

            $table->string('presentAddress')->nullable();
            $table->string('presentCountry')->nullable();
            $table->string('permanentAddress')->nullable();
            $table->string('permanentCountry')->nullable();
            $table->string('mailingAddress')->nullable();
            $table->string('mobile')->nullable();

            $table->string('amountInvested')->nullable();
            $table->date('investmentDate')->nullable();
            $table->string('sourceOfFunds')->nullable();

            $table->string('b1Name')->nullable();
            $table->string('b1Address')->nullable();
            $table->date('b1BirthDate')->nullable();
            $table->string('b1Relationship')->nullable();
            
            $table->string('b2Name')->nullable();
            $table->string('b2Address')->nullable();
            $table->date('b2BirthDate')->nullable();
            $table->string('b2Relationship')->nullable();

            $table->integer('applicant_type_id');
            $table->integer('application_status_id');
            $table->text('remarks')->nullable();

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
        Schema::drop('applicants');
    }
}
