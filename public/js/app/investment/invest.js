/*===========================================
=            Investor Table View            =
===========================================*/

var InvestTableView = React.createClass({
	displayName: "InvestTableView",

	render: function () {
		var investors = this.props.investors;
		var rows;
		if (investors === undefined) {
			rows = React.createElement(
				"tr",
				{ className: "text-center" },
				React.createElement(
					"td",
					{ colSpan: "6" },
					React.createElement("i", { className: "fa fa-circle-o-notch fa-spin fa-fw" }),
					" Retrieving Investors..."
				)
			);
		} else if (investors.length > 0) {
			rows = investors.map(function (investor, index) {
				investor.fullName = investor.middleName !== null ? investor.firstName + " " + investor.middleName + " " + investor.lastName : investor.firstName + " " + investor.lastName;
				investor.location = investor.location !== null ? investor.location : 'Not Set';
				investor.member_since = moment.tz(investor.member_since, moment.tz.guess()).format('DD MMM YYYY');
				investor.balance = accounting.formatMoney(investor.balance, "PhP ");
				return React.createElement(
					"tr",
					{ key: index, className: "text-center clickable-row", onClick: this.props.investorSelect.bind(null, investor.id) },
					React.createElement(
						"td",
						null,
						index + 1
					),
					React.createElement(
						"td",
						null,
						investor.fullName
					),
					React.createElement(
						"td",
						null,
						investor.location
					),
					React.createElement(
						"td",
						null,
						investor.member_since
					),
					React.createElement(
						"td",
						null,
						investor.balance
					)
				);
			}.bind(this));
		} else {
			rows = React.createElement(
				"tr",
				{ className: "text-center" },
				React.createElement(
					"td",
					{ colSpan: "6" },
					"No Investors Created. Try to add new one."
				)
			);
		}
		return React.createElement(
			"div",
			{ className: "col-md-10 col-md-offset-1" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					"Investor List",
					React.createElement(
						"div",
						{ className: "pull-right" },
						React.createElement(
							"div",
							{ className: "btn-group" },
							React.createElement(
								"button",
								{ type: "button", className: "btn btn-primary btn-xs", onClick: this.props.mainViewChange.bind(null, 'ADD') },
								"Add New Investor"
							)
						)
					)
				),
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"table",
						{ className: "table table-bordered table-striped table-condensed" },
						React.createElement(
							"thead",
							null,
							React.createElement(
								"tr",
								null,
								React.createElement(
									"th",
									{ className: "text-center" },
									"#"
								),
								React.createElement(
									"th",
									{ className: "text-center" },
									"Investor Name"
								),
								React.createElement(
									"th",
									{ className: "text-center" },
									"Location"
								),
								React.createElement(
									"th",
									{ className: "text-center" },
									"Member Since"
								),
								React.createElement(
									"th",
									{ className: "text-center" },
									"Balance"
								)
							)
						),
						React.createElement(
							"tbody",
							null,
							rows
						)
					)
				)
			)
		);
	}
});

/*=====  End of Investor Table View  ======*/

/*=========================================
=            Investor Add View            =
=========================================*/

