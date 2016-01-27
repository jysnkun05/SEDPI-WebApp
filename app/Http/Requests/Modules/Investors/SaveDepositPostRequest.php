<?php

namespace App\Http\Requests\Modules\Investors;

use App\Http\Requests\Request;

class SaveDepositPostRequest extends Request
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
            'dateDeposit' => 'required|date',
            'amount' => 'required|numeric|min:1'
        ];
    }
}
