<?php

use Illuminate\Database\Seeder;
use App\UserRole;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        UserRole::create(['name' => 'Client']);
        UserRole::create(['name' => 'Super Admin']);
    }
}
