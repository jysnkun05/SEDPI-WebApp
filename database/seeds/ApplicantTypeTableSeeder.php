<?php

use Illuminate\Database\Seeder;
use App\ApplicantType;

class ApplicantTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ApplicantType::create(['name' => 'Non Member']);
        ApplicantType::create(['name' => 'Trainee']);
        ApplicantType::create(['name' => 'Investor']);
    }
}