var InvestAddView = React.createClass({
	displayName: "InvestAddView",

	getInitialState: function () {
		return {
			firstName: '',
			middleName: '',
			lastName: '',
			location: '',
			email: '',
			retries: 0,
			countries: undefined
		};
	},
	componentWillMount: function () {
		this.getCountryList();
	},
	getCountryList: function () {
		this.setState({ retries: this.state.retries + 1 });
		$.ajax({
			url: '/api/utilities/getCountryList',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (countries) {
				this.setState({
					retries: 0,
					countries: countries
				});
			}.bind(this),
			error: function () {
				if (this.state.retries <= 3) this.getCountryList();
			}.bind(this)
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var postData = {
			firstName: this.state.firstName.trim(),
			middleName: this.state.middleName.trim(),
			lastName: this.state.lastName.trim(),
			location: this.state.location,
			email: this.state.email.trim()
		};

		this.setState({
			firstName: postData.firstName,
			middleName: postData.middleName,
			lastName: postData.lastName,
			email: postData.email
		});

		this.props.modalViewChange('ADD-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/investment/saveInvestor',
			type: 'POST',
			dataType: 'json',
			data: postData,
			success: function () {
				this.props.modalViewChange('ADD-SUCCESS');
				this.props.mainViewChange('TABLE');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (response) {
				$("#InvestMessageContainerModal").modal('hide');
				if (response.status === 422) {
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				}
			}
		});
	},
	render: function () {
		var countryOptions;
		if (this.state.countries === undefined) {
			countryOptions = React.createElement(
				"option",
				{ disabled: true },
				"Please wait..."
			);
		} else {
			var counter = 0;
			countryOptions = $.map(this.state.countries, function (country, index) {
				return React.createElement(
					"option",
					{ key: ++counter, value: index },
					country
				);
			}.bind(this));
		}
		return React.createElement(
			"div",
			{ className: "col-md-6 col-md-offset-3" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					"Add New Investor"
				),
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-12" },
							React.createElement(
								"form",
								{ onSubmit: this.handleSubmit },
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"label",
										null,
										"Investor Name *"
									),
									React.createElement(
										"div",
										{ className: "form-group has-feedback", id: "fg-firstName" },
										React.createElement("input", {
											type: "text",
											id: "input-firstName",
											placeholder: "First Name *",
											className: "form-control",
											onChange: this.handleChange.bind(null, 'firstName') })
									),
									React.createElement(
										"div",
										{ className: "form-group" },
										React.createElement("input", {
											type: "text",
											placeholder: "Middle Name",
											className: "form-control",
											onChange: this.handleChange.bind(null, 'middleName') })
									),
									React.createElement(
										"div",
										{ className: "form-group has-feedback", id: "fg-lastName" },
										React.createElement("input", {
											type: "text",
											id: "input-lastName",
											placeholder: "Last Name *",
											className: "form-control",
											onChange: this.handleChange.bind(null, 'lastName') })
									)
								),
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"label",
										null,
										"Location *"
									),
									React.createElement(
										"select",
										{ className: "form-control", value: this.state.location, onChange: this.handleChange.bind(null, 'location'), disabled: this.state.countries === undefined },
										this.state.countries !== undefined ? React.createElement(
											"option",
											{ value: "", disabled: true },
											"Please select..."
										) : null,
										countryOptions
									)
								),
								React.createElement(
									"div",
									{ className: "form-group has-feedback", id: "fg-email" },
									React.createElement(
										"label",
										{ className: "control-label" },
										"Email Address *"
									),
									React.createElement("input", {
										type: "text",
										id: "input-email",
										placeholder: "someone@company.com",
										className: "form-control",
										onChange: this.handleChange.bind(null, 'email') })
								),
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"div",
										{ className: "pull-right" },
										React.createElement(
											"div",
											{ className: "btn-group" },
											React.createElement(
												"button",
												{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'TABLE') },
												"Cancel"
											),
											React.createElement(
												"button",
												{ type: "submit", className: "btn btn-primary" },
												"Create"
											)
										)
									)
								)
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Investor Add View  ======*/

/*===========================================
=            Invest Details View            =
===========================================*/

