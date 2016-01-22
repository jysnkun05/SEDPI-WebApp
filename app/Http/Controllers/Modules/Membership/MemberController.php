<?php

namespace App\Http\Controllers\Modules\Membership;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class MemberController extends Controller
{
    public function index()
    {
    	return view('modules.membership.members');
    }
}
