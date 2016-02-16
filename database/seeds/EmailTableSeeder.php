<?php

use Illuminate\Database\Seeder;
use App\Email;

class EmailTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
     	Email::create([
     		'description' => 'For Email Verification',
     		'driver' => 'smtp',
     		'port' => '465',
            'name' => 'SEDPI Team',
     		'username' => 'no-reply@sedpi.com',
     		'password' => 'sedpi2004',
     		'encryption_type' => 'tls'
     	]);   
    }
}
