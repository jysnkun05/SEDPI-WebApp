<?php

namespace App;

use App\BaseModel as Model;

class Applicant extends Model
{
    protected $connection = 'application';
    protected $table = 'applicants';
    protected $dates = [ 'birthDate', 'investmentDate', 'b1BirthDate', 'b2BirthDate', 'created_at', 'updated_at'];
    protected $fillable = [
    	'firstName', 'middleName', 'lastName', 'email', 
      'sex', 'birthDate', 'civilStatus', 'otherCivilStatus', 'spouseName', 'nationality', 'occupation', 'tin', 'sssGsis', 'annualIncome', 
      'presentAddress', 'presentCountry', 'permanentAddress', 'permanentCountry', 'mailingAddress', 'mobile',
      'haveAttended', 'willAttend', 'trainingType', 'willInvest',
      'amountInvested', 'investmentDate', 'sourceOfFunds',
      'b1Name', 'b1BirthDate', 'b1Address', 'b1Relationship',
      'b2Name', 'b2BirthDate', 'b2Address', 'b2Relationship'
   	];
   	
   	public function applicantType () {
   		return $this->belongsTo('App\ApplicantType');
   	}

   	public function applicationStatus () {
   		return $this->belongsTo('App\ApplicationStatus');
   	}
}
