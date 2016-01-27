<?php

namespace App\Http\Requests\Modules\Investment;

use App\Http\Requests\Request;
use App\User;

class UpdateEmailAddressPostRequest extends Request
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
            'email' => 'required|email|unique:users,email,'.$this->input('id')
        ];
    }

    public function messages()
    {
        return [
            'required'      => 'This field is required.',
            'email.email'   => 'This field must be an email address.',
            'email.unique'  => 'This e-mail address already exists. Please try another one.'
        ];
    }
}
