<?php

namespace App\Http\Requests\Modules\Admin\Investor;

use App\Http\Requests\Request;
use Auth;

class SaveTransactionPostRequest extends Request
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
            'transactionDate' => 'required|date',
            'transactionType' => 'required',
            'amount' => 'required|numeric|min:1'
        ];
    }

    public function messages() {
        return [
            'required' => 'This field is required.',
        ];
    }
}
