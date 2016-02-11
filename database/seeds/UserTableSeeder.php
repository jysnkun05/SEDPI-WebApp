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
        	'username' => 'superuser',
        	'email' => 'admin@sedpi.com',
        	'password' => bcrypt('sedpi2004'),
            'user_role_id' => App\UserRole::where('name', 'Super Admin')->first()->id,
        	'is_active' => true
        ]);
    }
}
