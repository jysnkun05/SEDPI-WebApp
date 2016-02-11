/*=======================================
=            View Components            =
=======================================*/

/*----------  Investor List View  ----------*/

var InvestorTableListView = React.createClass({
	displayName: "InvestorTableListView",

	render: function () {
		var accountList;
		if (this.props.accounts === undefined) {
			accountList = React.createElement(
				"tr",
				{ className: "text-center" },
				React.createElement(
					"td",
					{ colSpan: "4" },
					React.createElement("i", { className: "fa fa-circle-o-notch fa-spin fa-fw" }),
					" Loading Accounts."
				)
			);
		} else if (this.props.accounts === 'retrying') {
			accountList = React.createElement(
				"tr",
				{ className: "text-center" },
				React.createElement(
					"td",
					{ colSpan: "4" },
					React.createElement("i", { className: "fa fa-circle-o-notch fa-spin fa-fw" }),
					" Retying to load accounts. Please wait."
				)
			);
		} else if (this.props.accounts == 'error') {
			accountList = React.createElement(
				"tr",
				{ className: "text-center" },
				React.createElement(
					"td",
					{ colSpan: "4" },
					React.createElement("i", { className: "fa fa-exclamation-triangle fa-fw" }),
					" ",
					"Unable to load accounts.",
					" ",
					React.createElement(
						"button",
						{ type: "button", className: "btn btn-link btn-xs", onClick: this.props.retryGetAllAccounts },
						"Retry"
					)
				)
			);
		} else if (this.props.accounts.length > 0) {
			accountList = this.props.accounts.map(function (account, index) {

				return React.createElement(
					"tr",
					{ className: "text-center clickable-row", key: index, onClick: this.props.viewAccountDetails.bind(null, account.id) },
					React.createElement(
						"td",
						null,
						index + 1
					),
					React.createElement(
						"td",
						null,
						account.name
					),
					React.createElement(
						"td",
						null,
						account.type === "joint" ? "Joint Account" : "Individual Account"
					),
					React.createElement(
						"td",
						null,
						accounting.formatMoney(account.balance, "Php ", 2)
					)
				);
			}.bind(this));
		} else {
			accountList = React.createElement(
				"tr",
				{ className: "text-center" },
				React.createElement(
					"td",
					{ colSpan: "4" },
					React.createElement("i", { className: "fa fa-info-circle fa-fw" }),
					" No Accounts Created."
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
					"Investor Account List",
					React.createElement(
						"div",
						{ className: "pull-right" },
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-primary btn-xs", onClick: this.props.mainViewChange.bind(null, 'CREATE-ACCOUNT') },
							"Create Account"
						)
					)
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
											"Account Name"
										),
										React.createElement(
											"th",
											{ className: "text-center" },
											"Account Type"
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
									accountList
								)
							)
						)
					)
				)
			)
		);
	}
});

/*----------  Create Investor Account  ----------*/

