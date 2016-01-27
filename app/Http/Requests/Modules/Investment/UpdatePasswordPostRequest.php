<?php

namespace App\Http\Requests\Modules\Investment;

use App\Http\Requests\Request;

class UpdatePasswordPostRequest extends Request
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
            'password' => 'required|between:8,32|same:confirmPassword',
            'confirmPassword' => 'required'
        ];
    }

    public function message()
    {
        return [
            'required' => 'This field is required.',
            'password.between' => 'Password must be 8-32 characters.',
            'password.same' => 'Password and confirm Password are not match. Please try again.'
        ];
    }
}
