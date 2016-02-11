<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use UuidForKey;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    public $incrementing = false;

    public function userRole() {
        return $this->belongsTo('App\UserRole');
    }

    public function account() {
        return $this->hasOne('App\Account');
    }
}