var CreateInvestorAccount = React.createClass({
	displayName: "CreateInvestorAccount",

	getInitialState: function () {
		return {
			//account fields,
			accountName: '',
			accountType: 'individual',
			coInvestors: [],
			//investor fields
			firstName: '',
			middleName: '',
			lastName: '',
			email: '',
			//co investor fields
			coFirstName: '',
			coMiddleName: '',
			coLastName: '',
			//others
			selectedCoInvestorIndex: undefined
		};
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_saveInvestorSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating Account and Investor Data'
		});
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			accountName: this.state.accountName.trim() === '' ? this.state.firstName + " " + this.state.lastName : this.state.accountName.trim(),
			accountType: this.state.accountType,
			coInvestors: this.state.coInvestors,
			firstName: this.state.firstName.trim(),
			middleName: this.state.middleName.trim(),
			lastName: this.state.lastName.trim()
		};

		this.setState({
			accountName: postData.accountName,
			firstName: postData.firstName,
			middleName: postData.middleName,
			lastName: postData.lastName
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investor/addAccount',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.accountsChange();
				this.props.modalViewChange({
					type: 'SUCCESS-MODAL',
					message: response.message
				});
				this.props.mainViewChange('LIST');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (xhr, status, error) {
				if (xhr.status === 422) {
					$("#InvestMessageContainerModal").modal('hide');
					$.each(xhr.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				}
			}.bind(this)
		});
	},
	_addCoInvestorSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating Co Investor'
		});
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			coFirstName: this.state.coFirstName.trim(),
			coMiddleName: this.state.coMiddleName.trim(),
			coLastName: this.state.coLastName.trim()
		};

		this.setState({
			coFirstName: postData.coFirstName,
			coMiddleName: postData.coMiddleName,
			coLastName: postData.coLastName
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investor/addCoInvestor',
			type: 'POST',
			data: postData,
			success: function (response) {
				$("#InvestMessageContainerModal").modal('hide');
				var coInvestors = this.state.coInvestors;

				if (this.state.selectedCoInvestorIndex === undefined) coInvestors.push(postData);else coInvestors.splice(this.state.selectedCoInvestorIndex, 1, postData);

				this.setState({
					coInvestors: coInvestors,
					coFirstName: '',
					coMiddleName: '',
					coLastName: '',
					selectedCoInvestorIndex: undefined
				});
			}.bind(this),
			error: function (xhr, status, error) {
				$("#InvestMessageContainerModal").modal('hide');
				if (xhr.status === 422) {
					$.each(xhr.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				}
			}.bind(this)
		});
	},
	_removeCoInvestor: function (targetIndex) {
		var coInvestors = this.state.coInvestors;
		coInvestors.splice(targetIndex, 1);
		//console.log(coInvestors);
		this.setState({ coInvestors: coInvestors });
	},
	_editCoInvestor: function (targetIndex) {
		var coInvestor = this.state.coInvestors[targetIndex];
		//console.log(coInvestor);
		this.setState({
			coFirstName: coInvestor.coFirstName,
			coMiddleName: coInvestor.coMiddleName,
			coLastName: coInvestor.coLastName,
			selectedCoInvestorIndex: targetIndex
		});
	},
	_clearSelectedCoInvestor: function () {
		this.setState({
			coFirstName: '',
			coMiddleName: '',
			coLastName: '',
			selectedCoInvestorIndex: undefined
		});
	},
	render: function () {
		var coInvestorList = React.createElement(
			"tr",
			{ className: "text-center" },
			React.createElement(
				"td",
				{ colSpan: "3" },
				React.createElement("i", { className: "fa fa-info-circle fa-fw" }),
				" No Co Investor Listed"
			)
		);

		if (this.state.coInvestors.length > 0) {
			coInvestorList = this.state.coInvestors.map(function (coInvestor, index) {
				return React.createElement(
					"tr",
					{ className: this.state.selectedCoInvestorIndex === index ? "text-center selected-row" : "text-center", key: index },
					React.createElement(
						"td",
						null,
						index + 1
					),
					React.createElement(
						"td",
						null,
						coInvestor.coMiddleName !== "" ? coInvestor.coFirstName + " " + coInvestor.coMiddleName + " " + coInvestor.coLastName : coInvestor.coFirstName + " " + coInvestor.coLastName,
						" "
					),
					React.createElement(
						"td",
						null,
						this.state.selectedCoInvestorIndex !== index ? React.createElement(
							"div",
							{ className: "btn-group" },
							React.createElement(
								"button",
								{ type: "button", className: "btn btn-link btn-xs", onClick: this._editCoInvestor.bind(null, index) },
								"Edit"
							),
							React.createElement(
								"button",
								{ type: "button", className: "btn btn-link btn-xs red-bg", onClick: this._removeCoInvestor.bind(null, index) },
								"Remove"
							)
						) : React.createElement(
							"button",
							{ type: "button", className: "btn btn-link btn-xs white-bg", onClick: this._clearSelectedCoInvestor },
							"Cancel"
						)
					)
				);
			}.bind(this));
		}

		var coInvestorsForm = React.createElement(
			"div",
			{ className: "col-md-12" },
			React.createElement(
				"form",
				{ onSubmit: this._addCoInvestorSubmit },
				React.createElement(
					"fieldset",
					null,
					React.createElement(
						"legend",
						null,
						"Co Investor Details"
					),
					React.createElement(
						"div",
						{ className: "form-group" },
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
										"Co Investor Name"
									),
									React.createElement("th", null)
								)
							),
							React.createElement(
								"tbody",
								null,
								coInvestorList
							)
						)
					),
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement(
							"label",
							{ className: "control-label", htmlFor: "input-coFirstName input-coLastName" },
							"Co Investor Name *"
						),
						React.createElement(
							"div",
							{ className: "form-group", id: "fg-coFirstName" },
							React.createElement("input", {
								type: "text",
								className: "form-control",
								id: "input-coFirstName",
								value: this.state.coFirstName,
								onChange: this._handleChange.bind(null, 'coFirstName'),
								placeholder: "First Name *" })
						),
						React.createElement(
							"div",
							{ className: "form-group", id: "fg-coMiddleName" },
							React.createElement("input", {
								type: "text",
								className: "form-control",
								id: "input-coMiddleName",
								value: this.state.coMiddleName,
								onChange: this._handleChange.bind(null, 'coMiddleName'),
								placeholder: "Middle Name" })
						),
						React.createElement(
							"div",
							{ className: "form-group", id: "fg-coLastName" },
							React.createElement("input", {
								type: "text",
								className: "form-control",
								id: "input-coLastName",
								value: this.state.coLastName,
								onChange: this._handleChange.bind(null, 'coLastName'),
								placeholder: "Last Name *" })
						),
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"div",
								{ className: "pull-right" },
								React.createElement(
									"button",
									{ type: "submit", className: "btn btn-primary" },
									this.state.selectedCoInvestorIndex === undefined ? "Add Co Investor" : "Edit Co Investor"
								)
							)
						)
					)
				)
			)
		);
		return React.createElement(
			"div",
			{ className: "col-md-6 col-md-offset-3" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					React.createElement(
						"button",
						{ type: "button", className: "btn btn-link btn-xs", onClick: this.props.mainViewChange.bind(null, 'LIST') },
						React.createElement("i", { className: "fa fa-chevron-left" })
					),
					"Create Investor Account",
					React.createElement(
						"div",
						{ className: "pull-right" },
						React.createElement(
							"button",
							{ type: "submit", className: "btn btn-primary btn-xs", onClick: this._saveInvestorSubmit },
							"Save Account"
						)
					)
				),
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"form",
							{ onSubmit: this._saveInvestorSubmit },
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement(
									"fieldset",
									null,
									React.createElement(
										"legend",
										null,
										"Account Details"
									),
									React.createElement(
										"div",
										{ className: "form-group", id: "fg-accountName" },
										React.createElement(
											"label",
											{ className: "control-label", htmlFor: "input-accountName" },
											"Account Name *"
										),
										React.createElement("input", {
											type: "text",
											id: "input-accountName",
											value: this.state.accountName,
											onChange: this._handleChange.bind(null, 'accountName'),
											className: "form-control" })
									),
									React.createElement(
										"div",
										{ className: "form-group" },
										React.createElement(
											"label",
											null,
											"Account Type *"
										),
										React.createElement(
											"select",
											{
												className: "form-control",
												value: this.state.accountType,
												onChange: this._handleChange.bind(null, 'accountType') },
											React.createElement(
												"option",
												{ value: "individual" },
												"Individual Account"
											),
											React.createElement(
												"option",
												{ value: "joint" },
												"Joint Account"
											)
										)
									)
								)
							),
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement(
									"fieldset",
									null,
									React.createElement(
										"legend",
										null,
										"Investor Details"
									),
									React.createElement(
										"div",
										{ className: "form-group" },
										React.createElement(
											"label",
											{ coLastName: "control-label", htmlFor: "input-firstName input-lastName" },
											"Full Name *"
										),
										React.createElement(
											"div",
											{ className: "form-group", id: "fg-firstName" },
											React.createElement("input", {
												type: "text",
												className: "form-control",
												id: "input-firstName",
												value: this.state.firstName,
												onChange: this._handleChange.bind(null, 'firstName'),
												placeholder: "First Name *" })
										),
										React.createElement(
											"div",
											{ className: "form-group", id: "fg-middleName" },
											React.createElement("input", {
												type: "text",
												className: "form-control",
												id: "input-middleName",
												value: this.state.middleName,
												onChange: this._handleChange.bind(null, 'middleName'),
												placeholder: "Middle Name" })
										),
										React.createElement(
											"div",
											{ className: "form-group", id: "fg-lastName" },
											React.createElement("input", {
												type: "text",
												className: "form-control",
												id: "input-lastName",
												value: this.state.lastName,
												onChange: this._handleChange.bind(null, 'lastName'),
												placeholder: "Last Name *" })
										)
									),
									React.createElement(
										"div",
										{ className: "form-group", id: "fg-email" },
										React.createElement(
											"label",
											{ className: "control-label", htmlFor: "input-email" },
											"E-mail Address"
										),
										React.createElement("input", {
											type: "text",
											className: "form-control",
											id: "input-email",
											value: this.state.email,
											onChange: this._handleChange.bind(null, 'email'),
											placeholder: "someone@company.com" })
									)
								)
							),
							React.createElement(
								"button",
								{ type: "submit", className: "hide" },
								"hide"
							)
						),
						this.state.accountType === 'joint' ? coInvestorsForm : null
					)
				)
			)
		);
	}
});

/*----------  View Investor Account  ----------*/

