<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
	use UuidForKey;
   	protected $table = 'accounts';
   	public $incrementing = false;

   	protected $fillable = [
   		'name', 'type', 'accountType'
   	];

   	public function user() {
   		return $this->belongsTo('App\User');
   	}

   	public function investors() {
   		return $this->hasMany('App\Investor');
   	}

      public function transactions() {
         return $this->hasMany('App\Transaction');
      }
}
