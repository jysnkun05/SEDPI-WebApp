<?php

use Illuminate\Database\Seeder;

class ApplicantTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Applicant::class, 'nonMember', 1)->create();
        factory(App\Applicant::class, 'trainee', 1)->create();
        factory(App\Applicant::class, 'investor', 1)->create();
        factory(App\Applicant::class, 'investorWithInvestment', 1)->create();
        factory(App\Applicant::class, 'investorWithBeneficiary', 1)->create();

    }
}
