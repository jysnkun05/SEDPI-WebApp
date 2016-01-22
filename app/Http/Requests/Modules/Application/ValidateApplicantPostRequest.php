<?php

namespace App\Http\Requests\Modules\Application;

use App\Http\Requests\Request;

class ValidateApplicantPostRequest extends Request
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
            'firstName' => 'required',
            'lastName'  => 'required',
            'email'     => 'required|email'
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
