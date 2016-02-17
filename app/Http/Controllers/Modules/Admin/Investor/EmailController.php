<?php

namespace App\Http\Controllers\Modules\Admin\Investor;

use Illuminate\Http\Request;

use Mail;

use App\Investor;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Ramsey\Uuid\Uuid;

class EmailController extends Controller
{
    public function sendEmailVerification(Request $request)
    {
        $investor = Investor::find($request->input('id'));

        if($investor->is_email_verified)
        {
            return response()->json([
                'status' => 'validated'
            ]);
        }

        if($investor->verification_code === null)
        {
            $is_code_saved = false;
            while ($is_code_saved === false) {
                $verification_code = (string)Uuid::uuid4();;
                if(Investor::where('verification_code', $verification_code)->count() === 0)
                {
                    $investor->verification_code = $verification_code;
                    $investor->save();
                    $is_code_saved = true;
                }
            }
        }

        Mail::send('email.verify', ['investor' => $investor] ,function($message) use ($investor) {
            $message->from('sedpisocialinvestments@gmail.com', 'SEDPI Team');
            $message->to($investor->email, $investor->middleName === null ? 
                sprintf("%s %s", $investor->firstName, $investor->lastName) : sprintf("%s %s %s", $investor->firstName, $investor->middleName ,$investor->lastName))
                ->subject('[SEDPI] Verify your email address'); 
        });

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function verifyInvestor($verification_code)
    {
        if(Investor::where('verification_code', $verification_code)->count() > 0)
            return view('modules.application.verify');
    }
}
