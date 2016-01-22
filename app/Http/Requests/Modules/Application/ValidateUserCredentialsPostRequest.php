<?php

namespace App\Http\Requests\Modules\Application;

use App\User;
use App\Http\Requests\Request;

class ValidateUserCredentialsPostRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'required|alpha_dash|unique:users',
            'password' => 'required',
            'confirmPassword' => 'required|same:password'
        ];
    }
}