var InvestDetailView = React.createClass({
	displayName: "InvestDetailView",

	getInitialState: function () {
		return {
			detailView: 'PROFILE',
			profileData: undefined,
			investmentData: undefined,
			retries: 0
		};
	},
	componentWillMount: function () {
		this.getInvestorProfile(this.props.selectedInvestorId, this.state.retries);
		this.getInvestorInvestments(this.props.selectedInvestorId, this.state.retries);
	},
	sendEmailVerification: function (id) {
		this.props.modalViewChange('EMAIL-SENDING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';
		$.ajax({
			url: '/api/investment/sendEmailVerification',
			type: 'POST',
			data: { id: id },
			dataType: 'json',
			success: function (response) {
				this.props.modalViewChange('EMAIL-SENT');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				this.getInvestorProfile(this.props.selectedInvestorId, this.state.retries);
			}.bind(this),
			error: function () {
				this.props.modalViewChange('EMAIL-ERROR');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this)
		});
	},
	getInvestorProfile: function (id, retries) {
		this.setState({ retries: retries + 1 });
		$.ajax({
			url: '/api/investment/getInvestorProfile',
			type: 'POST',
			data: { id: id },
			dataType: 'json',
			cache: false,
			success: function (profileData) {
				this.setState({
					profileData: profileData,
					retries: 0
				});
			}.bind(this),
			error: function () {
				if (retries <= 3) this.getInvestorProfile(id, retries);
			}.bind(this)
		});
	},
	getInvestorInvestments: function (id, retries) {
		this.setState({ retries: retries + 1 });
		$.ajax({
			url: '/api/investment/getInvestorInvestments',
			type: 'POST',
			data: { id: id },
			dataType: 'json',
			cache: false,
			success: function (investmentData) {
				this.setState({
					investmentData: investmentData,
					retries: 0
				});
			}.bind(this),
			error: function () {
				if (retries <= 3) this.getInvestorInvestments(id, retries);
			}.bind(this)
		});
	},
	onDetailViewChange: function (detailViewKeyword) {
		this.setState({ detailView: detailViewKeyword });
	},
	render: function () {
		var view;
		if (this.state.detailView === 'PROFILE') {
			view = React.createElement(InvestProfileDetails, {
				profileData: this.state.profileData,
				mainViewChange: this.props.mainViewChange,
				sendEmailVerification: this.sendEmailVerification });
		} else if (this.state.detailView === 'INVESTMENT') {
			view = React.createElement(InvestInvestmentsDetails, {
				investmentData: this.state.investmentData,
				mainViewChange: this.props.mainViewChange });
		}
		return React.createElement(
			"div",
			{ className: "col-md-12" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-2 col-md-offset-1" },
					React.createElement(
						"div",
						{ className: "panel panel-default" },
						React.createElement(
							"div",
							{ className: "panel-body" },
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement("img", { src: "/images/profile_placeholder.jpg", width: "100%", className: "img-circle" })
							),
							React.createElement(
								"div",
								{ className: "list-group" },
								React.createElement(
									"button",
									{ type: "button",
										className: this.state.detailView === 'PROFILE' ? "list-group-item btn-xs active" : "list-group-item btn-xs",
										onClick: this.onDetailViewChange.bind(null, 'PROFILE') },
									"View Profile"
								),
								React.createElement(
									"button",
									{ type: "button",
										className: this.state.detailView === 'INVESTMENT' ? "list-group-item btn-xs active" : "list-group-item btn-xs",
										onClick: this.onDetailViewChange.bind(null, 'INVESTMENT') },
									"View Investments"
								)
							)
						)
					)
				),
				React.createElement(
					"div",
					{ className: "col-md-8" },
					view
				)
			)
		);
	}
});

/*=====  End of Invest Details View  ======*/

/*==============================================
=            Invest Investments Details            =
==============================================*/

var InvestInvestmentsDetails = React.createClass({
	displayName: "InvestInvestmentsDetails",

	render: function () {
		var investmentView;
		if (this.props.investmentData === undefined) {
			investmentView = React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-12" },
							React.createElement(
								"div",
								{ className: "text-center" },
								React.createElement("i", { className: "fa fa-circle-o-notch fa-spin fa-fw" }),
								" Loading Data..."
							)
						)
					)
				)
			);
		} else {
			investmentView = React.createElement(InvestAccountDetails, {
				investmentData: this.props.investmentData,
				mainViewChange: this.props.mainViewChange });
		}
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"div",
					{ className: "page-header" },
					React.createElement(
						"div",
						{ className: "pull-right" },
						React.createElement(
							"button",
							{ className: "btn btn-link btn-xs", onClick: this.props.mainViewChange.bind(null, 'TABLE') },
							"Back to Investor List"
						)
					),
					React.createElement(
						"h2",
						null,
						"Investment Details"
					)
				),
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-md-12" },
						investmentView
					)
				)
			)
		);
	}
});

