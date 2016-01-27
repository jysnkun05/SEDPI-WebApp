<?php

namespace App\Http\Controllers\Modules\Investment;

use Illuminate\Http\Request;
use DB;
use App\Transaction;
use App\TransactionType;
use App\Investor;
use Carbon\Carbon;

use App\Http\Requests\Modules\Investment\SaveTransactionPostRequest;
use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    public function index () 
    {
    	return view('modules.investment.transaction');
    }

    public function getTransactionTypes() 
    {
        $types = TransactionType::all(['id', 'code', 'description']);
        return $types;
    }

    public function getTransactionDetails(Request $request) 
    {
        $details = Transaction::find($request->input('id'));
        return $details;
    }

    public function saveTransaction(SaveTransactionPostRequest $request)
    {
        DB::transaction(function () use ($request) {
            $transaction = Transaction::create([
                'transactionDate' => Carbon::parse($request->input('transactionDate'))->toDateString(),
                'amount' => $request->input('amount'),
                'transaction_type_id' => $request->input('transaction_type_id'),
                'investor_id' => $request->input('id'),
                'notes' => $request->input('notes') === '' ? null : $request->input('notes') 
            ]);

            $investor = Investor::find($request->input('id'));
            $investor->balance = $this->computeBalance($investor->id);
            $investor->save();

            return response()->json([
                'status' => 'success'
            ]);
        });
    }

    public function updateTransaction(SaveTransactionPostRequest $request)
    {
        DB::transaction(function () use ($request) {
            $transaction = Transaction::find($request->input('id'));

            $transaction->transactionDate = Carbon::parse($request->input('transactionDate'))->toDateString();
            $transaction->amount = $request->input('amount');
            $transaction->transaction_type_id = $request->input('transaction_type_id');
            $transaction->notes = $request->input('notes') === '' ? null : $request->input('notes');
            $transaction->save();

            $investor = Investor::find($transaction->investor_id);
            $investor->balance = $this->computeBalance($investor->id);
            $investor->save();

            return response()->json([
                'status' => 'success'
            ]);
        });
    }

    protected function computeBalance($id) 
    {
    	$balance = 0;

    	$transactions = Transaction::where('investor_id', $id)
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
