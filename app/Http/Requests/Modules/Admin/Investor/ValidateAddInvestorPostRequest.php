<?php

namespace App\Http\Requests\Modules\Admin\Investor;

use App\Http\Requests\Request;
use Auth;

class ValidateAddInvestorPostRequest extends Request
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
            'accountName' => 'required',
            'firstName' => 'required',
            'lastName' => 'required',
            'email' => 'email'
        ];
    }

    public function messages() {
        return [
            'required' => 'This field is required.',
            'email.email'   => 'This field must be an email address.',
            'email.unique'  => 'This e-mail address already exists. Please try another one.'
        ];
    }
}