/*----------  Invest SOA Details  ----------*/

var InvestAccountDetails = React.createClass({
	displayName: "InvestAccountDetails",

	render: function () {
		var SOA = React.createElement(
			"tr",
			{ className: "text-center" },
			React.createElement(
				"td",
				{ colSpan: "5" },
				"No Transactions Created."
			)
		);

		if (this.props.investmentData.length > 0) {
			SOA = this.props.investmentData.map(function (account, index) {
				account.transaction_date = moment(account.transaction_date).format('DD MMM YYYY');
				account.amount = accounting.formatNumber(account.amount, 2);
				account.runningBalance = accounting.formatNumber(account.runningBalance, 2);
				return React.createElement(
					"tr",
					{ key: index },
					React.createElement(
						"td",
						{ className: "text-center" },
						account.transaction_date
					),
					React.createElement(
						"td",
						{ className: "text-right" },
						account.transaction_type === 'DP' ? account.amount : null
					),
					React.createElement(
						"td",
						{ className: "text-right" },
						account.transaction_type === 'WD' ? account.amount : null
					),
					React.createElement(
						"td",
						{ className: "text-right" },
						account.transaction_type === 'DV' ? account.amount : null
					),
					React.createElement(
						"td",
						{ className: "text-right" },
						account.runningBalance
					)
				);
			}.bind(this));
		}
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Statement of Account",
				React.createElement(
					"div",
					{ className: "pull-right" },
					React.createElement(
						"div",
						{ className: "btn-group" },
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-default btn-xs", onClick: this.props.mainViewChange.bind(null, 'DEPOSIT') },
							"Deposit"
						),
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-default btn-xs", onClick: this.props.mainViewChange.bind(null, 'WITHDRAW') },
							"Withdraw"
						)
					)
				)
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"table",
					{ className: "table table-condensed table-striped table-bordered" },
					React.createElement(
						"thead",
						null,
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								{ className: "text-center" },
								"Date"
							),
							React.createElement(
								"th",
								{ className: "text-center" },
								"Deposit"
							),
							React.createElement(
								"th",
								{ className: "text-center" },
								"Withdraw"
							),
							React.createElement(
								"th",
								{ className: "text-center" },
								"Dividend"
							),
							React.createElement(
								"th",
								{ className: "text-center" },
								"Balance"
							)
						)
					),
					React.createElement(
						"tbody",
						null,
						SOA
					)
				)
			)
		);
	}
});

/*=====  End of Invest Account Details  ======*/

/*==============================================
=            Invest Profile Details            =
==============================================*/

var InvestProfileDetails = React.createClass({
	displayName: "InvestProfileDetails",

	render: function () {
		var profileView;
		if (this.props.profileData === undefined) {
			profileView = React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-12" },
							React.createElement(
								"div",
								{ className: "text-center" },
								React.createElement("i", { className: "fa fa-circle-o-notch fa-spin fa-fw" }),
								" Loading Data..."
							)
						)
					)
				)
			);
		} else {
			profileView = React.createElement(ProfileUserCredentials, {
				profileData: this.props.profileData,
				sendEmailVerification: this.props.sendEmailVerification });
		}
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"div",
					{ className: "page-header" },
					React.createElement(
						"div",
						{ className: "pull-right" },
						React.createElement(
							"button",
							{ className: "btn btn-link btn-xs", onClick: this.props.mainViewChange.bind(null, 'TABLE') },
							"Back to Investor List"
						)
					),
					React.createElement(
						"h2",
						null,
						"Investor Profile"
					)
				),
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-md-12" },
						profileView
					)
				)
			)
		);
	}
});

/*----------  Invest Profile User Credentials  ----------*/

