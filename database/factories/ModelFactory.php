<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->email,
        'password' => bcrypt(str_random(10)),
        'remember_token' => str_random(10),
    ];
});

$factory->defineAs(App\Applicant::class, 'nonMember', function(Faker\Generator $faker) {
	$faker = Faker\Factory::create('en_PH');
	return [
		'firstName' => $faker->firstName,
		'middleName' => $faker->optional()->lastName,
		'lastName' => $faker->lastName,
		'email'	=> $faker->email,
		'applicant_type_id' => 1,
		'application_status_id' => 1
	];
});

$factory->defineAs(App\Applicant::class, 'trainee', function(Faker\Generator $faker) {
	$faker = Faker\Factory::create('en_PH');
	$civilStatuses = ['Single', 'Married', 'Annulled', 'Widowed', 'Others'];
	$civilStatus = $civilStatuses[array_rand($civilStatuses)]; 
	$sexes = ['male', 'female'];
	$sex = $sexes[array_rand($sexes)];
	return [
		'firstName' => $faker->firstName($sex),
		'middleName' => $faker->optional()->lastName,
		'lastName' => $faker->lastName,
		'email'	=> $faker->email,
		'sex' => $sex,
		'birthDate' => $faker->date($format = 'Y-m-d', $max = 'now'),
		'birthPlace' => $faker->optional()->city,
		'civilStatus' => $civilStatus,
		'otherCivilStatus' => $civilStatus === 'Others' ? 'Other' : null,
		'spouseName' => $faker->name($sex === 'male' ? 'female' : 'male'),
		'annualIncome' => '4 million',
		
		'presentAddress' => $faker->Address,
		'presentCountry' => $faker->countryCode,
		'permanentAddress' => $faker->Address,
		'permanentCountry' => $faker->countryCode,
		'mailingAddress' => 'present',
		'mobile' => $faker->phoneNumber,

		'haveAttended' => 0,
		'willAttend' => 1,
		'trainingType' => 'Online',
		
		'applicant_type_id' => 2,
		'application_status_id' => 1
	];
});

$factory->defineAs(App\Applicant::class, 'investor', function(Faker\Generator $faker) {
	$faker = Faker\Factory::create('en_PH');
	$civilStatuses = ['Single', 'Married', 'Annulled', 'Widowed', 'Others'];
	$civilStatus = $civilStatuses[array_rand($civilStatuses)]; 
	$sexes = ['male', 'female'];
	$sex = $sexes[array_rand($sexes)];
	return [
		'firstName' => $faker->firstName($sex),
		'middleName' => $faker->optional()->lastName,
		'lastName' => $faker->lastName,
		'email'	=> $faker->email,
		'sex' => $sex,
		'birthDate' => $faker->date($format = 'Y-m-d', $max = 'now'),
		'birthPlace' => $faker->optional()->city,
		'civilStatus' => $civilStatus,
		'otherCivilStatus' => $civilStatus === 'Others' ? 'Other' : null,
		'spouseName' => $faker->name($sex === 'male' ? 'female' : 'male'),
		'annualIncome' => '4 million',
		
		'presentAddress' => $faker->Address,
		'presentCountry' => $faker->countryCode,
		'permanentAddress' => $faker->Address,
		'permanentCountry' => $faker->countryCode,
		'mailingAddress' => 'present',
		'mobile' => $faker->phoneNumber,

		'haveAttended' => 1,
		'willInvest' => 1,
		
		'applicant_type_id' => 3,
		'application_status_id' => 1
	];
});

$factory->defineAs(App\Applicant::class, 'investorWithInvestment', function(Faker\Generator $faker) {
	$faker = Faker\Factory::create('en_PH');
	$civilStatuses = ['Single', 'Married', 'Annulled', 'Widowed', 'Others'];
	$civilStatus = $civilStatuses[array_rand($civilStatuses)]; 
	$sexes = ['male', 'female'];
	$sex = $sexes[array_rand($sexes)];
	return [
		'firstName' => $faker->firstName($sex),
		'middleName' => $faker->optional()->lastName,
		'lastName' => $faker->lastName,
		'email'	=> $faker->email,
		'sex' => $sex,
		'birthDate' => $faker->date($format = 'Y-m-d', $max = 'now'),
		'birthPlace' => $faker->optional()->city,
		'civilStatus' => $civilStatus,
		'otherCivilStatus' => $civilStatus === 'Others' ? 'Other' : null,
		'spouseName' => $faker->name($sex === 'male' ? 'female' : 'male'),
		'annualIncome' => '4 million',
		
		'presentAddress' => $faker->Address,
		'presentCountry' => $faker->countryCode,
		'permanentAddress' => $faker->Address,
		'permanentCountry' => $faker->countryCode,
		'mailingAddress' => 'present',
		'mobile' => $faker->phoneNumber,

		'haveAttended' => 1,
		'willInvest' => 1,

		'amountInvested' => $faker->randomFloat($nbMaxDecimals = 2, $min = 5000, $max = NULL),
		'investmentDate' => $faker->date($format = 'Y-m-d', $max = 'now'),
		'sourceOfFunds' => 'Salary',
		
		'applicant_type_id' => 3,
		'application_status_id' => 1
	];
});

$factory->defineAs(App\Applicant::class, 'investorWithBeneficiary', function(Faker\Generator $faker) {
	$faker = Faker\Factory::create('en_PH');
	$civilStatuses = ['Single', 'Married', 'Annulled', 'Widowed', 'Others'];
	$civilStatus = $civilStatuses[array_rand($civilStatuses)]; 
	$sexes = ['male', 'female'];
	$sex = $sexes[array_rand($sexes)];
	return [
		'firstName' => $faker->firstName($sex),
		'middleName' => $faker->optional()->lastName,
		'lastName' => $faker->lastName,
		'email'	=> $faker->email,
		'sex' => $sex,
		'birthDate' => $faker->date($format = 'Y-m-d', $max = 'now'),
		'birthPlace' => $faker->optional()->city,
		'civilStatus' => $civilStatus,
		'otherCivilStatus' => $civilStatus === 'Others' ? 'Other' : null,
		'spouseName' => $faker->name($sex === 'male' ? 'female' : 'male'),
		'annualIncome' => '4 million',
		
		'presentAddress' => $faker->Address,
		'presentCountry' => $faker->countryCode,
		'permanentAddress' => $faker->Address,
		'permanentCountry' => $faker->countryCode,
		'mailingAddress' => 'present',
		'mobile' => $faker->phoneNumber,

		'haveAttended' => 1,
		'willInvest' => 1,

		'b1Name' => $faker->name(),
		'b1Address' => $faker->address. ', '.$faker->country,
		'b1BirthDate' => $faker->date($format = 'Y-m-d', $max = 'now'),
		'b1Relationship' => 'Son', 

		'amountInvested' => $faker->randomFloat($nbMaxDecimals = 2, $min = 5000, $max = NULL),
		'investmentDate' => $faker->date($format = 'Y-m-d', $max = 'now'),
		'sourceOfFunds' => 'Salary',
		
		'applicant_type_id' => 3,
		'application_status_id' => 1
	];
});
