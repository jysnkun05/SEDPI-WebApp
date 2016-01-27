<?php

use Illuminate\Database\Seeder;
use App\TransactionType;

class TransactionTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TransactionType::create([
        	'code' => 'DP',
        	'description' => 'Deposit',
        	'account_type' => 'CR'
        ]);

        TransactionType::create([
        	'code' => 'DV',
        	'description' => 'Dividend',
        	'account_type' => 'CR'
        ]);

        TransactionType::create([
        	'code' => 'WD',
        	'description' => 'Withdraw',
        	'account_type' => 'DR'
        ]);

        TransactionType::create([
        	'code' => 'MF',
        	'description' => 'Membership Fee',
        	'account_type' => 'DR'
        ]);

    }
}
