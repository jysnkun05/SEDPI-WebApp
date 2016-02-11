<?php

namespace App\Http\Controllers\Modules\Investors;

use Illuminate\Http\Request;

use App\Http\Requests\Modules\Investors\SaveDepositPostRequest;
use Auth;
use App\Account;

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

    /**
     *
     *  Description: Get Account Details
     *  Component: MyInvestmentMain
     *
     */

    public function getAccountDetails()
    {
        $account = Auth::user()->account;
        $account->load('transactions');
        $account->transactions->load('transactionType');
        return $account;
    }
    

}
