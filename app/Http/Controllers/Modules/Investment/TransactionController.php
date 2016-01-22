<?php

namespace App\Http\Controllers\Modules\Investment;

use Illuminate\Http\Request;
use App\Transaction;
use App\Investor;
use Carbon\Carbon;

use App\Http\Requests\Modules\Investment\SaveDepositPostRequest;
use App\Http\Requests\Modules\Investment\SaveWithdrawalPostRequest;
use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    public function index () 
    {
    	return view('modules.investment.transaction');
    }

    public function deposit (SaveDepositPostRequest $request)
    {
    	$transaction = Transaction::create([
    		'transaction_date' => Carbon::parse($request->input('depositDate'))->toDateString(),
    		'transaction_type' => 'DP',
    		'amount' => $request->input('depositAmount'),
    		'investor_id' => $request->input('id'),
    		'notes' => $request->input('notes') === '' ? null : $request->input('notes') 
    	]);

    	$transaction->runningBalance = $this->computeBalance($request->input('id'));
    	$transaction->save();

    	$investor = Investor::find($request->input('id'));
    	$investor->balance = $transaction->runningBalance;
    	$investor->save();

    	return response()->json([
    		'status' => 'success'
    	]);
    }

    public function withdraw (SaveWithdrawalPostRequest $request)
    {
    	$transaction = Transaction::create([
    		'transaction_date' => Carbon::parse($request->input('withdrawDate'))->toDateString(),
    		'transaction_type' => 'WD',
    		'amount' => $request->input('withdrawAmount'),
    		'investor_id' => $request->input('id'),
    		'notes' => $request->input('notes') === '' ? null : $request->input('notes') 
    	]);

    	$transaction->runningBalance = $this->computeBalance($request->input('id'));
    	$transaction->save();

    	$investor = Investor::find($request->input('id'));
    	$investor->balance = $transaction->runningBalance;
    	$investor->save();

    	return response()->json([
    		'status' => 'success'
    	]);
    }

    protected function computeBalance($id) 
    {
    	$balance = 0;

    	$transactions = Transaction::where('investor_id', $id)
            ->orderBy('transaction_date', 'asc')
            ->get(['id', 'transaction_date', 'transaction_type', 'amount']);

        foreach($transactions as $key => $value) {
        	if($value->transaction_type === 'DP' || $value->transaction_type === 'DV')
        		$balance += $value->amount;
        	else if($value->transaction_type === 'WD')
        		$balance -= $value->amount;
        }

        return $balance;


    }
}
