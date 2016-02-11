<?php

namespace App;

use App\BaseModel as Model;

class Transaction extends Model
{
	use UuidForKey;
    protected $connection = 'investor';
    protected $table = 'transactions';
    protected $dates = ['transactionDate', 'created_at', 'updated_at'];
    protected $fillable = [
    	'id', 'transactionDate', 'transaction_type_id', 'amount', 'notes', 'account_id'
   	];

   	public function transactionType () {
   		return $this->belongsTo('App\TransactionType');
   	}

    public function account() {
      return $this->belongsTo('App\Account');
    }
}
