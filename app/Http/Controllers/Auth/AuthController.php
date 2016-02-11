<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\UserRole;

use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class AuthController extends Controller
{    
    public function getAdminLogin()
    {
        return view('auth.adminLogin'); 
    }

    public function postAdminLogin(Request $request)
    {
        $this->validate($request, [
            'email' => 'required', 'password' => 'required',
        ]);

        $throttles = $this->isUsingThrottlesLoginsTrait();

        if ($throttles && $this->hasTooManyLoginAttempts($request)) {
            return $this->sendLockoutResponse($request);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt(array_add($credentials, 'is_active', 1), $request->has('remember'))) {
            if(Auth::user()->user_role_id !== 1)
                return $this->handleUserWasAuthenticated($request, $throttles);
        }

        if ($throttles) {
            $this->incrementLoginAttempts($request);
        }

        return $this->sendFailedLoginResponse($request);
    }

    public function getMemberLogin()
    {
        return view('auth.memberLogin');
    }

    public function postMemberLogin(Request $request)
    {
        $this->validate($request, [
            'username' => 'required', 'password' => 'required',
        ]);

        $throttles = $this->isUsingThrottlesLoginsTrait();

        if ($throttles && $this->hasTooManyLoginAttempts($request)) {
            return $this->sendLockoutResponse($request);
        }

        $credentials = $request->only('username', 'password');

        if (Auth::attempt(array_add($credentials, 'is_active', 1), $request->has('remember'))) {
            if(Auth::user()->userRole->name === 'Investor')
                return $this->handleUserWasAuthenticated($request, $throttles);
        }

        if ($throttles) {
            $this->incrementLoginAttempts($request);
        }

        return $this->sendFailedLoginResponse($request);
    }

    public function getLogout()
    {
        Auth::logout();
        return redirect('/');
    }

    protected function isUsingThrottlesLoginsTrait()
    {
        return in_array(
            ThrottlesLogins::class, class_uses_recursive(get_class($this))
        );
    }

    protected function handleUserWasAuthenticated(Request $request, $throttles)
    {
        if ($throttles) {
            $this->clearLoginAttempts($request);
        }

        if (method_exists($this, 'authenticated')) {
            return $this->authenticated($request, Auth::user());
        }

        return redirect()->intended('/');
    }

    protected function sendFailedLoginResponse(Request $request)
    {
        return redirect()->back()
            ->withInput($request->only('email', 'remember'))
            ->withErrors([
                'email' => $this->getFailedLoginMessage(),
            ]);
    }

    protected function getFailedLoginMessage()
    {
        return Lang::has('auth.failed')
                ? Lang::get('auth.failed')
                : 'These credentials do not match our records.';
    }
}