var ViewInvestorAccount = React.createClass({
	displayName: "ViewInvestorAccount",

	getInitialState: function () {
		return {
			accountView: 'ACCOUNT-DETAILS'
		};
	},
	_onAccountViewChange: function (accountView) {
		this.setState({ accountView: accountView });
	},
	render: function () {
		var accountView;
		switch (this.state.accountView) {
			case 'ACCOUNT-DETAILS':
				accountView = React.createElement(AccountDetails, {
					account: this.props.account,
					getAllAccounts: this.props.getAllAccounts,
					getAccountDetails: this.props.getAccountDetails,
					retryGetAccountDetails: this.props.retryGetAccountDetails,
					mainViewChange: this.props.mainViewChange });
				break;

			case 'INVESTMENT-DETAILS':
				accountView = React.createElement(InvestmentDetails, {
					account: this.props.account,
					retryGetAccountDetails: this.props.retryGetAccountDetails,
					modalFormChange: this.props.modalFormChange,
					modalViewChange: this.props.modalViewChange,
					mainViewChange: this.props.mainViewChange });
				break;

			case 'INVESTORS-DETAILS':
				accountView = React.createElement(InvestorsDetails, {
					account: this.props.account,
					retryGetAccountDetails: this.props.retryGetAccountDetails,
					mainViewChange: this.props.mainViewChange });
				break;
		}
		return React.createElement(
			"div",
			{ className: "col-md-10 col-md-offset-1" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-3" },
					React.createElement(
						"div",
						{ className: "panel panel-default" },
						React.createElement(
							"div",
							{ className: "panel-body" },
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"div",
									{ className: "list-group" },
									React.createElement(
										"button",
										{
											type: "button",
											className: this.state.accountView === 'ACCOUNT-DETAILS' ? "list-group-item btn-xs active" : "list-group-item btn-xs",
											onClick: this._onAccountViewChange.bind(null, 'ACCOUNT-DETAILS') },
										React.createElement("i", { className: "fa fa-user fa-fw" }),
										" Account"
									),
									React.createElement(
										"button",
										{
											type: "button",
											className: this.state.accountView === 'INVESTMENT-DETAILS' ? "list-group-item btn-xs active" : "list-group-item btn-xs",
											onClick: this._onAccountViewChange.bind(null, 'INVESTMENT-DETAILS') },
										React.createElement("i", { className: "fa fa-money fa-fw" }),
										" Investment"
									),
									React.createElement(
										"button",
										{
											type: "button",
											className: this.state.accountView === 'INVESTORS-DETAILS' ? "list-group-item btn-xs active" : "list-group-item btn-xs" },
										React.createElement("i", { className: "fa fa-users fa-fw" }),
										" Investors ",
										React.createElement(
											"small",
											null,
											"coming soon"
										)
									)
								)
							)
						)
					)
				),
				React.createElement(
					"div",
					{ className: "col-md-9" },
					accountView
				)
			)
		);
	}
});

/*=====  End of View Components  ======*/

/*===============================================
=            View Details Components            =
===============================================*/

/*----------  Account Details  ----------*/

var AccountDetails = React.createClass({
	displayName: "AccountDetails",

	render: function () {
		var detailView;
		if (this.props.account === undefined) {
			detailView = React.createElement(
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
		} else if (this.props.account === 'retrying') {
			detailView = React.createElement(
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
								" Retying to load account details. Please wait."
							)
						)
					)
				)
			);
		} else if (this.props.account == 'error') {
			detailView = React.createElement(
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
								React.createElement("i", { className: "fa fa-exclamation-triangle fa-fw" }),
								" ",
								"Unable to load account details.",
								" ",
								React.createElement(
									"button",
									{ className: "btn btn-link btn-xs", onClick: this.props.retryGetAccountDetails },
									"Retry"
								)
							)
						)
					)
				)
			);
		} else {
			account = this.props.account;
			user = this.props.account.user;
			investors = this.props.account.investors;
			investorList = investors.map(function (investor, index) {
				var fullName = investor.middleName ? null === investor.firstName + " " + investor.middleName + " " + investor.lastName : investor.firstName + " " + investor.lastName;
				return React.createElement(
					"p",
					{ key: index },
					fullName,
					" ",
					investor.isOwner ? React.createElement("i", { className: "fa fa-user fa-fw blue-bg" }) : null
				);
			});
			detailView = React.createElement(
				"table",
				{ className: "table table-condensed table-striped table-hover" },
				React.createElement(
					"tbody",
					null,
					React.createElement(AccountNameComponent, {
						account: account,
						getAllAccounts: this.props.getAllAccounts,
						getAccountDetails: this.props.getAccountDetails }),
					React.createElement(AccountTypeComponent, {
						account: account,
						getAllAccounts: this.props.getAllAccounts,
						getAccountDetails: this.props.getAccountDetails }),
					React.createElement(UsernameComponent, {
						account: account,
						user: user,
						getAllAccounts: this.props.getAllAccounts,
						getAccountDetails: this.props.getAccountDetails }),
					React.createElement(PasswordComponent, {
						account: account,
						user: user,
						getAllAccounts: this.props.getAllAccounts,
						getAccountDetails: this.props.getAccountDetails }),
					React.createElement(UserActiveComponent, {
						account: account,
						user: user,
						getAllAccounts: this.props.getAllAccounts,
						getAccountDetails: this.props.getAccountDetails }),
					React.createElement(
						"tr",
						null,
						React.createElement(
							"td",
							{ className: "table-title-col" },
							"Investor(s)"
						),
						React.createElement(
							"td",
							null,
							investorList
						),
						React.createElement(
							"td",
							{ className: "text-right" },
							React.createElement(
								"button",
								{ className: "btn btn-link btn-xs" },
								"Edit"
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
				{ className: "panel-body" },
				React.createElement(
					"div",
					{ className: "page-header" },
					React.createElement(
						"div",
						{ className: "pull-right" },
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-link btn-xs", onClick: this.props.mainViewChange.bind(null, 'LIST') },
							"Back to Investor Account List"
						)
					),
					React.createElement(
						"h2",
						null,
						"Account Details"
					)
				),
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-md-12" },
						detailView
					)
				)
			)
		);
	}
});

/*----------  Investment Details  ----------*/

