<?php

namespace App\Http\Controllers\Modules\Admin\Investor;

use DB;
use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Account;
use App\User;
use App\UserRole;
use App\Investor;
use Ramsey\Uuid\Uuid;

use App\Http\Requests\Modules\Admin\Investor\ValidateAddInvestorPostRequest;
use App\Http\Requests\Modules\Admin\Investor\ValidateAddCoInvestorPostRequest;
use App\Http\Requests\Modules\Admin\Investor\ValidateUpdateAccountPostRequest;

use App\Http\Controllers\Controller;

class InvestController extends Controller
{
    public function index()
    {
    	return view('modules.investment.invest');
    }


    /**
     *
     *	Description: Get All Accounts 
     *	Component: InvestMain
     *
     */

    public function getAllAccounts()
    {
    	$accounts = Account::all();
    	return $accounts;
    }

    /**
     *
     *  Description: Get Account Details
     *  Component: InvestMain
     *
     */
    
    public function getAccountDetails(Request $request)
    {
        $account = Account::find($request->input('id'));
        $account->load('user');
        $account->load('investors');
        $account->load('transactions');
        $account->transactions->load('transactionType');
        return $account;
    } 
	    
    /**
     *
     * 	Description: Check Co Investor Field 
     * 	Component: CreateInvestorAccount
     *	
     */
    
    public function addCoInvestor(ValidateAddCoInvestorPostRequest $request)
    {
    	return response()->json([
    		'status' => 'validated'
    	]);
    }

    /**
     *	
     *	Description: Check and Save Account and Investors
     * 	Component: CreateInvestorAccount
     *
     */

    public function addAccount(ValidateAddInvestorPostRequest $request)
    {
		try{
            //Create user
            $isUsernameExist = true;
            $username = '';
            while($isUsernameExist) {
                $username = 'user_'.(string)Uuid::uuid4();
                if(!(User::where('userName', $username)->first()))
                    $isUsernameExist = false;
            }

            $user = User::create([
                'username' =>  $username
            ]);
            $user->user_role_id = UserRole::where('name', 'Investor')->first()->id;
            $user->save();
        } 
        catch (\Exception $e) {
            $user->delete();
            throw $e;
        }

        try {
			// Create Account 
    		$account = Account::create([
    			'name' => $request->input('accountName'),
    			'type' => $request->input('accountType')
    		]);

            $account->user_id = $user->id;
            $account->save();
		} 
        catch (\Exception $e) {
            $user->delete();
            $account->delete();
            throw $e;
		}

		try {
			// Add Investor
    		$investor = Investor::create([
    			'firstName' => $request->input('firstName'),
    			'middleName' => $request->input('middleName') === '' ? null : $request->input('middleName'),
    			'lastName' => $request->input('lastName'),
    			'email' => $request->input('email') === '' ? null : $request->input('email')
    		]);

    		$investor->isOwner = true;
    		$investor->account_id = $account->id;
    		$investor->save();
		} 
        catch (\Exception $e) {
            $user->delete();
			$account->delete();
			throw $e;
		}

		try {
			// Add Co Investors if Account Type = 'joint'
    		if($request->input('accountType') === 'joint')
    		{
    			foreach($request->input('coInvestors') as $index => $value) {
    				$coInvestor = Investor::create([
    					'firstName' => $value['coFirstName'],
    					'middleName' => $value['coMiddleName'] === '' ? null : $value['coMiddleName'],
    					'lastName' => $value['coLastName']
     				]);

     				$coInvestor->account_id = $account->id;
     				$coInvestor->save();
    			}
    		}
		} 
        catch (\Exception $e) {
			$investor = Investor::where('account_id', $account->id)->delete();
			$user->delete();
            $account->delete();
			throw $e;
		}

    	return response()->json([
    		'status' => 'success',
    		'message' => 'New Account Created.'
    	]);

    }

    /**
     *
     *  Description: Update Account Name
     *  Component: AccountNameComponent 
     *
     */
    
    public function updateAccountName(ValidateUpdateAccountPostRequest $request) 
    {
        $account = Account::find($request->input('id'));
        $account->name = $request->input('accountName');
        $account->save();
        return response()->json([
            'status' => 'success'
        ]);
    }

    /**
     *
     *  Description: Update Account Type
     *  Component: AccountTypeComponent
     *
     */

    public function updateAccountType(ValidateUpdateAccountPostRequest $request)
    {
        $account = Account::find($request->input('id'));
        $account->type = $request->input('accountType');
        $account->save();
        return response()->json([
            'status' => 'success'
        ]);
    }

    /**
     *
     *  Description: Update Username
     *  Component: AccountUsername
     *
     */

    public function updateUsername(ValidateUpdateAccountPostRequest $request)
    {
        $account = Account::find($request->input('id'));
        $account->user->username = $request->input('username');
        $account->user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    /**
     *
     *  Description: Update Password
     *  Component: PasswordComponent
     *
     */

    public function updatePassword(ValidateUpdateAccountPostRequest $request)
    {
        $account = Account::find($request->input('id'));
        $account->user->password = bcrypt($request->input('password'));
        $account->user->password_changed_at = Carbon::now();
        $account->user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    /**
     *
     *  Description: Update UserActive
     *  Component: UserActiveComponent
     *
     */

    public function updateUserActive(Request $request)
    {
        $account = Account::find($request->input('id'));
        $account->user->is_active = !($account->user->is_active);
        $account->user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    
    
    
}
