<?php

namespace App;

use App\BaseModel as Model;

class ApplicationStatus extends Model
{
    protected $connection = 'application';
    protected $table = 'application_statuses';
    protected $guarded = ['*'];
    public $timestamps = false;

     public function applicant() {
    	return $this->hasOne('App\Applicant');
    }
}