var InvestmentDetails = React.createClass({
	displayName: "InvestmentDetails",

	_onShowAddTransactionForm: function () {
		this.props.modalFormChange('ADD-TRANSACTION');
		$("#InvestFormContainerModal").modal();
	},
	_onShowEditTransactionForm: function (id) {
		this.props.modalFormChange('EDIT-TRANSACTION', id);
		$("#InvestFormContainerModal").modal();
	},
	render: function () {
		var detailView;
		if (this.props.account === undefined) {
			detailView = React.createElement(
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
		} else if (this.props.accounts === 'retrying') {
			detailView = React.createElement(
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
								" Retying to load investment details. Please wait."
							)
						)
					)
				)
			);
		} else if (this.props.account == 'error') {
			detailView = React.createElement(
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
								React.createElement("i", { className: "fa fa-exclamation-triangle fa-fw" }),
								" ",
								"Unable to load investment details.",
								" ",
								React.createElement(
									"button",
									{ className: "btn btn-link btn-xs", onClick: this.props.retryGetAccountDetails },
									"Retry"
								)
							)
						)
					)
				)
			);
		} else {
			var account = this.props.account;
			var transactions = account.transactions;
			var transactionList;
			if (transactions.length > 0) {
				transactionList = transactions.map(function (transaction, index) {
					var amount = accounting.formatNumber(transaction.amount, 2);
					var runningBalance = accounting.formatNumber(transaction.runningBalance, 2);
					if (transactions.length - 1 === index) runningBalance = React.createElement(
						"strong",
						null,
						accounting.formatNumber(transaction.runningBalance, 2)
					);
					return React.createElement(
						"tr",
						{ key: index, className: "clickable-row", onClick: this._onShowEditTransactionForm.bind(null, transaction.id) },
						React.createElement(
							"td",
							{ className: "text-center" },
							moment(transaction.transactionDate).format('DD MMM YYYY')
						),
						React.createElement(
							"td",
							{ className: "text-center" },
							transaction.transaction_type.code
						),
						React.createElement(
							"td",
							{ className: "text-right red-bg" },
							transaction.transaction_type.account_type === "DR" ? amount : null
						),
						React.createElement(
							"td",
							{ className: "text-right" },
							transaction.transaction_type.account_type === "CR" ? amount : null
						),
						React.createElement(
							"td",
							{ className: "text-right" },
							runningBalance
						)
					);
				}.bind(this));
			} else {
				transactionList = React.createElement(
					"tr",
					{ className: "text-center" },
					React.createElement(
						"td",
						{ colSpan: "5" },
						React.createElement("i", { className: "fa fa-info-circle fa-fw" }),
						" No Transaction Posted."
					)
				);
			}

			detailView = React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-12" },
					React.createElement(
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
										{ type: "button", className: "btn btn-default btn-xs", onClick: this._onShowAddTransactionForm },
										"Add New Transaction"
									),
									React.createElement(
										"button",
										{ type: "button", className: "btn btn-default btn-xs dropdown-toggle", "data-toggle": "dropdown" },
										React.createElement("span", { className: "caret" }),
										React.createElement(
											"span",
											{ className: "sr-only" },
											"Toggle Dropdown"
										)
									),
									React.createElement(
										"ul",
										{ className: "dropdown-menu" },
										React.createElement(
											"li",
											null,
											React.createElement(
												"a",
												null,
												"Import Transaction ",
												React.createElement(
													"small",
													null,
													"coming soon"
												)
											)
										)
									)
								)
							)
						),
						React.createElement(
							"div",
							{ className: "panel-body" },
							React.createElement(
								"table",
								{ className: "table table-bordered table-striped table-condensed table-hover" },
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
									transactionList
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
				{ className: "panel-body" },
				React.createElement(
					"div",
					{ className: "page-header" },
					React.createElement(
						"div",
						{ className: "pull-right" },
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-link btn-xs", onClick: this.props.mainViewChange.bind(null, 'LIST') },
							"Back to Investor Account List"
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
						detailView
					)
				)
			)
		);
	}
});

/*----------  Investor Details  ----------*/

var InvestorsDetails = React.createClass({
	displayName: "InvestorsDetails",

	render: function () {
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
							{ type: "button", className: "btn btn-link btn-xs", onClick: this.props.mainViewChange.bind(null, 'LIST') },
							"Back to Investor Account List"
						)
					),
					React.createElement(
						"h2",
						null,
						"Investors Details"
					)
				),
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement("div", { className: "col-md-12" })
				)
			)
		);
	}
});

/*=====  End of View Details Components  ======*/

/*==================================================
=            Account Details Components            =
==================================================*/

/*----------  Account Name Component  ----------*/

var AccountNameComponent = React.createClass({
	displayName: "AccountNameComponent",

	getInitialState: function () {
		return {
			accountName: this.props.account.name,
			editMode: false,
			status: undefined
		};
	},
	_onChangeEditMode: function (value) {
		this.setState({ editMode: value });
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_updateAccountName: function (e) {
		e.preventDefault();
		var self = this;

		var postData = {
			id: this.props.account.id,
			accountName: this.state.accountName.trim()
		};

		if (postData.accountName === this.props.account.name) {
			this.setState({
				accountName: this.props.account.name,
				editMode: false,
				status: undefined
			});
		} else {
			this.setState({
				status: 'updating',
				editMode: false
			});
			$.ajax({
				url: '/api/investor/updateAccountName',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.getAccountDetails(0, this.props.account.id);
					this.props.getAllAccounts(0);
					this.setState({
						status: response.status
					});
					setTimeout(function () {
						self.setState({
							status: undefined,
							accountName: self.props.account.name
						});
					}, 3000);
				}.bind(this),
				error: function (xhr, status, error) {
					this.setState({ status: status });
				}.bind(this)
			});
		}
	},
	render: function () {
		var componentContent;
		var componentButton;
		if (this.state.editMode) {
			componentContent = React.createElement(
				"td",
				null,
				React.createElement(
					"form",
					{ className: "form-inline", onSubmit: this._updateAccountName },
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement("input", {
							type: "text",
							className: "form-control",
							value: this.state.accountName,
							onChange: this._handleChange.bind(null, 'accountName') }),
						React.createElement(
							"button",
							{ type: "submit", className: "hide" },
							"Hide"
						)
					)
				)
			);

			componentButton = React.createElement(
				"td",
				{ className: "text-right" },
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-primary", onClick: this._updateAccountName, disabled: this.state.accountName === this.props.account.name },
					"Confirm"
				),
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-link btn-xs", onClick: this._onChangeEditMode.bind(null, false) },
					"Cancel"
				)
			);
		} else {
			componentContent = React.createElement(
				"td",
				null,
				this.state.accountName
			);
			switch (this.state.status) {
				case 'updating':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-circle-o-notch fa-fw fa-spin fa-xs" }),
						" ",
						React.createElement(
							"small",
							null,
							"Updating"
						)
					);
					break;
				case 'success':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-check-circle fa-fw fa-xs green-bg" }),
						" ",
						React.createElement(
							"small",
							null,
							"Account Updated."
						)
					);
					break;
				case 'error':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-exclamation-triangle fa-fw fa-xs orange-bg" }),
						" ",
						React.createElement(
							"small",
							null,
							"Unable to update."
						),
						React.createElement(
							"button",
							{ className: "button", className: "btn btn-link btn-xs", onClick: this._updateAccountName },
							"Retry"
						)
					);
					break;
				default:
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement(
							"button",
							{ className: "btn btn-link btn-xs", onClick: this._onChangeEditMode.bind(null, true) },
							"Edit"
						)
					);
					break;

			}
		}
		return React.createElement(
			"tr",
			null,
			React.createElement(
				"td",
				{ className: "table-title-col" },
				" Account Name"
			),
			componentContent,
			componentButton
		);
	}
});

/*----------  Account Type Component  ----------*/

