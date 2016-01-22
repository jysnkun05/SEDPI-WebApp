<?php

namespace App;

use App\BaseModel as Model;

class ApplicantType extends Model
{
    protected $connection = 'application';
    protected $table = 'applicant_types';
    protected $guarded = ['*'];
    public $timestamps = false;

    public function applicant() {
    	return $this->hasOne('App\Applicant');
    }

}
