<?php

namespace App;

use App\BaseModel as Model;

class UserRole extends Model
{
	use UuidForKey;
    protected $table = 'user_roles';
    public $incrementing = false;

    public function user() {
    	return $this->hasOne('App\User');
    }
}
