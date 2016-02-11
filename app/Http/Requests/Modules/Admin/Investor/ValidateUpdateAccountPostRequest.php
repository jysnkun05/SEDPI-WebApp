<?php

namespace App\Http\Requests\Modules\Admin\Investor;

use App\Http\Requests\Request;
use Auth;

class ValidateUpdateAccountPostRequest extends Request
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
            'accountName' => 'sometimes|required',
            'username' => 'sometimes|required',
            'password' => 'sometimes|required|same:confirmPassword',
            'confirmPassword' => 'sometimes|required'
        ];
    }

    public function messages()
    {
        return [
            'required' => 'This field is required.'
        ];
    }
}
