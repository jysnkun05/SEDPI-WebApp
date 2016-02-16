<?php

namespace App\Http\Controllers\Modules\Admin\Settings;

use Illuminate\Http\Request;

use App\UserRole; 
use App\User;

use App\Http\Requests\Modules\Admin\Settings\SaveAdminUserPostRequest;
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

    public function getAllAdminUsers()
    {
    	$users = User::where('user_role_id', UserRole::where('name', '<>' ,'Investor')->first()->id)->get();
    	foreach($users as $key => $value) {
    		$value->load('userRole');
    	}
    	return $users;
    }

    public function getAdminRoleOptions()
    {
    	$roles = UserRole::where('name', '<>', 'Investor')->get();
    	return $roles;
    }

    public function saveAdminUser(SaveAdminUserPostRequest $request)
    {
        $user = User::create([
            'username' => $request->input('username'),
            'displayname' => $request->input('displayname'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password')),
            'user_role_id' => $request->input('role_id')
        ]);

        $user->is_active = true;
        $user->save();

    	return response()->json([
    		'status' => 'success',
            'message' => 'New Admin User Created.'
    	]);
    }
}
