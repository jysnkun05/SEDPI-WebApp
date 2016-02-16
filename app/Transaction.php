<?php

namespace App;

use App\BaseModel as Model;

class Transaction extends Model
{
	use UuidForKey;
    protected $table = 'transactions';
    protected $dates = ['transactionDate', 'created_at', 'updated_at'];
    protected $fillable = [
      'transactionDate', 'transaction_type_id', 'amount', 'notes', 'account_id'
   	];

    public $incrementing = false;

   	public function transactionType () {
   		return $this->belongsTo('App\TransactionType');
   	}

    public function account() {
      return $this->belongsTo('App\Account');
    }
}
