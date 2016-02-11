<?php

namespace App\Http\Controllers\Modules\Admin\Investor;

use Illuminate\Http\Request;
use App\Account;
use App\TransactionType;
use App\Transaction;
use Carbon\Carbon;

use App\Http\Requests\Modules\Admin\Investor\SaveTransactionPostRequest;
use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    /**
     *	Description: Get Transaction Types
     * 	Component: AddTransactionFormModal
     *	
     */
    
    public function getTransactionTypes () {
    	$transactionTypes = TransactionType::all();
    	return $transactionTypes;
    }

    /**
     *
     *  Description: Get Transaction Details 
     *  Component: EditTransactionFormModal
     *
     */

    public function getTransactionDetails (Request $request) 
    {
        $transaction = Transaction::find($request->input('id'));
        $transaction->load('transactionType');
        return $transaction;
    }
    

    /**
     *
     * 	Description: Save Transaction
     *	Component: AddTransactionFormModal
     *
     */

    public function saveTransaction(SaveTransactionPostRequest $request)
    {
    	$account = Account::find($request->input('id'));
   		$transactionType = TransactionType::where('code', $request->input('transactionType'))->first();
   		if($transactionType->account_type === 'DR')
   		{
   			$this->validate($request, [
   				'amount' => 'max:'.$account->balance
   			]);
   		}

   		$transaction = Transaction::create([
            'transactionDate' => Carbon::parse($request->input('transactionDate'))->toDateString(),
            'amount' => $request->input('amount'),
            'transaction_type_id' => $transactionType->id,
            'account_id' => $request->input('id'),
            'notes' => $request->input('notes') === '' ? null : $request->input('notes') 
        ]);

        $account->balance = $this->recomputeRunningBalance($account->id);
        $account->save();

    	return response()->json([
    		'message' => 'New Transaction Posted.'
    	]);
    }

    /**
     *
     *  Description: Update Selected Transaction
     *  Component: EditTransactionFormModal
     *
     */

    public function updateTransaction(SaveTransactionPostRequest $request)
    {
        $transaction = Transaction::find($request->input('id'));
        $transactionType = TransactionType::where('code', $request->input('transactionType'))->first();
        if($transactionType->account_type === 'DR')
        {
            $this->validate($request, [
                'amount' => 'max:'.$account->balance
            ]);
        }
        $transaction->transactionDate = Carbon::parse($request->input('transactionDate'))->toDateString();
        $transaction->amount = $request->input('amount');
        $transaction->transaction_type_id = $transactionType->id;
        $transaction->notes = $request->input('notes') === '' ? null : $request->input('notes');
        $transaction->touch();
        $transaction->save();

        $transaction->account->balance = $this->recomputeRunningBalance($transaction->account_id);
        $transaction->account->save();

        return response()->json([
            'message' => 'Transaction Updated.'
        ]);
    }
    

    /**
     *
     *  Description: Recompute and Update Running Balances 
     *
     */
    
    protected function recomputeRunningBalance($id) 
    {
    	$balance = 0;

    	$transactions = Transaction::where('account_id', $id)
            ->orderBy('transactionDate', 'asc')
            ->get();

        foreach($transactions as $key => $value) {
        	if($value->transactionType->account_type === 'DR')
        		$balance -= $value->amount;
            else
                $balance += $value->amount;

            $value->runningBalance = $balance;
            $value->save();
        }

        return $balance;
    }
    
}
