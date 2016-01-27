<?php

namespace App\Http\Controllers\Modules\Investment;

use Illuminate\Http\Request;
use App\User;
use App\Investor;
use App\Transaction;
use Mail;
use Auth;

use App\Http\Requests\Modules\Investment\SaveInvestorPostRequest;
use App\Http\Requests\Modules\Investment\UpdateEmailAddressPostRequest;
use App\Http\Requests\Modules\Investment\UpdateUsernamePostRequest;
use App\Http\Requests\Modules\Investment\UpdatePasswordPostRequest;
use App\Http\Requests\Modules\Application\ValidateUserCredentialsPostRequest;
use App\Http\Controllers\Controller;

class InvestController extends Controller
{
    public function index()
    {
    	return view('modules.investment.invest');
    }

    public function getInvestors()
    {
    	$investors = Investor::all(['id', 'firstName', 'middleName', 'lastName', 'country', 'balance']);
    	return $investors;
    }

    public function getInvestorProfile(Request $request)
    {
        $investor = Investor::where('id', $request->input('id'))->first(['id', 'firstName', 'middleName', 'lastName', 'country', 'balance', 'member_since', 'user_id']);
        $user= User::where('id', $investor->user_id)->first(['id','username', 'password', 'email', 'verification_code', 'is_verified', 'is_active']);
        $user->has_password = $user->password != null;
        $user->verification_code = $user->verification_code === null;

    	return response()->json([
            'investor' => $investor,
            'user' => $user
        ]);
    }

    public function getInvestorInvestments(Request $request)
    {
        $transactions = Transaction::where('investor_id', $request->id)
            ->orderBy('transactionDate', 'asc')
            ->get(['id', 'transactionDate', 'transaction_type_id', 'amount', 'notes', 'runningBalance']);

        foreach($transactions as $key => $value)
        {
            $value->transaction_type_id = $value->transactionType->code;
        }
        return $transactions;
    }

    public function saveInvestor(SaveInvestorPostRequest $request)
    {
    	$investor = Investor::create([
    		'firstName' => $request->input('firstName'),
    		'middleName' => $request->input('middleName') === '' ? null : $request->input('middleName'),
    		'lastName' => $request->input('lastName'),
            'country' => $request->input('country') === '' ? null : $request->input('country')
    	]);
  
    	$user = User::create([
            'email' => $request->input('email')
    	]);

    	$investor->user_id = $user->id;
    	$investor->save();

    	return response()->json(['status' =>'success']);
    }

    public function verifyInvestor($verification_code)
    {
        if(User::where('verification_code', $verification_code)->count() > 0)
            return view('modules.application.verify');
    }

    public function sendEmailVerification(Request $request)
    {
        $investor = Investor::find($request->input('id'));
        $user = User::find($investor->user_id);
        
        if($user->is_verified)
        {
            return response()->json([
                'status' => 'validated'
            ]);
        }

        if($user->verification_code === null)
        {
            $is_code_saved = false;
            while ($is_code_saved === false) {
                $verification_code = str_random(60);
                if(User::where('verification_code', $verification_code)->count() === 0)
                {
                    $user->verification_code = $verification_code;
                    $user->save();
                    $is_code_saved = true;
                }
            }
        } 

        Mail::send('email.verify', ['investor' => $investor, 'user' => $user] ,function($message) use ($investor, $user) {
            // $message->from('no-reply@sedpi.com', 'SEDPI');
            $message->from('jynsdlsrys05@gmail.com', 'Jayson De los Reyes');
            $message->to($user->email, $investor->middleName === null ? 
                sprintf("%s %s", $investor->firstName, $investor->lastName) : sprintf("%s %s %s", $investor->firstName, $investor->middleName ,$investor->lastName))
                ->subject('[SEDPI] Verify your email address'); 
        });

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function setUserCredentials(ValidateUserCredentialsPostRequest $request) 
    {   
        $user = User::where('verification_code', $request->input('verification_code'))->first();
        $user->username = $request->input('username');
        $user->password = bcrypt($request->input('password'));
        $user->verification_code = null;
        $user->is_verified = true;
        $user->is_active = true;
        $user->touch();
        $user->save();

        return response()->json([
            'status' => 'success',
            'url' => route('memberLogin') 
        ]);
    }

    public function updateEmailAddress(UpdateEmailAddressPostRequest $request)
    {
        $user = User::find($request->input('id'));
        
        if($user->email === $request->input('email'))
        {
            return response()->json([
                'status' => 'unchanged'
            ]);
        }

        $user->email = $request->input('email');
        $user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function updateUsername(UpdateUsernamePostRequest $request)
    {
        $user = User::find($request->input('id'));
        
        if($user->username === $request->input('username'))
        {
            return response()->json([
                'status' => 'unchanged'
            ]);
        }

        $user->username = $request->input('username');
        $user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function updatePassword(UpdatePasswordPostRequest $request)
    {
        $user = User::find($request->input('id'));

        $user->password = bcrypt($request->input('password'));
        $user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }
}
