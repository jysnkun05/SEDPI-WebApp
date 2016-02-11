<?php

namespace App;

use App\BaseModel as Model; 

class Investor extends Model
{
	use UuidForKey;
    protected $connection='investor';
    protected $table='investors';
    public $incrementing = false;

    protected $fillable = [
    	'firstName', 'middleName', 'lastName', 'email'
    ];

    public function account() {
    	return $this->belongsTo('App\Account');
    }
   	
    
}
