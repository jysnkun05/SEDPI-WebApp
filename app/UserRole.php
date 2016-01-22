<?php

namespace App;

use App\BaseModel as Model;

class UserRole extends Model
{
    protected $table = 'user_roles';

    public function user() {
    	return $this->hasOne('App\User');
    }
}
