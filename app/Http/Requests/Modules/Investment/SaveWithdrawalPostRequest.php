<?php

namespace App\Http\Requests\Modules\Investment;

use App\Investor;
use App\Http\Requests\Request;

class SaveWithdrawalPostRequest extends Request
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
            'withdrawDate' => 'required|date',
            'withdrawAmount' => 'required|numeric|min:1|max:'.Investor::where('id', $this->get('id'))->first()->balance
        ];
    }
}
