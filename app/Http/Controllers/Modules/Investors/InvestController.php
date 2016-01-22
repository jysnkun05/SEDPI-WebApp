<?php

namespace App\Http\Controllers\Modules\Investors;

use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;
use App\Transaction;
use App\Http\Controllers\Controller;

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

    public function getInvestorInvestments(Request $request)
    {
        $transactions = Transaction::where('investor_id', Auth::user()->investor->id)
            ->orderBy('transaction_date', 'asc')
            ->get(['id', 'transaction_date', 'transaction_type', 'amount', 'notes', 'runningBalance']);
            
        return $transactions;
    }
}
