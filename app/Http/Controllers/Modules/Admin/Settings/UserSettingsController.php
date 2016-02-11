<?php

namespace App\Http\Controllers\Modules\Admin\Settings;

use Illuminate\Http\Request;

use App\UserRole; 

use App\Http\Requests;
use App\Http\Controllers\Controller;

class UserSettingsController extends Controller
{
    public function index() 
    {
    	return view('modules.settings.admin-settings');
    }

    public function getAllUserRoles() 
    {
    	$userRoles = UserRole::all();
    	return $userRoles;
    }
}
