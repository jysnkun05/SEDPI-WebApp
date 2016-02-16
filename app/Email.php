<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
	use UuidForKey;
    protected $table='emails';
    protected $fillable = ['email_type','name','username', 'password', 'account_type', 'encryption_type'];
    protected $hidden = ['password'];
    public $incrementing = false;
}
