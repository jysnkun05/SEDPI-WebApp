<?php

namespace App\Http\Requests\Modules\Application;

use App\Http\Requests\Request;

class ValidateInvestmentPostRequest extends Request
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
            'amountInvested' => 'required|numeric',
            'investmentDate' => 'required|date|after:yesterday',
            'sourceOfFunds'  => 'required'
        ];
    }

    public function response(array $errors)
    {
        return response()->json([
            'status' => 'failed',
            'errors' => $errors
        ]);
    }
}
