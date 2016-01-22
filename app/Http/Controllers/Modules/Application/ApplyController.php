<?php

namespace App\Http\Controllers\Modules\Application;

use Illuminate\Http\Request;
use App\Applicant;
use Carbon\Carbon;

use App\Http\Requests\Modules\Application\ValidateApplicantPostRequest;
use App\Http\Requests\Modules\Application\ValidatePersonalPostRequest;
use App\Http\Requests\Modules\Application\ValidateContactPostRequest;
use App\Http\Requests\Modules\Application\ValidateInvestmentPostRequest;
use App\Http\Requests\Modules\Application\ValidateBeneficiaryPostRequest;
use App\Http\Controllers\Controller;

class ApplyController extends Controller
{
    public function index()
    {
    	return view('modules.application.apply');	
    }

    public function validateApplicantInfo(ValidateApplicantPostRequest $request)
    {
    	return response()->json([
    		'status' => 'success'
    	]);
    }

    public function validatePersonalInfo(ValidatePersonalPostRequest $request)
    {
        return response()->json([
            'status' => 'success'
        ]);
    }

    public function validateContactInfo(ValidateContactPostRequest $request)
    {
        return response()->json([
            'status' => 'success'
        ]);
    }

    public function validateInvestmentInfo(ValidateInvestmentPostRequest $request)
    {
        return response()->json([
            'status' => 'success'
        ]);
    }

    public function validateBeneficiaryInfo(ValidateBeneficiaryPostRequest $request)
    {
        return response()->json([
            'status' => 'success'
        ]);
    }