var AccountTypeComponent = React.createClass({
	displayName: "AccountTypeComponent",

	getInitialState: function () {
		return {
			accountType: this.props.account.type,
			editMode: false,
			status: undefined
		};
	},
	_onChangeEditMode: function (value) {
		this.setState({ editMode: value });
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_updateAccountType: function (e) {
		e.preventDefault();
		var self = this;

		var postData = {
			id: this.props.account.id,
			accountType: this.state.accountType
		};

		if (postData.accountType === this.props.account.type) {
			this.setState({
				editMode: false,
				status: undefined
			});
		} else {
			this.setState({
				status: 'updating',
				editMode: false
			});
			$.ajax({
				url: '/api/investor/updateAccountType',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.getAccountDetails(0, this.props.account.id);
					this.props.getAllAccounts(0);
					this.setState({
						status: response.status
					});
					setTimeout(function () {
						self.setState({
							status: undefined,
							accountType: self.props.account.type
						});
					}, 3000);
				}.bind(this),
				error: function (xhr, status, error) {
					this.setState({ status: status });
				}.bind(this)
			});
		}
	},
	render: function () {
		var componentContent;
		var componentButton;
		if (this.state.editMode) {
			componentContent = React.createElement(
				"td",
				null,
				React.createElement(
					"form",
					{ className: "form-inline", onSubmit: this._updateAccountType },
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement(
							"select",
							{
								className: "form-control",
								value: this.state.accountType,
								onChange: this._handleChange.bind(null, 'accountType') },
							React.createElement(
								"option",
								{ value: "individual" },
								"Individual Account"
							),
							React.createElement(
								"option",
								{ value: "joint" },
								"Joint Account"
							)
						),
						React.createElement(
							"button",
							{ type: "submit", className: "hide" },
							"Hide"
						)
					)
				)
			);

			componentButton = React.createElement(
				"td",
				{ className: "text-right" },
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-primary", onClick: this._updateAccountType, disabled: this.state.accountType === this.props.account.type },
					"Confirm"
				),
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-link btn-xs", onClick: this._onChangeEditMode.bind(null, false) },
					"Cancel"
				)
			);
		} else {
			componentContent = React.createElement(
				"td",
				null,
				this.state.accountType === 'joint' ? "Joint Account" : "Individual Account"
			);
			switch (this.state.status) {
				case 'updating':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-circle-o-notch fa-fw fa-spin fa-xs" }),
						" ",
						React.createElement(
							"small",
							null,
							"Updating"
						)
					);
					break;
				case 'success':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-check-circle fa-fw fa-xs green-bg" }),
						" ",
						React.createElement(
							"small",
							null,
							"Account Updated."
						)
					);
					break;
				case 'error':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-exclamation-triangle fa-fw fa-xs orange-bg" }),
						" ",
						React.createElement(
							"small",
							null,
							"Unable to update."
						),
						React.createElement(
							"button",
							{ className: "button", className: "btn btn-link btn-xs", onClick: this._updateAccountType },
							"Retry"
						)
					);
					break;
				default:
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement(
							"button",
							{ className: "btn btn-link btn-xs", onClick: this._onChangeEditMode.bind(null, true) },
							"Edit"
						)
					);
					break;

			}
		}
		return React.createElement(
			"tr",
			null,
			React.createElement(
				"td",
				{ className: "table-title-col" },
				" Account Type"
			),
			componentContent,
			componentButton
		);
	}
});

/*----------  Username Component  ----------*/

var UsernameComponent = React.createClass({
	displayName: "UsernameComponent",

	getInitialState: function () {
		return {
			username: this.props.user.username,
			editMode: false,
			status: undefined
		};
	},
	_onChangeEditMode: function (value) {
		this.setState({ editMode: value });
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_updateUsername: function (e) {
		e.preventDefault();
		var self = this;

		var postData = {
			id: this.props.account.id,
			username: this.state.username.trim()
		};

		if (postData.username === this.props.user.username) {
			this.setState({
				username: this.props.user.username,
				editMode: false,
				status: undefined
			});
		} else {
			this.setState({
				status: 'updating',
				editMode: false
			});
			$.ajax({
				url: '/api/investor/updateUsername',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.getAccountDetails(0, this.props.account.id);
					this.props.getAllAccounts(0);
					this.setState({
						status: response.status
					});
					setTimeout(function () {
						self.setState({
							status: undefined,
							username: self.props.user.username
						});
					}, 3000);
				}.bind(this),
				error: function (xhr, status, error) {
					this.setState({ status: status });
				}.bind(this)
			});
		}
	},
	render: function () {
		var componentContent;
		var componentButton;
		if (this.state.editMode) {
			componentContent = React.createElement(
				"td",
				null,
				React.createElement(
					"form",
					{ onSubmit: this._updateUsername },
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement("input", {
							type: "text",
							className: "form-control",
							value: this.state.username,
							onChange: this._handleChange.bind(null, 'username') }),
						React.createElement(
							"button",
							{ type: "submit", className: "hide" },
							"Hide"
						)
					)
				)
			);

			componentButton = React.createElement(
				"td",
				{ className: "text-right" },
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-primary", onClick: this._updateUsername, disabled: this.state.username === this.props.user.username },
					"Confirm"
				),
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-link btn-xs", onClick: this._onChangeEditMode.bind(null, false) },
					"Cancel"
				)
			);
		} else {
			componentContent = React.createElement(
				"td",
				null,
				this.state.username
			);
			switch (this.state.status) {
				case 'updating':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-circle-o-notch fa-fw fa-spin fa-xs" }),
						" ",
						React.createElement(
							"small",
							null,
							"Updating"
						)
					);
					break;
				case 'success':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-check-circle fa-fw fa-xs green-bg" }),
						" ",
						React.createElement(
							"small",
							null,
							"Account Updated."
						)
					);
					break;
				case 'error':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-exclamation-triangle fa-fw fa-xs orange-bg" }),
						" ",
						React.createElement(
							"small",
							null,
							"Unable to update."
						),
						React.createElement(
							"button",
							{ className: "button", className: "btn btn-link btn-xs", onClick: this._updateUsername },
							"Retry"
						)
					);
					break;
				default:
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement(
							"button",
							{ className: "btn btn-link btn-xs", onClick: this._onChangeEditMode.bind(null, true) },
							"Change Username"
						)
					);
					break;

			}
		}
		return React.createElement(
			"tr",
			null,
			React.createElement(
				"td",
				{ className: "table-title-col" },
				" Username"
			),
			componentContent,
			componentButton
		);
	}
});

/*----------  Password Component  ----------*/

