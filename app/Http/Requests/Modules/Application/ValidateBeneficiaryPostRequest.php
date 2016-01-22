<?php

namespace App\Http\Requests\Modules\Application;

use App\Http\Requests\Request;

class ValidateBeneficiaryPostRequest extends Request
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
            'b1BirthDate'       => 'required_with:b1Name|date|before:tomorrow',
            'b1Address'         => 'required_with:b1Name',
            'b1Relationship'    => 'required_with:b1Name',
            'b2BirthDate'       => 'required_with:b2Name|date|before:tomorrow',
            'b2Address'         => 'required_with:b2Name',
            'b2Relationship'    => 'required_with:b2Name',      
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
