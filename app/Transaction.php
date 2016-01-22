<?php

namespace App;

use App\BaseModel as Model;

class Transaction extends Model
{
    protected $connection = 'investor';
    protected $table = 'transactions';
    protected $dates = ['transaction_date', 'created_at', 'updated_at'];
    protected $fillable = [
    	'id', 'transaction_date', 'transaction_type', 'amount', 'notes', 'investor_id'
   	];
}
