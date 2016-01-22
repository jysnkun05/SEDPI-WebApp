<?php

namespace App\Http\Controllers\Modules\Membership;

use Illuminate\Http\Request;
use App\Applicant;
use App\ApplicationStatus;
use Countries;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ApplicationController extends Controller
{
    public function index()
    {
    	return view('modules.membership.application');
    }

    public function getApplicants()
    {
    	$applicants = Applicant::all();
    	foreach($applicants as $key => $applicant) {
    		$applicant->applicant_type_id = $applicant->applicantType->name;
    		$applicant->application_status_id = $applicant->applicationStatus->name;
	        $applicant->presentCountry = $applicant->presentCountry !== null ? Countries::getOne($applicant->presentCountry, 'en', 'cldr') : null;
    	}
    	return $applicants;
    }

    public function getApplicant(Request $request)
    {
    	$applicant = Applicant::find($request->input('id'));
        $applicant->applicant_type_id = $applicant->applicantType;
        $applicant->application_status_id = $applicant->applicationStatus;
        $applicant->presentCountry = $applicant->presentCountry !== null ? Countries::getOne($applicant->presentCountry, 'en', 'cldr') : null;
        $applicant->permanentCountry = $applicant->permanentCountry !== null ? Countries::getOne($applicant->permanentCountry, 'en', 'cldr') : null;	
        return $applicant;
    } 

    public function getApplicationStatus(Request $request)
    {
    	return ApplicationStatus::where('isSelectable', true)->get();
    }

    public function updateApplicationStatus(Request $request)
    {
    	$applicant = Applicant::find($request->input('id'));
    	$applicant->application_status_id = $request->input('statusSelected');
    	$applicant->remarks = $request->input('remarks');
    	$applicant->save();

    	return response()->json([
    		'status' => 'success'
    	]);
    }
    
}
