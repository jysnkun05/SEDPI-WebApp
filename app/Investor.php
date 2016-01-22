<?php

namespace App;

use App\BaseModel as Model; 

class Investor extends Model
{
    protected $connection="investor";
    protected $table="investors";
    protected $fillable = [
    	'firstName', 'middleName', 'lastName', 'email', 'location'
    ];

    public function user() {
    	return $this->belongsTo('App\User')->select(['id', 'displayname', 'username', 'email', 'is_verified', 'is_active']);
    }
}