var ProfileUserCredentials = React.createClass({
	displayName: "ProfileUserCredentials",

	componentDidMount: function () {
		if (typeof $("#email-verification-warning-icon").prop('tagName') !== typeof undefined) {
			$("#email-verification-warning-icon").popover({ trigger: 'hover', content: 'Email Address not yet verified.', placement: 'top' });
		}

		if (typeof $("#email-verified-icon").prop('tagName') !== typeof undefined) {
			$("#email-verified-icon").popover({ trigger: 'hover', content: 'Email Address verified.', placement: 'top' });
		}
	},
	render: function () {
		var user = this.props.profileData.user;
		var investor = this.props.profileData.investor;
		investor.fullName = investor.middleName !== null ? investor.firstName + " " + investor.middleName + " " + investor.lastName : investor.firstName + " " + investor.lastName;

		var sendEmailButton = user.is_verified ? null : React.createElement(
			"button",
			{ type: "button", className: "btn btn-link btn-xs", onClick: this.props.sendEmailVerification.bind(null, investor.id) },
			user.verification_code ? "Send Email Verification" : "Resend Email Verification"
		);

		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"User Credentials",
				React.createElement(
					"div",
					{ className: "pull-right" },
					sendEmailButton
				)
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"table",
					{ className: "table table-condensed table-striped table-bordered" },
					React.createElement(
						"tbody",
						null,
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "table-title-col" },
								"Name"
							),
							React.createElement(
								"td",
								null,
								investor.fullName
							)
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "table-title-col" },
								"Email Address"
							),
							React.createElement(
								"td",
								null,
								user.email,
								" ",
								user.is_verified ? React.createElement("i", { className: "fa fa-check-circle green-bg", id: "email-verified-icon" }) : React.createElement("i", { className: "fa fa-exclamation-triangle orange-bg", id: "email-verification-warning-icon" })
							)
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "table-title-col" },
								"User Name"
							),
							React.createElement(
								"td",
								null,
								user.username === null ? "Username not set." : user.username
							)
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "table-title-col" },
								"Password"
							),
							React.createElement(
								"td",
								null,
								user.has_password ? '******' : 'Password not set.'
							)
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "table-title-col" },
								"Status"
							),
							React.createElement(
								"td",
								null,
								user.is_active ? 'Online' : 'Locked'
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Invest Profile Details  ======*/

/*======================================
=            Invest Deposit            =
======================================*/

var InvestDepositForm = React.createClass({
	displayName: "InvestDepositForm",

	getInitialState: function () {
		return {
			depositDate: moment().format('MM/DD/YYYY'),
			depositAmount: "0.00",
			notes: ''
		};
	},
	componentDidMount: function () {
		var self = this;
		$("#datetimepicker-depositDate").datepicker({
			autoclose: true
		}).on('changeDate', function (e) {
			self.setState({ depositDate: e.date });
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange('DEPOSIT-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.selectedInvestorId,
			depositDate: this.state.depositDate,
			depositAmount: accounting.unformat(this.state.depositAmount),
			notes: this.state.notes
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/transaction/deposit',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				this.props.modalViewChange('DEPOSIT-SUCCESS');
				this.props.mainViewChange('DETAILS');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (response) {
				if (response.status === 422) {
					$("#InvestMessageContainerModal").modal('hide');
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				} else {
					this.props.modalViewChange('DEPOSIT-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	amountBlurred: function () {
		this.setState({ depositAmount: accounting.formatNumber(this.state.depositAmount, 2) });
	},
	amountFocused: function () {
		this.setState({ depositAmount: accounting.unformat(this.state.depositAmount) });
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-4 col-md-offset-4" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					"Deposit Investment"
				),
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-12" },
							React.createElement(
								"form",
								{ onSubmit: this.handleSubmit },
								React.createElement(
									"div",
									{ className: "form-group has-feedback", id: "fg-depositDate" },
									React.createElement(
										"label",
										{ className: "control-label", htmlFor: "input-depositDate" },
										"Date Deposit"
									),
									React.createElement(
										"div",
										{ className: "input-group date", id: "datetimepicker-depositDate" },
										React.createElement("input", {
											type: "text",
											id: "input-depositDate",
											className: "form-control",
											size: "16",
											value: this.state.depositDate,
											onChange: this.handleChange.bind(null, 'depositDate') }),
										React.createElement(
											"span",
											{ className: "input-group-addon" },
											React.createElement("span", { className: "glyphicon glyphicon-calendar" })
										)
									)
								),
								React.createElement(
									"div",
									{ className: "form-group", id: "fg-depositAmount" },
									React.createElement(
										"label",
										{ className: "control-label", htmlFor: "input-depositAmount" },
										"Amount Deposit"
									),
									React.createElement(
										"div",
										{ className: "input-group" },
										React.createElement(
											"span",
											{ className: "input-group-addon" },
											React.createElement(
												"span",
												null,
												"Php"
											)
										),
										React.createElement("input", {
											type: "text",
											id: "input-depositAmount",
											className: "form-control text-right",
											value: this.state.depositAmount,
											onFocus: this.amountFocused,
											onBlur: this.amountBlurred,
											onChange: this.handleChange.bind(null, 'depositAmount') })
									)
								),
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"label",
										null,
										"Notes/Reason ",
										React.createElement(
											"small",
											null,
											"(optional)"
										)
									),
									React.createElement("textarea", {
										className: "form-control",
										rows: "5",
										value: this.state.notes,
										onChange: this.handleChange.bind(null, 'notes') })
								),
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"div",
										{ className: "pull-right" },
										React.createElement(
											"div",
											{ className: "btn-group" },
											React.createElement(
												"button",
												{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'DETAILS') },
												"Cancel"
											),
											React.createElement(
												"button",
												{ type: "submit", className: "btn btn-primary" },
												"Add Deposit"
											)
										)
									)
								)
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Invest Deposit  ======*/

/*=======================================
=            Invest Withdraw            =
=======================================*/

var InvestWithdrawForm = React.createClass({
	displayName: "InvestWithdrawForm",

	getInitialState: function () {
		return {
			withdrawDate: moment().format('MM/DD/YYYY'),
			withdrawAmount: "0.00",
			notes: ''
		};
	},
	componentDidMount: function () {
		var self = this;
		$("#datetimepicker-withdrawDate").datepicker({
			autoclose: true
		}).on('changeDate', function (e) {
			self.setState({ withdrawDate: e.date });
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange('WITHDRAW-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.selectedInvestorId,
			withdrawDate: this.state.withdrawDate,
			withdrawAmount: accounting.unformat(this.state.withdrawAmount),
			notes: this.state.notes
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/transaction/withdraw',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				this.props.modalViewChange('WITHDRAW-SUCCESS');
				this.props.mainViewChange('DETAILS');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (response) {
				if (response.status === 422) {
					$("#InvestMessageContainerModal").modal('hide');
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				} else {
					this.props.modalViewChange('WITHDRAW-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	amountBlurred: function () {
		this.setState({ withdrawAmount: accounting.formatNumber(this.state.withdrawAmount, 2) });
	},
	amountFocused: function () {
		this.setState({ withdrawAmount: accounting.unformat(this.state.withdrawAmount) });
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-4 col-md-offset-4" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					"Withdraw Investment"
				),
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"form",
							{ onSubmit: this.handleSubmit },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement(
									"div",
									{ className: "form-group has-feedback", id: "fg-withdrawDate" },
									React.createElement(
										"label",
										{ className: "control-label", htmlFor: "input-withdrawDate" },
										"Date Withdraw"
									),
									React.createElement(
										"div",
										{ className: "input-group date", id: "datetimepicker-withdrawDate" },
										React.createElement("input", {
											type: "text",
											id: "input-withdrawDate",
											className: "form-control",
											size: "16",
											value: this.state.withdrawDate,
											onChange: this.handleChange.bind(null, 'withdrawDate') }),
										React.createElement(
											"span",
											{ className: "input-group-addon" },
											React.createElement("span", { className: "glyphicon glyphicon-calendar" })
										)
									)
								),
								React.createElement(
									"div",
									{ className: "form-group", id: "fg-withdrawAmount" },
									React.createElement(
										"label",
										{ className: "control-label", htmlFor: "input-withdrawAmount" },
										"Amount Withdraw"
									),
									React.createElement(
										"div",
										{ className: "input-group" },
										React.createElement(
											"span",
											{ className: "input-group-addon" },
											React.createElement(
												"span",
												null,
												"Php"
											)
										),
										React.createElement("input", {
											type: "text",
											id: "input-withdrawAmount",
											className: "form-control text-right",
											value: this.state.withdrawAmount,
											onFocus: this.amountFocused,
											onBlur: this.amountBlurred,
											onChange: this.handleChange.bind(null, 'withdrawAmount') })
									)
								),
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"label",
										null,
										"Notes/Reason ",
										React.createElement(
											"small",
											null,
											"(optional)"
										)
									),
									React.createElement("textarea", {
										className: "form-control",
										rows: "5",
										value: this.state.notes,
										onChange: this.handleChange.bind(null, 'notes') })
								),
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"div",
										{ className: "pull-right" },
										React.createElement(
											"div",
											{ className: "btn-group" },
											React.createElement(
												"button",
												{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'DETAILS') },
												"Cancel"
											),
											React.createElement(
												"button",
												{ type: "submit", className: "btn btn-primary" },
												"Add Withdrawal"
											)
										)
									)
								)
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Invest Withdraw  ======*/

/*=============================================
=            Invest Message Modals            =
=============================================*/

var InvestMessageContainerModal = React.createClass({
	displayName: "InvestMessageContainerModal",

	render: function () {
		var modalMessageComponent;
		var modalView = this.props.modalView;
		switch (modalView) {
			case 'ADD-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Saving New Investor"
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"p",
										{ className: "text-center" },
										React.createElement("i", { className: "fa fa-circle-o-notch fa-2x fa-spin" })
									),
									React.createElement(
										"p",
										{ className: "text-center" },
										"Please wait a moment."
									)
								)
							)
						)
					)
				);
				break;

			case 'ADD-SUCCESS':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-success" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement("i", { className: "fa fa-check-circle fa-fw" }),
								" New Investor Added.",
								React.createElement(
									"button",
									{ className: "close", "data-dismiss": "modal" },
									"×"
								)
							)
						)
					)
				);
				break;

			case 'EMAIL-SENDING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Sending Email Verification"
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"p",
										{ className: "text-center" },
										React.createElement("i", { className: "fa fa-circle-o-notch fa-2x fa-spin" })
									),
									React.createElement(
										"p",
										{ className: "text-center" },
										"Please wait a moment."
									)
								)
							)
						)
					)
				);
				break;

			case 'EMAIL-SENT':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-success" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement("i", { className: "fa fa-check-circle fa-fw" }),
								" Email Verification Sent.",
								React.createElement(
									"button",
									{ className: "close", "data-dismiss": "modal" },
									"×"
								)
							)
						)
					)
				);
				break;

			case 'EMAIL-ERROR':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-error" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement("i", { className: "fa fa-check-circle fa-fw" }),
								" Email Verification not sent. Please try again.",
								React.createElement(
									"button",
									{ className: "close", "data-dismiss": "modal" },
									"×"
								)
							)
						)
					)
				);
				break;

			case 'DEPOSIT-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Saving Deposit"
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"p",
										{ className: "text-center" },
										React.createElement("i", { className: "fa fa-circle-o-notch fa-2x fa-spin" })
									),
									React.createElement(
										"p",
										{ className: "text-center" },
										"Please wait a moment."
									)
								)
							)
						)
					)
				);
				break;

			case 'DEPOSIT-SUCCESS':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-success" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement("i", { className: "fa fa-check-circle fa-fw" }),
								" New Deposit Added.",
								React.createElement(
									"button",
									{ className: "close", "data-dismiss": "modal" },
									"×"
								)
							)
						)
					)
				);
				break;

			case 'DEPOSIT-ERROR':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-error" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement("i", { className: "fa fa-check-circle fa-fw" }),
								" Deposit not saved. Please try again.",
								React.createElement(
									"button",
									{ className: "close", "data-dismiss": "modal" },
									"×"
								)
							)
						)
					)
				);
				break;

			case 'WITHDRAW-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Saving Withdrawal"
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"p",
										{ className: "text-center" },
										React.createElement("i", { className: "fa fa-circle-o-notch fa-2x fa-spin" })
									),
									React.createElement(
										"p",
										{ className: "text-center" },
										"Please wait a moment."
									)
								)
							)
						)
					)
				);
				break;

			case 'WITHDRAW-SUCCESS':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-success" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement("i", { className: "fa fa-check-circle fa-fw" }),
								" New Withdrawal Added.",
								React.createElement(
									"button",
									{ className: "close", "data-dismiss": "modal" },
									"×"
								)
							)
						)
					)
				);
				break;

			case 'WITHDRAW-ERROR':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-error" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "row" },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement("i", { className: "fa fa-check-circle fa-fw" }),
								" Withdrawal not saved. Please try again.",
								React.createElement(
									"button",
									{ className: "close", "data-dismiss": "modal" },
									"×"
								)
							)
						)
					)
				);
				break;

		}
		return React.createElement(
			"div",
			{ className: "modal fade", id: "InvestMessageContainerModal", role: "dialog" },
			React.createElement(
				"div",
				{ className: "modal-dialog", role: "document" },
				modalMessageComponent
			)
		);
	}
});

