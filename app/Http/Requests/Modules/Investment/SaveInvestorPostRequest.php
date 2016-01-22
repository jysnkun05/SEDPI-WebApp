<?php

namespace App\Http\Requests\Modules\Investment;

use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Request;

class SaveInvestorPostRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if(Auth::user()->userRole->name === 'Super Admin')
            return true;
        else
            return false;   
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'firstName' => 'required',
            'lastName' => 'required',
            'email' => 'required|email|unique:users'
        ];
    }
}
