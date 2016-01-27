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

        $user = User::create([
            'displayname' => 'Admin 1', 
            'username' => 'admin1',
            'email' => 'admin1@sedpi.com',
            'password' => bcrypt('zxcvb09876'),
            'user_role_id' => 2,
            'is_verified' => true,
            'is_active' => true
        ]);

        $user = User::create([
            'displayname' => 'Admin 2', 
            'username' => 'admin2',
            'email' => 'admin2@sedpi.com',
            'password' => bcrypt('zxcvb09876'),
            'user_role_id' => 2,
            'is_verified' => true,
            'is_active' => true
        ]);

        $user = User::create([
            'displayname' => 'Admin 3', 
            'username' => 'admin3',
            'email' => 'admin3@sedpi.com',
            'password' => bcrypt('zxcvb09876'),
            'user_role_id' => 2,
            'is_verified' => true,
            'is_active' => true
        ]);

        $user = User::create([
            'displayname' => 'Admin 4', 
            'username' => 'admin4',
            'email' => 'admin4@sedpi.com',
            'password' => bcrypt('zxcvb09876'),
            'user_role_id' => 2,
            'is_verified' => true,
            'is_active' => true
        ]);

        $user = User::create([
            'displayname' => 'Admin 5', 
            'username' => 'admin5',
            'email' => 'admin5@sedpi.com',
            'password' => bcrypt('zxcvb09876'),
            'user_role_id' => 2,
            'is_verified' => true,
            'is_active' => true
        ]);
    }
}