var PasswordComponent = React.createClass({
	displayName: "PasswordComponent",

	getInitialState: function () {
		return {
			password: '',
			confirmPassword: '',
			editMode: false,
			status: undefined,
			password_changed_at: this.props.user.password_changed_at === null ? null : moment(this.props.user.password_changed_at).fromNow()
		};
	},
	_onChangeEditMode: function (value) {
		this.setState({ editMode: value });
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_updatePassword: function (e) {
		e.preventDefault();

		if (this.state.password.trim() === '' && this.state.confirmPassword.trim() === '') {
			this.setState({
				password: '',
				confirmPassword: '',
				editMode: false,
				status: undefined
			});
		} else {
			var self = this;
			var postData = {
				id: this.props.account.id,
				password: this.state.password,
				confirmPassword: this.state.confirmPassword
			};

			this.setState({
				status: 'updating',
				editMode: false
			});

			$.ajax({
				url: '/api/investor/updatePassword',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.getAccountDetails(0, this.props.account.id);
					this.props.getAllAccounts(0);
					this.setState({
						status: response.status,
						password: '',
						confirmPassword: ''
					});
					setTimeout(function () {
						self.setState({
							status: undefined,
							password_changed_at: moment(self.props.user.password_changed_at).fromNow()
						});
					}, 3000);
				}.bind(this),
				error: function (xhr, status, error) {
					this.setState({ status: status });
				}.bind(this)
			});
		}
	},
	render: function () {
		var componentContent;
		var componentButton;
		if (this.state.editMode) {
			componentContent = React.createElement(
				"td",
				null,
				React.createElement(
					"form",
					{ onSubmit: this._updatePassword },
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement("input", {
							type: "password",
							className: "form-control",
							value: this.state.password,
							placeholder: "Type your Password",
							onChange: this._handleChange.bind(null, 'password') })
					),
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement("input", {
							type: "password",
							className: "form-control",
							value: this.state.confirmPassword,
							placeholder: "Re-type your Password",
							onChange: this._handleChange.bind(null, 'confirmPassword') })
					),
					React.createElement(
						"button",
						{ type: "submit", className: "hide" },
						"Hide"
					)
				)
			);

			componentButton = React.createElement(
				"td",
				{ className: "text-right" },
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-primary", onClick: this._updatePassword, disabled: this.state.password === '' || this.state.confirmPassword === '' },
					"Confirm"
				),
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-link btn-xs", onClick: this._onChangeEditMode.bind(null, false) },
					"Cancel"
				)
			);
		} else {
			componentContent = React.createElement(
				"td",
				null,
				user.password_changed_at === null ? 'Password not set.' : this.state.password_changed_at
			);
			switch (this.state.status) {
				case 'updating':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-circle-o-notch fa-fw fa-spin fa-xs" }),
						" ",
						React.createElement(
							"small",
							null,
							"Updating"
						)
					);
					break;
				case 'success':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-check-circle fa-fw fa-xs green-bg" }),
						" ",
						React.createElement(
							"small",
							null,
							"Account Updated."
						)
					);
					break;
				case 'error':
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement("i", { className: "fa fa-exclamation-triangle fa-fw fa-xs orange-bg" }),
						" ",
						React.createElement(
							"small",
							null,
							"Unable to update."
						),
						React.createElement(
							"button",
							{ className: "button", className: "btn btn-link btn-xs", onClick: this._updatePassword },
							"Retry"
						)
					);
					break;
				default:
					componentButton = React.createElement(
						"td",
						{ className: "text-right" },
						React.createElement(
							"button",
							{ className: "btn btn-link btn-xs", onClick: this._onChangeEditMode.bind(null, true) },
							"Change Password"
						)
					);
					break;

			}
		}
		return React.createElement(
			"tr",
			null,
			React.createElement(
				"td",
				{ className: "table-title-col" },
				"Password"
			),
			componentContent,
			componentButton
		);
	}
});

/*----------  User Active Component  ----------*/

var UserActiveComponent = React.createClass({
	displayName: "UserActiveComponent",

	getInitialState: function () {
		return {
			status: undefined,
			isActive: this.props.user.is_active
		};
	},
	_changeUserActive: function () {
		this.setState({
			status: 'updating'
		});

		$.ajax({
			url: '/api/investor/updateUserActive',
			type: 'POST',
			data: { id: this.props.account.id },
			success: function (response) {
				var self = this;
				this.props.getAccountDetails(0, this.props.account.id);
				this.props.getAllAccounts(0);
				this.setState({
					status: response.status,
					isActive: this.props.user.is_active
				});
				setTimeout(function () {
					self.setState({
						status: undefined,
						isActive: self.props.user.is_active
					});
				}, 3000);
			}.bind(this),
			error: function (xhr, status, error) {
				this.setState({ status: undefined });
			}.bind(this)
		});
	},
	render: function () {
		var componentContent;

		componentContent = this.state.isActive ? React.createElement(
			"td",
			{ className: "green-bg" },
			"Active"
		) : React.createElement(
			"td",
			{ className: "red-bg" },
			"Inactive"
		);
		switch (this.state.status) {
			case 'updating':
				componentButton = React.createElement(
					"td",
					{ className: "text-right" },
					React.createElement("i", { className: "fa fa-circle-o-notch fa-fw fa-spin fa-xs" }),
					" ",
					React.createElement(
						"small",
						null,
						!this.state.isActive ? "Activating" : "Deactivating"
					)
				);
				break;
			case 'success':
				componentButton = React.createElement(
					"td",
					{ className: "text-right" },
					React.createElement("i", { className: "fa fa-check-circle fa-fw fa-xs green-bg" }),
					" ",
					React.createElement(
						"small",
						null,
						this.state.isActive ? "Account Deactivated" : "Account Activated"
					)
				);
				break;
			case 'error':
				componentButton = React.createElement(
					"td",
					{ className: "text-right" },
					React.createElement("i", { className: "fa fa-exclamation-triangle fa-fw fa-xs orange-bg" }),
					" ",
					React.createElement(
						"small",
						null,
						"Unable to update."
					),
					React.createElement(
						"button",
						{ className: "button", className: "btn btn-link btn-xs" },
						"Retry"
					)
				);
				break;
			default:
				componentButton = React.createElement(
					"td",
					{ className: "text-right" },
					React.createElement(
						"button",
						{ className: "btn btn-link btn-xs", onClick: this._changeUserActive },
						this.state.isActive ? "Deactivate Account" : "Activate Account"
					)
				);
				break;

		}
		return React.createElement(
			"tr",
			null,
			React.createElement(
				"td",
				{ className: "table-title-col" },
				"Status"
			),
			componentContent,
			componentButton
		);
	}
});

/*=====  End of Account Details Components  ======*/

/*========================================
=            Modal Components            =
========================================*/

/*----------  Message Modal  ----------*/

