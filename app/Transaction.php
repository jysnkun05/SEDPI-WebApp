<?php

namespace App;

use App\BaseModel as Model;

class Transaction extends Model
{
    protected $connection = 'investor';
    protected $table = 'transactions';
    protected $dates = ['transaction_date', 'created_at', 'updated_at'];
    protected $fillable = [
    	'id', 'transactionDate', 'transaction_type_id', 'amount', 'notes', 'investor_id'
   	];

   	public function transactionType () {
   		return $this->belongsTo('App\TransactionType');
   	}
}
