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
        UserRole::create([
            'name' => 'Investor',
            'is_active' => true,
            'is_default' => true
        ]);
        UserRole::create([
            'name' => 'Super Admin',
            'is_active' => true,
            'is_default' => true
        ]);
    }
}