var InvestMessageContainerModal = React.createClass({
	displayName: "InvestMessageContainerModal",

	render: function () {
		var modalMessageComponent;
		var modalView = this.props.modalView;
		switch (modalView.type) {
			case 'WAITING-MODAL':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						modalView.title
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

			case 'SUCCESS-MODAL':
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
								" ",
								modalView.message,
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

/*----------  Form Modal  ----------*/

var InvestFormContainerModal = React.createClass({
	displayName: "InvestFormContainerModal",

	render: function () {
		console.log(this.props.modalForm);
		var modalForm = this.props.modalForm;
		var modalFormComponent;
		switch (modalForm.type) {
			case 'ADD-TRANSACTION':
				modalFormComponent = React.createElement(AddTransactionFormModal, {
					accountId: this.props.accountId,
					getAllAccounts: this.props.getAllAccounts,
					getAccountDetails: this.props.getAccountDetails,
					modalFormChange: this.props.modalFormChange,
					modalViewChange: this.props.modalViewChange });
				break;

			case 'EDIT-TRANSACTION':
				modalFormComponent = React.createElement(EditTransactionFormModal, {
					accountId: this.props.accountId,
					transactionId: this.props.modalForm.transactionId,
					getAllAccounts: this.props.getAllAccounts,
					getAccountDetails: this.props.getAccountDetails,
					modalFormChange: this.props.modalFormChange,
					modalViewChange: this.props.modalViewChange });
				break;

			default:
				modalFormComponent = null;
				break;
		}
		return React.createElement(
			"div",
			{ className: "modal fade", id: "InvestFormContainerModal", role: "dialog" },
			React.createElement(
				"div",
				{ className: "modal-dialog", role: "document" },
				modalFormComponent
			)
		);
	}
});

/*=====  End of Modal Components  ======*/

/*=============================================
=            Form Modal Components            =
=============================================*/

var AddTransactionFormModal = React.createClass({
	displayName: "AddTransactionFormModal",

	getInitialState: function () {
		return {
			transactionDate: '',
			transactionTypes: [],
			transactionType: '',
			amount: "0.00",
			notes: ''
		};
	},
	componentWillMount: function () {
		this._getTransactionTypes();
	},
	componentDidMount: function () {
		var self = this;
		$("#datepicker-transactionDate").datepicker({
			autoclose: true
		}).on('changeDate', function (e) {
			self.setState({ transactionDate: moment(e.date).format('MM/DD/YYYY') });
		});
	},
	_getTransactionTypes: function () {
		$.ajax({
			url: '/api/transaction/getTransactionTypes',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (types) {
				this.setState({
					transactionTypes: types,
					transactionType: types[0].code
				});
			}.bind(this),
			error: function (xhr, status, error) {
				this._getTransactionTypes();
			}.bind(this)
		});
	},
	_saveTransaction: function (e) {
		e.preventDefault();

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating Transaction'
		});
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.accountId,
			transactionDate: this.state.transactionDate,
			transactionType: this.state.transactionType,
			amount: accounting.unformat(this.state.amount),
			notes: this.state.notes.trim()
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		this.setState({
			notes: postData.notes
		});

		$.ajax({
			url: '/api/transaction/saveTransaction',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.modalViewChange({
					type: 'SUCCESS-MODAL',
					message: response.message
				});

				this.setState({
					transactionDate: '',
					transactionType: '',
					amount: "0.00",
					notes: ''
				});

				this.props.modalFormChange(undefined);
				this.props.getAccountDetails(0, this.props.accountId);
				this.props.getAllAccounts(0);
				$("#InvestFormContainerModal").modal('hide');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (xhr, status, error) {
				$("#InvestMessageContainerModal").modal('hide');
				if (xhr.status === 422) {
					$.each(xhr.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				}
			}.bind(this)
		});
	},
	_amountBlurred: function () {
		this.setState({ amount: accounting.formatNumber(this.state.amount, 2) });
	},
	_amountFocused: function () {
		this.setState({ amount: accounting.unformat(this.state.amount) });
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	render: function () {
		console.log(this.state.transactionDate);
		var transactionTypes;
		if (this.state.transactionTypes.length > 0) {
			transactionTypes = this.state.transactionTypes.map(function (type, index) {
				return React.createElement(
					"option",
					{ key: index, value: type.code },
					type.description
				);
			});
		} else {
			transactionTypes = React.createElement(
				"option",
				null,
				"Loading Data..."
			);
		}
		return React.createElement(
			"div",
			{ className: "row" },
			React.createElement(
				"div",
				{ className: "col-md-10 col-md-offset-1" },
				React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Add New Transactions",
						React.createElement(
							"button",
							{ type: "button", "data-dismiss": "modal", className: "close" },
							"×"
						)
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
									{ onSubmit: this._saveTransaction },
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
												name: "transactionDate",
												value: this.state.transactionDate,
												onBlur: this._dateBlurred,
												onChange: this._handleChange.bind(null, 'transactionDate') }),
											React.createElement(
												"span",
												{ className: "input-group-addon" },
												React.createElement("span", { className: "glyphicon glyphicon-calendar" })
											)
										)
									),
									React.createElement(
										"div",
										{ className: "form-group", id: "fg-transactionType" },
										React.createElement(
											"label",
											{ className: "control-label", htmlFor: "input-transactionType" },
											"Transaction Type"
										),
										React.createElement(
											"select",
											{
												className: "form-control",
												id: "input-transactionType",
												value: this.state.transactionType,
												disabled: !(this.state.transactionTypes.length > 0),
												onChange: this._handleChange.bind(null, 'transactionType') },
											transactionTypes
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
										React.createElement("input", {
											type: "text",
											className: "form-control text-right",
											value: this.state.amount,
											id: "input-amount",
											onBlur: this._amountBlurred,
											onFocus: this._amountFocused,
											onChange: this._handleChange.bind(null, 'amount') })
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
											rows: "5",
											className: "form-control",
											value: this.state.notes,
											onChange: this._handleChange.bind(null, 'notes') })
									),
									React.createElement(
										"div",
										{ className: "form-group" },
										React.createElement(
											"div",
											{ className: "pull-right" },
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
			)
		);
	}
});

var EditTransactionFormModal = React.createClass({
	displayName: "EditTransactionFormModal",

	getInitialState: function () {
		return {
			transaction: undefined,
			transactionDate: '',
			transactionTypes: [],
			transactionType: '',
			amount: "0.00",
			notes: ''
		};
	},
	componentWillMount: function () {
		this._getTransactionDetails(0);
		this._getTransactionTypes();
	},
	componentDidMount: function () {
		var self = this;
		$("#datepicker-transactionDate").datepicker({
			autoclose: true
		}).on('changeDate', function (e) {
			self.setState({ transactionDate: moment(e.date).format('MM/DD/YYYY') });
		});
	},
	_getTransactionDetails: function (counter) {
		$.ajax({
			url: '/api/transaction/getTransactionDetails',
			type: 'POST',
			data: { id: this.props.transactionId },
			success: function (transaction) {
				this.setState({
					transaction: transaction,
					transactionDate: moment(transaction.transactionDate).format('MM/DD/YYYY'),
					transactionType: transaction.transaction_type.code,
					amount: accounting.formatNumber(transaction.amount, 2),
					notes: transaction.notes
				});
			}.bind(this),
			error: function (xhr, status, error) {
				if (counter < 3) {
					this.setState({ transaction: 'retrying' });
					this._getTransactionDetails(counter + 1, id);
				} else {
					this.setState({ transaction: status });
				}
			}.bind(this)
		});
	},
	_getTransactionTypes: function () {
		$.ajax({
			url: '/api/transaction/getTransactionTypes',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (types) {
				this.setState({
					transactionTypes: types,
					transactionType: types[0].code
				});
			}.bind(this),
			error: function (xhr, status, error) {
				this._getTransactionTypes();
			}.bind(this)
		});
	},
	_updateTransaction: function (e) {
		e.preventDefault();

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating Transaction'
		});

		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.transactionId,
			transactionDate: this.state.transactionDate,
			transactionType: this.state.transactionType,
			amount: accounting.unformat(this.state.amount),
			notes: this.state.notes === null ? null : this.state.notes.trim()
		};

		if (postData.transactionDate !== this.state.transaction.transactionDate || postData.transactionType !== this.state.transaction.transaction_type.code || postData.amount !== this.state.transaction.amount || postData.notes !== this.state.transaction.notes) {
			$.each(postData, function (key, value) {
				$("#fg-" + key).removeClass('has-error');
				$("#input-" + key).popover('destroy');
			});

			this.setState({
				notes: postData.notes
			});

			$.ajax({
				url: '/api/transaction/updateTransaction',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.modalViewChange({
						type: 'SUCCESS-MODAL',
						message: response.message
					});

					this.setState({
						transactionDate: '',
						transactionType: '',
						amount: "0.00",
						notes: ''
					});

					this.props.modalFormChange(undefined);
					this.props.getAccountDetails(0, this.props.accountId);
					this.props.getAllAccounts(0);
					$("#InvestFormContainerModal").modal('hide');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}.bind(this),
				error: function (xhr, status, error) {
					$("#InvestMessageContainerModal").modal('hide');
					if (xhr.status === 422) {
						$.each(xhr.responseJSON, function (key, value) {
							$("#fg-" + key).addClass('has-error');
							$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
						});
					} else {}
				}.bind(this)
			});
		} else {
			this.props.modalFormChange(undefined);
			$("#InvestFormContainerModal").modal('hide');
		}
	},
	_amountBlurred: function () {
		this.setState({ amount: accounting.formatNumber(this.state.amount, 2) });
	},
	_amountFocused: function () {
		this.setState({ amount: accounting.unformat(this.state.amount) });
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	render: function () {
		var transactionTypes;
		if (this.state.transactionTypes.length > 0) {
			transactionTypes = this.state.transactionTypes.map(function (type, index) {
				return React.createElement(
					"option",
					{ key: index, value: type.code },
					type.description
				);
			});
		} else {
			transactionTypes = React.createElement(
				"option",
				null,
				"Loading Data..."
			);
		}

		var transactionView = React.createElement(
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

		if (this.state.transaction !== undefined) {
			transactionView = React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-12" },
					React.createElement(
						"form",
						{ onSubmit: this._updateTransaction },
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
									name: "transactionDate",
									value: this.state.transactionDate,
									onBlur: this._dateBlurred,
									onChange: this._handleChange.bind(null, 'transactionDate') }),
								React.createElement(
									"span",
									{ className: "input-group-addon" },
									React.createElement("span", { className: "glyphicon glyphicon-calendar" })
								)
							)
						),
						React.createElement(
							"div",
							{ className: "form-group", id: "fg-transactionType" },
							React.createElement(
								"label",
								{ className: "control-label", htmlFor: "input-transactionType" },
								"Transaction Type"
							),
							React.createElement(
								"select",
								{
									className: "form-control",
									id: "input-transactionType",
									value: this.state.transactionType,
									disabled: !(this.state.transactionTypes.length > 0),
									onChange: this._handleChange.bind(null, 'transactionType') },
								transactionTypes
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
							React.createElement("input", {
								type: "text",
								className: "form-control text-right",
								value: this.state.amount,
								id: "input-amount",
								onBlur: this._amountBlurred,
								onFocus: this._amountFocused,
								onChange: this._handleChange.bind(null, 'amount') })
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
								rows: "5",
								className: "form-control",
								value: this.state.notes,
								onChange: this._handleChange.bind(null, 'notes') })
						),
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"div",
								{ className: "pull-right" },
								React.createElement(
									"button",
									{ type: "submit", className: "btn btn-primary" },
									"Save Transaction"
								)
							)
						)
					)
				)
			);
		}
		return React.createElement(
			"div",
			{ className: "row" },
			React.createElement(
				"div",
				{ className: "col-md-10 col-md-offset-1" },
				React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Edit Transaction Details",
						React.createElement(
							"button",
							{ type: "button", "data-dismiss": "modal", className: "close" },
							"×"
						)
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						transactionView
					)
				)
			)
		);
	}
});

