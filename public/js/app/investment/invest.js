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
				investor.country = investor.country !== null ? investor.country : 'Not Set';
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
						investor.country
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
			country: '',
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
			country: this.state.country,
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
										"Country"
									),
									React.createElement(
										"select",
										{ className: "form-control", value: this.state.country, onChange: this.handleChange.bind(null, 'country'), disabled: this.state.countries === undefined },
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
			profileRetries: 0,
			investmentRetries: 0,
			retries: 0
		};
	},
	componentWillMount: function () {
		this.getInvestorProfile(this.props.selectedInvestorId, this.state.profileRetries);
		this.getInvestorInvestments(this.props.selectedInvestorId, this.state.investmentRetries);
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
				if (response.status === 'success') this.props.modalViewChange('EMAIL-SENT');else if (response.status === 'validated') this.props.modalViewChange('EMAIL-VALIDATED');
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
	getInvestorProfile: function (id, profileRetries) {
		this.setState({ profileRetries: profileRetries + 1 });
		$.ajax({
			url: '/api/investment/getInvestorProfile',
			type: 'POST',
			data: { id: id },
			dataType: 'json',
			cache: false,
			success: function (profileData) {
				this.setState({
					profileData: profileData,
					profileRetries: 0
				});
			}.bind(this),
			error: function () {
				if (profileRetries <= 3) this.getInvestorProfile(id, profileRetries);
			}.bind(this)
		});
	},
	getInvestorInvestments: function (id, investmentRetries) {
		this.setState({ investmentRetries: investmentRetries + 1 });
		$.ajax({
			url: '/api/investment/getInvestorInvestments',
			type: 'POST',
			data: { id: id },
			dataType: 'json',
			cache: false,
			success: function (investmentData) {
				this.setState({
					investmentData: investmentData,
					investmentRetries: 0
				});
			}.bind(this),
			error: function () {
				if (investmentRetries <= 3) this.getInvestorInvestments(id, investmentRetries);
			}.bind(this)
		});
	},
	onProfileDataChange: function () {
		this.getInvestorProfile(this.props.selectedInvestorId, this.state.profileRetries);
	},
	onInvestmentDataChange: function () {
		this.getInvestorInvestments(this.props.selectedInvestorId, this.state.investmentRetries);
	},
	onDetailViewChange: function (detailViewKeyword) {
		this.setState({ detailView: detailViewKeyword });
	},
	render: function () {
		var view;
		if (this.state.detailView === 'PROFILE') {
			view = React.createElement(InvestProfileDetails, {
				profileData: this.state.profileData,
				profileDataChange: this.onProfileDataChange,
				modalViewChange: this.props.modalViewChange,
				mainViewChange: this.props.mainViewChange,
				sendEmailVerification: this.sendEmailVerification });
		} else if (this.state.detailView === 'INVESTMENT') {
			view = React.createElement(InvestInvestmentsDetails, {
				selectedInvestorId: this.props.selectedInvestorId,
				investmentData: this.state.investmentData,
				investmentDataChange: this.onInvestmentDataChange,
				modalViewChange: this.props.modalViewChange,
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

	getInitialState: function () {
		return {
			investmentView: undefined,
			selectedTransactionId: undefined
		};
	},
	onInvestmentViewChange: function (investmentViewKeyword) {
		this.setState({ investmentView: investmentViewKeyword });
	},
	onTransactionSelect: function (id) {
		this.setState({
			selectedTransactionId: id,
			investmentView: 'DETAILS'
		});
	},
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
			switch (this.state.investmentView) {
				case 'TRANSACTION':
					investmentView = React.createElement(InvestTransactionForm, {
						selectedInvestorId: this.props.selectedInvestorId,
						investmentDataChange: this.props.investmentDataChange,
						investmentViewChange: this.onInvestmentViewChange,
						modalViewChange: this.props.modalViewChange });
					break;

				case 'DETAILS':
					investmentView = React.createElement(InvestTransactionDetails, {
						selectedTransactionId: this.state.selectedTransactionId,
						modalViewChange: this.props.modalViewChange,
						investmentDataChange: this.props.investmentDataChange,
						investmentViewChange: this.onInvestmentViewChange });
					break;

				default:
					investmentView = React.createElement(InvestAccountDetails, {
						investmentData: this.props.investmentData,
						investmentViewChange: this.onInvestmentViewChange,
						transactionSelect: this.onTransactionSelect,
						mainViewChange: this.props.mainViewChange });
					break;
			}
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
				account.transactionDate = moment(account.transactionDate).format('DD MMM YYYY');
				account.amount = accounting.formatNumber(account.amount, 2);
				account.runningBalance = accounting.formatNumber(account.runningBalance, 2);
				return React.createElement(
					"tr",
					{ key: index, className: "clickable-row", onClick: this.props.transactionSelect.bind(null, account.id) },
					React.createElement(
						"td",
						{ className: "text-center" },
						account.transactionDate
					),
					React.createElement(
						"td",
						{ className: "text-center" },
						account.transaction_type_id
					),
					React.createElement(
						"td",
						{ className: "text-right" },
						account.transaction_type.account_type === 'DR' ? account.amount : null
					),
					React.createElement(
						"td",
						{ className: "text-right" },
						account.transaction_type.account_type === 'CR' ? account.amount : null
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
							{ type: "button", className: "btn btn-link btn-xs", onClick: this.props.investmentViewChange.bind(null, 'TRANSACTION') },
							"Add New Transaction"
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
								"TC"
							),
							React.createElement(
								"th",
								{ className: "text-center" },
								"Debit"
							),
							React.createElement(
								"th",
								{ className: "text-center" },
								"Credit"
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

/*----------  Invest Transaction Form  ----------*/

var InvestTransactionForm = React.createClass({
	displayName: "InvestTransactionForm",

	getInitialState: function () {
		return {
			transactionTypes: undefined,
			transactionDate: moment().format('MM/DD/YYYY'),
			amount: '0.00',
			transaction_type_id: '',
			notes: ''
		};
	},
	componentWillMount: function () {
		this.getTransactionTypes();
	},
	componentDidMount: function () {
		var self = this;
		$("#datepicker-transactionDate").datepicker({
			autoclose: true
		}).on('changeDate', function (e) {
			self.setState({ transactionDate: moment(e.date).format('MM/DD/YYYY') });
		});
	},
	getTransactionTypes: function () {
		$.ajax({
			url: '/api/transaction/getTransactionTypes',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (types) {
				this.setState({ transactionTypes: types });
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

		this.props.modalViewChange('TRANSACTION-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.selectedInvestorId,
			transactionDate: this.state.transactionDate,
			amount: accounting.unformat(this.state.amount),
			transaction_type_id: this.state.transaction_type_id,
			notes: this.state.notes
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/transaction/saveTransaction',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.modalViewChange('TRANSACTION-SUCCESS');
				this.props.investmentDataChange();
				this.props.investmentViewChange(undefined);
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
					this.props.modalViewChange('TRANSACTION-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	amountBlurred: function () {
		this.setState({ amount: accounting.formatNumber(this.state.amount, 2) });
	},
	amountFocused: function () {
		this.setState({ amount: accounting.unformat(this.state.amount) });
	},
	render: function () {
		var transactionTypeOptions;
		if (this.state.transactionTypes !== undefined) {
			transactionTypeOptions = this.state.transactionTypes.map(function (type, index) {
				return React.createElement(
					"option",
					{ key: index, value: type.id },
					type.description
				);
			}.bind(this));
		}
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Add New Transaction"
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-md-6 col-md-offset-3" },
						React.createElement(
							"form",
							{ onSubmit: this.handleSubmit },
							React.createElement(
								"div",
								{ className: "form-group", id: "fg-transactionDate" },
								React.createElement(
									"label",
									{ className: "control-label", htmlFor: "input-transactionDate" },
									"Transaction Date"
								),
								React.createElement(
									"div",
									{ className: "input-group date", id: "datepicker-transactionDate" },
									React.createElement("input", {
										type: "text",
										className: "form-control",
										id: "input-transactionDate",
										value: this.state.transactionDate,
										onChange: this.handleChange.bind(null, 'transactionDate') }),
									React.createElement(
										"span",
										{ className: "input-group-addon" },
										React.createElement("span", { className: "glyphicon glyphicon-calendar" })
									)
								)
							),
							React.createElement(
								"div",
								{ className: "form-group", id: "fg-amount" },
								React.createElement(
									"label",
									{ className: "control-label", htmlFor: "input-amount" },
									"Amount"
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
										className: "form-control text-right",
										id: "input-amount",
										value: this.state.amount,
										onFocus: this.amountFocused,
										onBlur: this.amountBlurred,
										onChange: this.handleChange.bind(null, 'amount') })
								)
							),
							React.createElement(
								"div",
								{ className: "form-group", id: "fg-transaction_type_id" },
								React.createElement(
									"label",
									{ className: "control-label", htmlFor: "input-transaction_type_id" },
									"Transaction Type"
								),
								React.createElement(
									"select",
									{
										className: "form-control",
										id: "input-transaction_type_id",
										value: this.state.transaction_type_id,
										disabled: this.state.transactionTypes === undefined,
										onChange: this.handleChange.bind(null, 'transaction_type_id') },
									React.createElement(
										"option",
										{ value: "", disabled: true },
										"Please select..."
									),
									transactionTypeOptions
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
											{ type: "button", className: "btn btn-default", onClick: this.props.investmentViewChange.bind(null, undefined) },
											"Cancel"
										),
										React.createElement(
											"button",
											{ type: "submit", className: "btn btn-primary" },
											"Save Transaction"
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

/*----------  Invest View Transaction Details  ----------*/

var InvestTransactionDetails = React.createClass({
	displayName: "InvestTransactionDetails",

	getInitialState: function () {
		return {
			transactionTypes: undefined,
			transactionDetails: undefined,
			transactionDate: moment().format('MM/DD/YYYY'),
			amount: '0.00',
			transaction_type_id: '',
			notes: '',
			editMode: false

		};
	},
	componentWillMount: function () {
		this.getTransactionDetails();
		this.getTransactionTypes();
	},
	getTransactionDetails: function () {
		$.ajax({
			url: '/api/transaction/getTransactionDetails',
			type: 'POST',
			data: { id: this.props.selectedTransactionId },
			dataType: 'json',
			cache: false,
			success: function (transaction) {
				this.setState({
					transactionDetails: transaction,
					transactionDate: moment(transaction.transactionDate).format("MM/DD/YYYY"),
					amount: accounting.formatNumber(transaction.amount, 2),
					transaction_type_id: transaction.transaction_type_id,
					notes: transaction.notes
				});
			}.bind(this)
		});
	},
	getTransactionTypes: function () {
		$.ajax({
			url: '/api/transaction/getTransactionTypes',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (types) {
				this.setState({ transactionTypes: types });
			}.bind(this)
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);

		var transactionDetails = this.state.transactionDetails;

		if (this.state.transactionDate == transactionDetails.transactionDate && this.state.amount == transactionDetails.amount && this.state.transaction_type_id == transactionDetails.transaction_type_id && this.state.notes == transactionDetails.notes) this.setState({ editMode: false });else this.setState({ editMode: true });
	},
	handleSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange('UPDATE-TRANSACTION-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.selectedTransactionId,
			transactionDate: this.state.transactionDate,
			amount: accounting.unformat(this.state.amount),
			transaction_type_id: this.state.transaction_type_id,
			notes: this.state.notes
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/transaction/updateTransaction',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.modalViewChange('UPDATE-TRANSACTION-SUCCESS');
				this.props.investmentDataChange();
				this.props.investmentViewChange(undefined);
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
					this.props.modalViewChange('UPDATE-TRANSACTION-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	amountBlurred: function () {
		this.setState({ amount: accounting.formatNumber(this.state.amount, 2) });
	},
	amountFocused: function () {
		this.setState({ amount: accounting.unformat(this.state.amount) });
	},
	render: function () {
		var transactionTypeOptions;
		if (this.state.transactionTypes !== undefined) {
			transactionTypeOptions = this.state.transactionTypes.map(function (type, index) {
				return React.createElement(
					"option",
					{ key: index, value: type.id },
					type.description
				);
			}.bind(this));
		}
		var view;
		if (this.state.transactionDetails === undefined) {
			view = React.createElement(
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
			view = React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-6 col-md-offset-3" },
					React.createElement(
						"form",
						{ onSubmit: this.handleSubmit },
						React.createElement(
							"div",
							{ className: "form-group", id: "fg-transactionDate" },
							React.createElement(
								"label",
								{ className: "control-label", htmlFor: "input-transactionDate" },
								"Transaction Date"
							),
							React.createElement(
								"div",
								{ className: "input-group date", id: "datepicker-transactionDate" },
								React.createElement("input", {
									type: "text",
									className: "form-control",
									id: "input-transactionDate",
									value: this.state.transactionDate,
									onChange: this.handleChange.bind(null, 'transactionDate') }),
								React.createElement(
									"span",
									{ className: "input-group-addon" },
									React.createElement("span", { className: "glyphicon glyphicon-calendar" })
								)
							)
						),
						React.createElement(
							"div",
							{ className: "form-group", id: "fg-amount" },
							React.createElement(
								"label",
								{ className: "control-label", htmlFor: "input-amount" },
								"Amount"
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
									className: "form-control text-right",
									id: "input-amount",
									value: this.state.amount,
									onFocus: this.amountFocused,
									onBlur: this.amountBlurred,
									onChange: this.handleChange.bind(null, 'amount') })
							)
						),
						React.createElement(
							"div",
							{ className: "form-group", id: "fg-transaction_type_id" },
							React.createElement(
								"label",
								{ className: "control-label", htmlFor: "input-transaction_type_id" },
								"Transaction Type"
							),
							React.createElement(
								"select",
								{
									className: "form-control",
									id: "input-transaction_type_id",
									value: this.state.transaction_type_id,
									disabled: this.state.transactionTypes === undefined,
									onChange: this.handleChange.bind(null, 'transaction_type_id') },
								React.createElement(
									"option",
									{ value: "", disabled: true },
									"Please select..."
								),
								transactionTypeOptions
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
										{ type: "button", className: "btn btn-default", onClick: this.props.investmentViewChange.bind(null, undefined) },
										"Cancel"
									),
									React.createElement(
										"button",
										{
											type: "submit",
											className: "btn btn-primary",
											disabled: !this.state.editMode },
										"Update Transaction"
									)
								)
							)
						)
					)
				)
			);
		}
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Transaction Details",
				React.createElement(
					"div",
					{ className: "pull-right" },
					React.createElement(
						"button",
						{ className: "btn btn-link btn-xs" },
						"Edit Details"
					)
				)
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				view
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

	getInitialState: function () {
		return {
			profileView: undefined
		};
	},
	onProfileViewChange: function (profileViewKeyword) {
		this.setState({ profileView: profileViewKeyword });
	},
	render: function () {
		var view;
		if (this.props.profileData === undefined) {
			view = React.createElement(
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
			switch (this.state.profileView) {
				case 'PROFILE-MANAGE':
					view = React.createElement(ManageProfileUserCredentials, {
						profileData: this.props.profileData,
						profileDataChange: this.props.profileDataChange,
						modalViewChange: this.props.modalViewChange,
						profileViewChange: this.onProfileViewChange });
					break;

				default:
					view = React.createElement(ProfileUserCredentials, {
						profileData: this.props.profileData,
						profileViewChange: this.onProfileViewChange,
						sendEmailVerification: this.props.sendEmailVerification });
					break;
			}
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
						view
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
					React.createElement(
						"button",
						{ type: "button", className: "btn btn-link btn-xs", onClick: this.props.profileViewChange.bind(null, 'PROFILE-MANAGE') },
						"Manage User Credentials"
					),
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

/*----------  Manage Profile User Credentials  ----------*/

var ManageProfileUserCredentials = React.createClass({
	displayName: "ManageProfileUserCredentials",

	getInitialState: function () {
		return {
			email: '',
			username: '',
			password: '',
			confirmPassword: ''
		};
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmitEmail: function (e) {
		e.preventDefault();

		this.props.modalViewChange('CHANGE-EMAIL-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.profileData.user.id,
			email: this.state.email.trim()
		};

		this.setState({
			email: postData.email
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investment/updateEmailAddress',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if (response.status === 'success') {
					this.props.profileDataChange();
					this.props.modalViewChange('CHANGE-EMAIL-SAVED');
					this.setState({
						email: '',
						username: '',
						password: '',
						confirmPassword: ''
					});
				} else if (response.status === 'unchanged') {
					this.props.modalViewChange('CHANGE-EMAIL-UNCHANGED');
				}
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
					this.props.modalViewChange('CHANGE-EMAIL-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	handleSubmitUsername: function (e) {
		e.preventDefault();

		this.props.modalViewChange('CHANGE-USERNAME-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.profileData.user.id,
			username: this.state.username.trim()
		};

		this.setState({
			username: postData.username
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investment/updateUsername',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if (response.status === 'success') {
					this.props.profileDataChange();
					this.props.modalViewChange('CHANGE-USERNAME-SAVED');
					this.setState({
						email: '',
						username: '',
						password: '',
						confirmPassword: ''
					});
				} else if (response.status === 'unchanged') {
					this.props.modalViewChange('CHANGE-USERNAME-UNCHANGED');
				}
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
					this.props.modalViewChange('CHANGE-USERNAME-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	handleSubmitPassword: function (e) {
		e.preventDefault();

		this.props.modalViewChange('CHANGE-PASSWORD-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.profileData.user.id,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investment/updatePassword',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if (response.status === 'success') {
					this.props.profileDataChange();
					this.props.modalViewChange('CHANGE-PASSWORD-SAVED');
					this.setState({
						email: '',
						username: '',
						password: '',
						confirmPassword: ''
					});
				}
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
					this.props.modalViewChange('CHANGE-PASSWORD-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Manage User Credentials",
				React.createElement(
					"div",
					{ className: "pull-right" },
					React.createElement(
						"button",
						{ type: "button", className: "close", onClick: this.props.profileViewChange.bind(null, undefined) },
						"×"
					)
				)
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"div",
					{ className: "page-header" },
					React.createElement(
						"h2",
						null,
						"Edit E-mail Address"
					)
				),
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-md-6" },
						React.createElement(
							"form",
							{ onSubmit: this.handleSubmitEmail },
							React.createElement(
								"div",
								{ className: "form-group", id: "fg-email" },
								React.createElement(
									"label",
									{ className: "control-label", htmlFor: "input-email" },
									"New Email Address"
								),
								React.createElement("input", {
									type: "text",
									className: "form-control",
									id: "input-email",
									value: this.state.email,
									placeholder: this.props.profileData.user.email,
									onChange: this.handleChange.bind(null, 'email') })
							),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"button",
									{ type: "submit", className: "btn btn-primary" },
									"Update Email Address"
								)
							)
						)
					)
				),
				React.createElement(
					"div",
					{ className: "page-header" },
					React.createElement(
						"h2",
						null,
						"Edit Username"
					)
				),
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-md-6" },
						React.createElement(
							"form",
							{ onSubmit: this.handleSubmitUsername },
							React.createElement(
								"div",
								{ className: "form-group", id: "fg-username" },
								React.createElement(
									"label",
									{ className: "control-label", htmlFor: "input-username" },
									"New Username"
								),
								React.createElement("input", {
									type: "text",
									className: "form-control",
									id: "input-username",
									value: this.state.username,
									placeholder: this.props.profileData.user.username === null ? 'Username not set.' : this.props.profileData.user.username === null,
									onChange: this.handleChange.bind(null, 'username') })
							),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"button",
									{ type: "submit", className: "btn btn-primary" },
									"Update Username"
								)
							)
						)
					)
				),
				React.createElement(
					"div",
					{ className: "page-header" },
					React.createElement(
						"h2",
						null,
						"Edit Password"
					)
				),
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-md-6" },
						React.createElement(
							"form",
							{ onSubmit: this.handleSubmitPassword },
							React.createElement(
								"div",
								{ className: "form-group", id: "fg-password" },
								React.createElement(
									"label",
									{ className: "control-label", htmlFor: "input-password" },
									"New Password"
								),
								React.createElement("input", {
									type: "password",
									className: "form-control",
									id: "input-password",
									value: this.state.password,
									onChange: this.handleChange.bind(null, 'password') })
							),
							React.createElement(
								"div",
								{ className: "form-group", id: "fg-confirmPassword" },
								React.createElement(
									"label",
									{ className: "control-label", htmlFor: "input-confirmPassword" },
									"Confirm New Password"
								),
								React.createElement("input", {
									type: "password",
									className: "form-control",
									id: "input-confirmPassword",
									value: this.state.confirmPassword,
									onChange: this.handleChange.bind(null, 'confirmPassword') })
							),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"button",
									{ type: "submit", className: "btn btn-primary" },
									"Update Password"
								)
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Invest Profile Details  ======*/

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

			case 'EMAIL-VALIDATED':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-info" },
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
								" Email already verified.",
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

			case 'TRANSACTION-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Saving Transaction"
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

			case 'TRANSACTION-SUCCESS':
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
								" New Transaction Saved.",
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

			case 'UPDATE-TRANSACTION-ERROR':
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
								" Transaction not Saved. Please try again.",
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

			case 'UPDATE-TRANSACTION-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Updating Transaction"
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

			case 'UPDATE-TRANSACTION-SUCCESS':
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
								" Transaction Updated.",
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

			case 'TRANSACTION-ERROR':
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
								" Transaction not Updated. Please try again.",
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

			case 'CHANGE-EMAIL-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Updating Email Address"
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

			case 'CHANGE-EMAIL-SAVED':
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
								" Email Address Updated.",
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

			case 'CHANGE-EMAIL-ERROR':
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
								" Updating Email Failed. Please try again.",
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

			case 'CHANGE-EMAIL-UNCHANGED':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-info" },
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
								" Email not changed.",
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

			case 'CHANGE-USERNAME-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Updating Username"
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

			case 'CHANGE-USERNAME-SAVED':
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
								" Username Updated.",
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

			case 'CHANGE-USERNAME-ERROR':
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
								" Updating Username Failed. Please try again.",
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

			case 'CHANGE-USERNAME-UNCHANGED':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel-custom-info" },
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
								" Username not changed.",
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

			case 'CHANGE-PASSWORD-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Updating Password"
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

			case 'CHANGE-PASSWORD-SAVED':
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
								" Password Updated.",
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

			case 'CHANGE-PASSWORD-ERROR':
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
								" Updating Password Failed. Please try again.",
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