    public function saveNonMember(Request $request)
    {
        $applicant = Applicant::create([
            'firstName' => $request->input('firstName'),
            'middleName' => $request->input('middleName'),
            'lastName' => $request->input('lastName'),
            'email' => $request->input('email')
        ]);

        $applicant->applicant_type_id = 1;
        $applicant->application_status_id = 1;
        $applicant->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function saveTraineeMember(Request $request)
    {
        $applicant = Applicant::create([
            'firstName'         => $request->input('firstName'),
            'middleName'        => $request->input('middleName'),
            'lastName'          => $request->input('lastName'),
            'email'             => $request->input('email'),
            'sex'               => $request->input('sex'),
            'birthDate'         => Carbon::parse($request->input('birthDate'))->toDateString(),
            'civilStatus'       => $request->input('civilStatus'),
            'annualIncome'      => $this->getAnnualIncome($request->input('annualIncome')),
            'presentAddress'    => $request->input('presentAddress'),
            'presentCountry'    => $request->input('presentCountry'),
            'permanentAddress'  => $request->input('permanentAddress'),
            'permanentCountry'  => $request->input('permanentCountry'),
            'mailingAddress'    => $request->input('mailingAddress'),
            'mobile'            => $request->input('mobile')
        ]);

        if($request->input('birthPlace') !== '')
            $applicant->birthPlace = $request->input('birthPlace');
        if($request->input('otherCivilStatus') !== '')
            $applicant->otherCivilStatus = $request->input('otherCivilStatus');
        if($request->input('spouseName') !== '')
            $applicant->spouseName = $request->input('spouseName');
        if($request->input('nationality') !== '')
            $applicant->nationality = $request->input('nationality');
        if($request->input('occupation') !== '')
            $applicant->occupation = $request->input('occupation');
        if($request->input('tin') !== '')
            $applicant->tin = $request->input('tin');
        if($request->input('sssGsis') !== '')
            $applicant->sssGsis = $request->input('sssGsis');

        if($request->input('haveAttended') !== '')
            $applicant->haveAttended = $request->input('haveAttended') === 'Yes' ? true : false;
        if($request->input('willAttend') !== '')
            $applicant->willAttend = $request->input('willAttend') === 'Yes' ? true : false;
        if($request->input('trainingType') !== '')
            $applicant->trainingType = $request->input('trainingType');
        if($request->input('willInvest') !== '')
            $applicant->willInvest = $request->input('willInvest') === 'Yes' ? true : false;
        
        $applicant->applicant_type_id = 2;
        $applicant->application_status_id = 1;
        $applicant->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function saveInvestorMember(Request $request)
    {
        $applicant = Applicant::create([
            'firstName'         => $request->input('firstName'),
            'middleName'        => $request->input('middleName'),
            'lastName'          => $request->input('lastName'),
            'email'             => $request->input('email'),
            'sex'               => $request->input('sex'),
            'birthDate'         => Carbon::parse($request->input('birthDate'))->toDateString(),
            'civilStatus'       => $request->input('civilStatus'),
            'annualIncome'      => $this->getAnnualIncome($request->input('annualIncome')),
            'presentAddress'    => $request->input('presentAddress'),
            'presentCountry'    => $request->input('presentCountry'),
            'permanentAddress'  => $request->input('permanentAddress'),
            'permanentCountry'  => $request->input('permanentCountry'),
            'mailingAddress'    => $request->input('mailingAddress'),
            'mobile'            => $request->input('mobile')
        ]);

        if($request->input('birthPlace') !== '')
            $applicant->birthPlace = $request->input('birthPlace');
        if($request->input('otherCivilStatus') !== '')
            $applicant->otherCivilStatus = $request->input('otherCivilStatus');
        if($request->input('spouseName') !== '')
            $applicant->spouseName = $request->input('spouseName');
        if($request->input('nationality') !== '')
            $applicant->nationality = $request->input('nationality');
        if($request->input('occupation') !== '')
            $applicant->occupation = $request->input('occupation');
        if($request->input('tin') !== '')
            $applicant->tin = $request->input('tin');
        if($request->input('sssGsis') !== '')
            $applicant->sssGsis = $request->input('sssGsis');

         if($request->input('haveAttended') !== '')
            $applicant->haveAttended = $request->input('haveAttended') === 'Yes' ? true : false;
        if($request->input('willAttend') !== '')
            $applicant->willAttend = $request->input('willAttend') === 'Yes' ? true : false;
        if($request->input('trainingType') !== '')
            $applicant->trainingType = $request->input('trainingType');
        if($request->input('willInvest') !== '')
            $applicant->willInvest = $request->input('willInvest') === 'Yes' ? true : false;

        if($request->input('amountInvested') !== '')
        {
            $applicant->amountInvested = $request->input('amountInvested');
            $applicant->investmentDate = Carbon::parse($request->input('investmentDate'))->toDateString();
            $applicant->sourceOfFunds = $request->input('sourceOfFunds');
        }

        if($request->input('b1Name') !== '')
        {
            $applicant->b1Name = $request->input('b1Name');
            $applicant->b1Address = $request->input('b1Address');
            $applicant->b1BirthDate = Carbon::parse($request->input('b1BirthDate'))->toDateString();
            $applicant->b1Relationship = $request->input('b1Relationship');
        }

        if($request->input('b2Name') !== '')
        {
            $applicant->b2Name = $request->input('b2Name');
            $applicant->b2Address = $request->input('b2Address');
            $applicant->b2BirthDate = Carbon::parse($request->input('b2BirthDate'))->toDateString();
            $applicant->b2Relationship = $request->input('b2Relationship');
        }
        
        $applicant->applicant_type_id = 2;
        $applicant->application_status_id = 1;
        $applicant->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    protected function getAnnualIncome ($value) 
    {
        switch($value) {
                case 1: 
                    return 'Over Php 5 million';
                case 2: 
                    return 'Php 1 Million to Php 5 Million';
                case 3: 
                    return 'Php 500,000 to Php 1 Million';
                case 4: 
                    return 'Php 300,000 to Php 500,000';
                case 5: 
                    return 'Below Php 300,000';
        }; 
    }
}