/*=====  End of Form Modal Components  ======*/

var InvestMain = React.createClass({
	displayName: "InvestMain",

	getInitialState: function () {
		return {
			mainView: 'LIST',
			modalView: {
				type: undefined
			},
			modalForm: {
				type: undefined
			},
			accounts: undefined,
			accountId: undefined,
			account: undefined
		};
	},
	componentWillMount: function () {
		this._getAllccounts(0);
		this.timer = setInterval(this._getAllccounts, 120000);
	},
	_getAllccounts: function (counter) {
		$.ajax({
			url: '/api/investor/getAllAccounts',
			type: 'POST',
			dataType: 'json',
			success: function (accounts) {
				this.setState({ accounts: accounts });
			}.bind(this),
			error: function (xhr, status, error) {
				if (counter < 3) {
					this.setState({ accounts: 'retrying' });
					this._getAllccounts(counter + 1);
				} else {
					this.setState({ accounts: status });
				}
			}.bind(this)
		});
	},
	_getAccountDetails: function (counter, id) {
		$.ajax({
			url: '/api/investor/getAccountDetails',
			type: 'POST',
			data: { id: id },
			success: function (account) {
				this.setState({ account: account });
			}.bind(this),
			error: function (xhr, status, error) {
				if (counter < 3) {
					this.setState({ account: 'retrying' });
					this._getAccountDetails(counter + 1, id);
				} else {
					this.setState({ account: status });
				}
			}.bind(this)
		});
	},
	_onRetryGetAllAccounts: function () {
		this.setState({ accounts: undefined });
		this._getAllccounts(0);
	},
	_onRetryGetAccountDetails: function () {
		this.setState({ account: undefined });
		this._getAccountDetails(0, this.state.accountId);
	},
	_onMainViewChange: function (mainView) {
		if (mainView != 'LIST') {
			this.setState({
				account: undefined,
				accountId: undefined
			});
			clearInterval(this.timer);
		} else this.timer = setInterval(this._getAllccounts, 120000);
		this.setState({ mainView: mainView });
	},
	_onModalViewChange: function (modalView) {
		this.setState({ modalView: modalView });
	},

	_onModalFormChange: function (modalForm, id) {
		var self = this;
		this.setState({ modalForm: { type: undefined } });
		console.log(this.state.modalForm);
		setTimeout(function () {
			self.setState({
				modalForm: {
					type: modalForm,
					transactionId: id
				}
			});
		}, 500);
		console.log(this.state.modalForm);
	},
	_onViewAccountDetails: function (accountId) {
		this._onMainViewChange('VIEW-ACCOUNT');
		this.setState({ accountId: accountId });
		this._getAccountDetails(0, accountId);
	},
	render: function () {
		// console.log(this.state.modalForm);
		var mainView;
		switch (this.state.mainView) {
			case 'LIST':
				mainView = React.createElement(InvestorTableListView, {
					accounts: this.state.accounts,
					viewAccountDetails: this._onViewAccountDetails,
					retryGetAllAccounts: this._onRetryGetAllAccounts,
					mainViewChange: this._onMainViewChange });
				break;

			case 'CREATE-ACCOUNT':
				mainView = React.createElement(CreateInvestorAccount, {
					accountsChange: this._onRetryGetAllAccounts,
					mainViewChange: this._onMainViewChange,
					modalViewChange: this._onModalViewChange });
				break;

			case 'VIEW-ACCOUNT':
				mainView = React.createElement(ViewInvestorAccount, {
					account: this.state.account,
					getAllAccounts: this._getAllccounts,
					getAccountDetails: this._getAccountDetails,
					retryGetAccountDetails: this._onRetryGetAccountDetails,
					modalFormChange: this._onModalFormChange,
					modalViewChange: this._onModalViewChange,
					mainViewChange: this._onMainViewChange });
				break;
		}
		return React.createElement(
			"div",
			{ className: "row" },
			mainView,
			React.createElement(InvestFormContainerModal, {
				accountId: this.state.accountId,
				modalForm: this.state.modalForm,
				getAllAccounts: this._getAllccounts,
				getAccountDetails: this._getAccountDetails,
				modalFormChange: this._onModalFormChange,
				modalViewChange: this._onModalViewChange }),
			React.createElement(InvestMessageContainerModal, {
				modalView: this.state.modalView })
		);
	}
});

if (typeof $("#invest-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(InvestMain, null), document.getElementById('invest-app-node'));
}