/*=====  End of Invest Message Modals  ======*/

/*===================================
=            Invest Main            =
===================================*/

var InvestMain = React.createClass({
	displayName: "InvestMain",

	getInitialState: function () {
		return {
			investors: undefined,
			retries: 0,
			mainView: undefined,
			modalView: undefined,
			selectedInvestorId: undefined
		};
	},
	componentWillMount: function () {
		this.getInvestors(this.state.retries);
	},
	getInvestors: function (retries) {
		this.setState({ retries: this.state.retries + 1 });
		$.ajax({
			url: '/api/investment/getInvestors',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (investors) {
				this.setState({
					investors: investors,
					retries: 0
				});
			}.bind(this),
			error: function () {
				if (this.state.retries <= 3) this.getInvestors(this.state.retries);
			}.bind(this)
		});
	},
	onInvestorSelect: function (id) {
		this.setState({
			selectedInvestorId: id,
			mainView: 'DETAILS'
		});
	},
	onMainViewChange: function (mainViewKeyword) {
		if (mainViewKeyword === 'TABLE') {
			this.setState({ investors: undefined });
			this.getInvestors();
		}
		this.setState({ mainView: mainViewKeyword });
	},
	onModalViewChange: function (modalViewKeyword) {
		this.setState({ modalView: modalViewKeyword });
	},
	render: function () {
		var view;
		switch (this.state.mainView) {
			case 'ADD':
				view = React.createElement(InvestAddView, {
					modalViewChange: this.onModalViewChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'DETAILS':
				view = React.createElement(InvestDetailView, {
					selectedInvestorId: this.state.selectedInvestorId,
					modalViewChange: this.onModalViewChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'DEPOSIT':
				view = React.createElement(InvestDepositForm, {
					selectedInvestorId: this.state.selectedInvestorId,
					modalViewChange: this.onModalViewChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'WITHDRAW':
				view = React.createElement(InvestWithdrawForm, {
					selectedInvestorId: this.state.selectedInvestorId,
					modalViewChange: this.onModalViewChange,
					mainViewChange: this.onMainViewChange });
				break;

			default:
				view = React.createElement(InvestTableView, {
					investors: this.state.investors,
					investorSelect: this.onInvestorSelect,
					mainViewChange: this.onMainViewChange });
				break;
		}
		return React.createElement(
			"div",
			{ className: "row" },
			view,
			React.createElement(InvestMessageContainerModal, { modalView: this.state.modalView })
		);
	}
});

/*=====  End of Invest Main  ======*/

if (typeof $("#invest-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(InvestMain, null), document.getElementById('invest-app-node'));
}