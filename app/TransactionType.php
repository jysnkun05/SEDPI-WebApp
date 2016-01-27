<?php

namespace App;

use App\BaseModel as Model;

class TransactionType extends Model
{
    protected $connection = "investor";
    protected $table = "transaction_types";
    protected $dates = ['created_at', 'updated_at'];

    public function transaction() {
    	return $this->hasOne('App\Transaction');
    }
}
