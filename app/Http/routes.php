<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

	Route::group(['domain' => 'member.sedpi.dev'], function () {
    	Route::get('/' , function () {
    		return redirect('apply');
    	});
    	Route::get('apply', ['uses' => 'Modules\Application\ApplyController@index', 'as' => 'apply']);
    });

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {

	/*----------  panel subdomain  ----------*/
    Route::group(['domain' => 'panel.sedpi.dev'], function () {
    	Route::get('login', ['uses' => 'Auth\AuthController@getAdminLogin', 'as' => 'adminLogin']);
    	Route::post('login', 'Auth\AuthController@postAdminLogin');

    	Route::group(['middleware' => 'auth'], function () {
    		Route::get('/', function () {
    			return redirect('application');
    		});
    		Route::get('logout', 'Auth\AuthController@getLogout');
    		Route::get('application', ['uses' => 'Modules\Membership\ApplicationController@index', 'as' => 'application']);
    		Route::get('membership', ['uses' => 'Modules\Membership\MemberController@index', 'as' => 'membership']);
    		Route::get('investors',  ['uses' => 'Modules\Investment\InvestController@index', 'as' => 'admin_investor']);
    		Route::get('transactions', ['uses' => 'Modules\Investment\TransactionController@index', 'as' => 'admin_transaction']);
    	});

    	Route::group(['prefix' => 'api/investment'], function () {
			Route::post('saveInvestor', 'Modules\Investment\InvestController@saveInvestor');
			Route::post('getInvestors', 'Modules\Investment\InvestController@getInvestors');
			Route::post('getInvestorProfile', 'Modules\Investment\InvestController@getInvestorProfile');
			Route::post('getInvestorInvestments', 'Modules\Investment\InvestController@getInvestorInvestments');
			Route::post('sendEmailVerification', 'Modules\Investment\InvestController@sendEmailVerification');
		});

		Route::group(['prefix' => 'api/transaction'], function () {
			Route::post('deposit', 'Modules\Investment\TransactionController@deposit');
			Route::post('withdraw', 'Modules\Investment\TransactionController@withdraw');
		});
    });


	/*----------  member subdomain  ----------*/

    Route::group(['domain' => 'member.sedpi.dev'], function () {
    	Route::get('login', ['uses' => 'Auth\AuthController@getMemberLogin', 'as' => 'memberLogin']);
    	Route::post('login', 'Auth\AuthController@postMemberLogin');

    	Route::group(['middleware' => 'auth'], function () {
    		Route::get('logout', 'Auth\AuthController@getLogout');
	    	Route::get('/', ['uses' => 'Modules\Investors\InvestController@index', 'as' => 'investor_investment']);
	    	Route::get('deposit', ['uses' => 'Modules\Investors\InvestController@showDeposit', 'as' => 'investor_deposit']);
    	});

    	Route::get('verify/{verification_code}', ['uses' => 'Modules\Investment\InvestController@verifyInvestor', 'as' => 'member_verify']);

    	Route::group(['prefix' => 'api/verify'], function () {
    		Route::post('setUserCredentials', 'Modules\Investment\InvestController@setUserCredentials');
    	});

    	Route::group(['prefix' => 'api/investors'], function () {
    		Route::post('getInvestorInvestments', 'Modules\Investors\InvestController@getInvestorInvestments');
    	});
    });
});

Route::group(['middleware' => ['api']], function () {
	Route::group(['prefix' => 'api/utilities'], function () {
		Route::post('getCountryList','Modules\Utilities\ApplicationController@getCountryList');
		Route::post('updateApplicationStatus', 'Modules\Membership\ApplicationController@updateApplicationStatus');
	});

	Route::group(['domain' => 'member.sedpi.dev'], function () {
		Route::group(['prefix' => 'api/application'], function () {
			Route::post('validateApplicantInfo', 'Modules\Application\ApplyController@validateApplicantInfo');
			Route::post('validatePersonalInfo', 'Modules\Application\ApplyController@validatePersonalInfo');
			Route::post('validateContactInfo', 'Modules\Application\ApplyController@validateContactInfo');
			Route::post('validateInvestmentInfo', 'Modules\Application\ApplyController@validateInvestmentInfo');
			Route::post('validateBeneficiaryInfo', 'Modules\Application\ApplyController@validateBeneficiaryInfo');
			Route::post('saveNonMember', 'Modules\Application\ApplyController@saveNonMember');
			Route::post('saveTraineeMember', 'Modules\Application\ApplyController@saveTraineeMember');
			Route::post('saveInvestorMember', 'Modules\Application\ApplyController@saveInvestorMember');
		});

	});

	Route::group(['domain' => 'panel.sedpi.dev'], function () {
		Route::group(['prefix' => 'api/applicants'], function () {
			Route::post('getApplicants', 'Modules\Membership\ApplicationController@getApplicants');
			Route::post('getApplicant', 'Modules\Membership\ApplicationController@getApplicant');
			Route::post('getApplicationStatus', 'Modules\Membership\ApplicationController@getApplicationStatus');
		});
	});

});
