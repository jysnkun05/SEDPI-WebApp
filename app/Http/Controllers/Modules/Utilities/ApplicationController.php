<?php

namespace App\Http\Controllers\Modules\Utilities;

use Illuminate\Http\Request;

use Countries;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ApplicationController extends Controller
{
    public function getCountryList ()
    {
    	$countries = Countries::getList('en', 'json', 'cldr');
        return $countries;
    }
}
