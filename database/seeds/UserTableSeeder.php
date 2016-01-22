<?php

use Illuminate\Database\Seeder;
use App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'displayname' => 'Super Admin', 
        	'username' => 'superuser',
        	'email' => 'admin@sedpi.com',
        	'password' => bcrypt('sedpi2004'),
            'user_role_id' => 2,
            'is_verified' => true,
        	'is_active' => true
        ]);
    }
}
