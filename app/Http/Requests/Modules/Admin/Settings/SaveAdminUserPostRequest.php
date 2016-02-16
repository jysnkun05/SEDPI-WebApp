<?php

namespace App\Http\Requests\Modules\Admin\Settings;

use App\Http\Requests\Request;
use Auth;

class SaveAdminUserPostRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::user()->userRole->name === 'Super Admin' || Auth::user()->userRole->name === 'Admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:user_roles,id',
            'password' => 'required|same:confirmpassword',
            'confirmpassword' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'required' => 'This field is required.',
            'email.email' => 'This field must be a valid email address.',
            'email.unique' => 'Email Address Exists. Please choose new one.',
            'password.same' => 'Password did not match. Please try again.'
        ];
    }
}
