<?php

namespace App\Http\Controllers\Modules\Investors;

use Illuminate\Http\Request;

use App\Http\Requests\Modules\Investors\SaveDepositPostRequest;
use Auth;
use App\Deposit;
use App\Transaction;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class InvestController extends Controller
{
    public function index()
    {
    	return view('modules.investors.investments');
    }

    public function showDeposit()
    {
    	return view('modules.investors.deposit');
    }

    public function saveAdviceDeposit(SaveDepositPostRequest $request) 
    {
        
        $deposit = Deposit::create([
            'dateDeposit' => Carbon::parse($request->input('dateDeposit'))->toDateString(),
            'amount' => $request->input('amount')
        ]);

        $deposit->investor_id = Auth::user()->investor->id;
        $deposit->status = 'adviced';
        $deposit->save();
        return response()->json([
            'status' => 'success'
        ]);
    }

    public function getDepositDetails()
    {
        return response()->json
    }

    public function getInvestorInvestments(Request $request)
    {
        $transactions = Transaction::where('investor_id', Auth::user()->investor->id)
            ->orderBy('transaction_date', 'asc')
            ->get(['id', 'transaction_date', 'transaction_type', 'amount', 'notes', 'runningBalance']);
            
        return $transactions;
    }
}
