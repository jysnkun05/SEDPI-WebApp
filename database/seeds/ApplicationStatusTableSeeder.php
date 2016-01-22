<?php

use Illuminate\Database\Seeder;
use App\ApplicationStatus;

class ApplicationStatusTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ApplicationStatus::create(['name' => 'For Evaluation', 'isSelectable' => true]);
        ApplicationStatus::create(['name' => 'System Approved', 'isSelectable' => false]);
        ApplicationStatus::create(['name' => 'User Approved', 'isSelectable' => true]);
        ApplicationStatus::create(['name' => 'User Rejected', 'isSelectable' => true]);
        ApplicationStatus::create(['name' => 'Already Member', 'isSelectable' => false]);
    }
}
