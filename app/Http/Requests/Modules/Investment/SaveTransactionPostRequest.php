<?php

namespace App\Http\Requests\Modules\Investment;

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
            'transactionDate'   => 'required|date',
            'amount'            => 'required|numeric|min:1',
            'transaction_type_id'   => 'required'
        ];
    }

    public function messages()
    {
        return [
            'required'          => 'This field is required.',
            'amount.numeric'    => 'Amount must be a numeric value.',
            'amount.min'        => 'Amount cannot be less than or equal to zero.',
        ];
    }
}
