<?php

namespace App\Http\Controllers\Modules\Admin\Settings;

use Illuminate\Http\Request;
use App\Email;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class EmailSettingsController extends Controller
{
    public function getEmailAccounts() 
    {
    	$emails = Email::all();
    	return $emails;
    }
}
