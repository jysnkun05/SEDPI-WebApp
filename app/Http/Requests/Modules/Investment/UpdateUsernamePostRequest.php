<?php

namespace App\Http\Requests\Modules\Investment;

use App\Http\Requests\Request;

class UpdateUsernamePostRequest extends Request
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
            'username' => 'required|between:8-16|regex:/^(?![_])(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_])$/|unique:users,username,'.$this->input('id')
        ];
    }

    public function messages()
    {
        return [
            'required' => 'This field is required.',
            'username.between' => 'Username must be 8-16 characters long.',
            'username.regex' => 'Username can be alphanumeric with underscore.'
        ];
    }
}
