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
    			return redirect('investors');
    		});
    		Route::get('logout', 'Auth\AuthController@getLogout');
    		Route::get('investors',  ['uses' => 'Modules\Admin\Investor\InvestController@index', 'as' => 'admin_investor']);
    		// Route::get('settings', ['uses' => 'Modules\Admin\Settings\UserSettingsController@index', 'as' => 'admin_settings']);
    		//Route::get('application', ['uses' => 'Modules\Membership\ApplicationController@index', 'as' => 'application']);
    		//Route::get('membership', ['uses' => 'Modules\Membership\MemberController@index', 'as' => 'membership']);
    		//Route::get('transactions', ['uses' => 'Modules\Investment\TransactionController@index', 'as' => 'admin_transaction']);
    	});

    	Route::group(['prefix' => 'api/investor'], function () {
    		Route::post('getAllAccounts', 'Modules\Admin\Investor\InvestController@getAllAccounts');
    		Route::post('getAccountDetails', 'Modules\Admin\Investor\InvestController@getAccountDetails');
    		Route::post('addCoInvestor', 'Modules\Admin\Investor\InvestController@addCoInvestor');
    		Route::post('addAccount', 'Modules\Admin\Investor\InvestController@addAccount');
    		Route::post('updateAccountName', 'Modules\Admin\Investor\InvestController@updateAccountName');
    		Route::post('updateAccountType', 'Modules\Admin\Investor\InvestController@updateAccountType');
    		Route::post('updateUsername','Modules\Admin\Investor\InvestController@updateUsername');
    		Route::post('updatePassword', 'Modules\Admin\Investor\InvestController@updatePassword');
			Route::post('updateUserActive', 'Modules\Admin\Investor\InvestController@updateUserActive');
    	});

    	Route::group(['prefix' => 'api/investment'], function () {
			Route::post('saveInvestor', 'Modules\Investment\InvestController@saveInvestor');
			Route::post('getInvestors', 'Modules\Investment\InvestController@getInvestors');
			Route::post('getInvestorProfile', 'Modules\Investment\InvestController@getInvestorProfile');
			Route::post('getInvestorInvestments', 'Modules\Investment\InvestController@getInvestorInvestments');
			Route::post('sendEmailVerification', 'Modules\Investment\InvestController@sendEmailVerification');
			Route::post('updateEmailAddress', 'Modules\Investment\InvestController@updateEmailAddress');
			Route::post('updateUsername', 'Modules\Investment\InvestController@updateUsername');
			Route::post('updatePassword', 'Modules\Investment\InvestController@updatePassword');
		});

		Route::group(['prefix' => 'api/transaction'], function () {
    		Route::post('getTransactionTypes', 'Modules\Admin\Investor\TransactionController@getTransactionTypes');
    		Route::post('getTransactionDetails', 'Modules\Admin\Investor\TransactionController@getTransactionDetails');
			Route::post('saveTransaction', 'Modules\Admin\Investor\TransactionController@saveTransaction');
			Route::post('updateTransaction', 'Modules\Admin\Investor\TransactionController@updateTransaction');
			// Route::post('getTransactionDetails', 'Modules\Investment\TransactionController@getTransactionDetails');
			// Route::post('saveTransaction', 'Modules\Investment\TransactionController@saveTransaction');
			// Route::post('getTransactionTypes', 'Modules\Investment\TransactionController@getTransactionTypes');
			// Route::post('updateTransaction', 'Modules\Investment\TransactionController@updateTransaction');
		});

        // Route::group(['prefix' => 'api/settings/users'], function () {
        //     Route::post('getAllUserRoles', 'Modules\Admin\Settings\UserSettingsController@getAllUserRoles');
        // });
    });


	/*----------  member subdomain  ----------*/

    Route::group(['domain' => 'member.sedpi.dev'], function () {
    	Route::get('login', ['uses' => 'Auth\AuthController@getMemberLogin', 'as' => 'memberLogin']);
    	Route::post('login', 'Auth\AuthController@postMemberLogin');

    	Route::group(['middleware' => 'auth'], function () {
    		Route::get('logout', 'Auth\AuthController@getLogout');
	    	Route::get('/', ['uses' => 'Modules\Investors\InvestController@index', 'as' => 'investor_investment']);
	    	Route::get('deposit', ['uses' => 'Modules\Investors\InvestController@showDeposit', 'as' => 'investor_deposit']);
    	
	    	Route::group(['prefix' => 'api/investor'], function () {
	    		Route::post('getAccountDetails', 'Modules\Investors\InvestController@getAccountDetails');
	    		// Route::post('getInvestorInvestments', 'Modules\Investors\InvestController@getInvestorInvestments');
	    		// Route::post('saveAdviceDeposit', 'Modules\Investors\InvestController@saveAdviceDeposit');
	    	});
    	});

    	Route::get('verify/{verification_code}', ['uses' => 'Modules\Investment\InvestController@verifyInvestor', 'as' => 'member_verify']);

    	Route::group(['prefix' => 'api/verify'], function () {
    		Route::post('setUserCredentials', 'Modules\Investment\InvestController@setUserCredentials');
    	});
    });
});

// Route::group(['middleware' => ['api']], function () {
// 	Route::group(['prefix' => 'api/utilities'], function () {
// 		Route::post('getCountryList','Modules\Utilities\ApplicationController@getCountryList');
// 		Route::post('updateApplicationStatus', 'Modules\Membership\ApplicationController@updateApplicationStatus');
// 	});

// 	Route::group(['domain' => 'member.sedpi.dev'], function () {
// 		Route::group(['prefix' => 'api/application'], function () {
// 			Route::post('validateApplicantInfo', 'Modules\Application\ApplyController@validateApplicantInfo');
// 			Route::post('validatePersonalInfo', 'Modules\Application\ApplyController@validatePersonalInfo');
// 			Route::post('validateContactInfo', 'Modules\Application\ApplyController@validateContactInfo');
// 			Route::post('validateInvestmentInfo', 'Modules\Application\ApplyController@validateInvestmentInfo');
// 			Route::post('validateBeneficiaryInfo', 'Modules\Application\ApplyController@validateBeneficiaryInfo');
// 			Route::post('saveNonMember', 'Modules\Application\ApplyController@saveNonMember');
// 			Route::post('saveTraineeMember', 'Modules\Application\ApplyController@saveTraineeMember');
// 			Route::post('saveInvestorMember', 'Modules\Application\ApplyController@saveInvestorMember');
// 		});

// 	});

// 	Route::group(['domain' => 'panel.sedpi.dev'], function () {
// 		Route::group(['prefix' => 'api/applicants'], function () {
// 			Route::post('getApplicants', 'Modules\Membership\ApplicationController@getApplicants');
// 			Route::post('getApplicant', 'Modules\Membership\ApplicationController@getApplicant');
// 			Route::post('getApplicationStatus', 'Modules\Membership\ApplicationController@getApplicationStatus');
// 		});
// 	});

// });
