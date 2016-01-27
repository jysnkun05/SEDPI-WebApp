<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UserTableSeeder::class);
        $this->call(ApplicantTypeTableSeeder::class);
        $this->call(ApplicationStatusTableSeeder::class); 
        $this->call(RoleTableSeeder::class);
        $this->call(UserTableSeeder::class);
        $this->call(ApplicantTableSeeder::class);   
        $this->call(TransactionTypeTableSeeder::class); 
    }
}
