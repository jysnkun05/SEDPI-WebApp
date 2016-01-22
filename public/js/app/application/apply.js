/*======================================
=            Apply Messages            =
======================================*/

var ApplyMessageContainerModal = React.createClass({
	displayName: "ApplyMessageContainerModal",

	handleClick: function (e) {
		//console.log(e);
		this.props.buttonClick(e);
	},
	render: function () {
		var modalMessageComponent;
		//console.log(this.props.dialogView);
		switch (this.props.dialogView) {
			case 'VALIDATING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Validating Data"
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

			case 'SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Saving your Application"
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

			case 'SAVED':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Hurray! Your Application has been saved."
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"p",
							null,
							"Thank you for your interest in ",
							React.createElement(
								"strong",
								null,
								"Social Enterprise Development Partnerships, Inc."
							),
							" We appreciate you taking time to fill out our form. To learn more about SEDPI. Please visit our website at ",
							React.createElement(
								"a",
								{ href: "www.sedpi.com" },
								"www.sedpi.com"
							),
							"."
						),
						React.createElement(
							"p",
							null,
							"We hope that you become member soon."
						),
						React.createElement(
							"div",
							{ className: "pull-right" },
							React.createElement(
								"button",
								{ className: "btn btn-default", "data-dismiss": "modal" },
								"Close"
							)
						)
					)
				);
				break;

			case 'NON-MEMBER-DIALOG':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Finish Application?"
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"p",
								null,
								"Do you want to finish your application? By clicking continue, the system will save your application as non member. Which means, your application will not process and we will take note that you are interested to become a member. But don't worry, you can anytime if you have decide to be a member."
							)
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
										{ className: "btn btn-default", "data-dismiss": "modal" },
										"Wait, I change my mind."
									),
									React.createElement(
										"button",
										{ className: "btn btn-primary", onClick: this.handleClick.bind(null, 'SAVE-NON-MEMBER') },
										"Continue"
									)
								)
							)
						)
					)
				);
				break;

			case 'TRAINEE-DIALOG':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Submit Application?"
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"p",
								null,
								"Do you want to submit your application?"
							)
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
										{ className: "btn btn-default", "data-dismiss": "modal" },
										"Wait, I change my mind."
									),
									React.createElement(
										"button",
										{ className: "btn btn-primary", onClick: this.handleClick.bind(null, 'SAVE-TRAINEE') },
										"Continue"
									)
								)
							)
						)
					)
				);
				break;
		}
		return React.createElement(
			"div",
			{ className: "modal fade", id: "ApplyMessageContainerModal", role: "dialog" },
			React.createElement(
				"div",
				{ className: "modal-dialog", role: "document" },
				modalMessageComponent
			)
		);
	}
});

/*=====  End of Apply Messages  ======*/

/*===================================
=            Apply Views            =
===================================*/

var ApplyLandingView = React.createClass({
	displayName: "ApplyLandingView",

	getInitialState: function () {
		var applicantData = this.props.applicantData;
		return {
			firstName: applicantData === undefined ? '' : applicantData.firstName,
			middleName: applicantData === undefined ? '' : applicantData.middleName,
			lastName: applicantData === undefined ? '' : applicantData.lastName,
			email: applicantData === undefined ? '' : applicantData.email,
			tryCounter: 0
		};
	},
	validateApplicantInfo: function (afterValidation) {
		this.props.modalChange('VALIDATING');
		var postData = {
			firstName: this.state.firstName.trim(),
			middleName: this.state.middleName.trim(),
			lastName: this.state.lastName.trim(),
			email: this.state.email.trim()
		};

		this.setState({
			firstName: postData.firstName,
			middleName: postData.middleName,
			lastName: postData.lastName,
			email: postData.email
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validateApplicantInfo',
			type: 'post',
			data: {
				firstName: postData.firstName,
				lastName: postData.lastName,
				email: postData.email
			},
			success: function (response) {
				//console.log(response);
				if (response.status === 'failed') {
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
					$("#ApplyMessageContainerModal").modal('hide');
				}
				if (response.status === 'success') {
					this.props.dataChange(postData, 'applicantData');
					if (afterValidation === 'SAVE') {
						this.props.modalChange('NON-MEMBER-DIALOG');
					} else if (afterValidation === 'NEXT') {
						$("#ApplyMessageContainerModal").modal('hide');
						this.props.mainViewChange('SURVEY');
					}
				}
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
		this.validateApplicantInfo('NEXT');
	},
	handleClick: function (e) {
		this.validateApplicantInfo('SAVE');
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-8 col-md-offset-2" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"SEDPI Membership Application"
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-7" },
							React.createElement(
								"form",
								{ onSubmit: this.handleSubmit },
								React.createElement(
									"div",
									{ className: "form-group has-feedback", id: "fg-firstName" },
									React.createElement(
										"label",
										{ className: "control-label", htmlFor: "input-firstName" },
										"First Name *"
									),
									React.createElement("input", {
										type: "text",
										id: "input-firstName",
										className: "form-control",
										value: this.state.firstName,
										onChange: this.handleChange.bind(null, 'firstName') })
								),
								React.createElement(
									"div",
									{ className: "form-group has-feedback", id: "fg-middleName" },
									React.createElement(
										"label",
										null,
										"Middle Name"
									),
									React.createElement("input", {
										type: "text",
										id: "input-middleName",
										className: "form-control",
										value: this.state.middleName,
										onChange: this.handleChange.bind(null, 'middleName') })
								),
								React.createElement(
									"div",
									{ className: "form-group has-feedback", id: "fg-lastName" },
									React.createElement(
										"label",
										{ className: "control-label", htmlFor: "input-lastName" },
										"Last Name *"
									),
									React.createElement("input", {
										type: "text",
										id: "input-lastName",
										className: "form-control",
										value: this.state.lastName,
										onChange: this.handleChange.bind(null, 'lastName') })
								),
								React.createElement(
									"div",
									{ className: "form-group has-feedback", id: "fg-email" },
									React.createElement(
										"label",
										{ className: "control-label", htmlFor: "input-email" },
										"Email Address *"
									),
									React.createElement("input", {
										type: "text",
										id: "input-email",
										className: "form-control",
										value: this.state.email,
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
												{ type: "button", id: "btn-nonmember-application", className: "btn btn-default", onClick: this.handleClick.bind(null, 'validateApplication') },
												"Not Now"
											),
											React.createElement(
												"button",
												{ type: "submit", id: "btn-member-application", className: "btn btn-primary" },
												"I want to be a member"
											)
										)
									)
								)
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-5" },
							React.createElement(
								"div",
								{ className: "panel panel-default" },
								React.createElement(
									"div",
									{ className: "panel-body" },
									React.createElement(
										"h3",
										null,
										"SEDPI Membership Benefits"
									),
									React.createElement(
										"ul",
										null,
										React.createElement(
											"li",
											null,
											"Receive information on financial literacy and social entrepreneurship."
										),
										React.createElement(
											"li",
											null,
											"Allowed to invest and/or participate in SEDPI investments."
										),
										React.createElement(
											"li",
											null,
											"Receive updates on investment opportunities and updates on the performance of SEDPI investments."
										),
										React.createElement(
											"li",
											null,
											"Receive information on SEDPI training events."
										)
									),
									React.createElement(
										"h3",
										null,
										"SEDPI Membership Requirements"
									),
									React.createElement(
										"ul",
										null,
										React.createElement(
											"li",
											null,
											"Membership fee worth Php 100.00."
										),
										React.createElement(
											"li",
											null,
											"Annual membership fee worth Php 50.00."
										),
										React.createElement(
											"li",
											null,
											"Commit to implement learning from trainings attended."
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

/*----------  Apply Survey View  ----------*/

var ApplySurveyView = React.createClass({
	displayName: "ApplySurveyView",

	getInitialState: function () {
		var surveyData = this.props.surveyData;
		return {
			haveAttended: surveyData === undefined ? undefined : surveyData.haveAttended,
			willAttend: surveyData === undefined ? undefined : surveyData.willAttend,
			trainingType: surveyData === undefined ? undefined : surveyData.trainingType,
			willInvest: surveyData === undefined ? undefined : surveyData.willInvest
		};
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var postData = {
			haveAttended: this.state.haveAttended,
			willAttend: this.state.willAttend,
			trainingType: this.state.trainingType,
			willInvest: this.state.willInvest
		};

		if (this.state.willAttend === 'No' || this.state.willInvest === 'No') {
			this.props.modalChange('NON-MEMBER-DIALOG');
		} else if (this.state.willAttend === 'Yes') {
			this.props.dataChange(postData, 'surveyData');
			this.props.mainViewChange('PERSONAL');
		} else if (this.state.willInvest === 'Yes') {
			this.props.dataChange(postData, 'surveyData');
			this.props.mainViewChange('TOC');
		}
	},
	handleChange: function (name, e) {
		if (name === 'haveAttended') {
			this.setState({
				willAttend: undefined,
				trainingType: undefined,
				willInvest: undefined
			});
		}
		if (name === 'willAttend') {
			this.setState({ trainingType: undefined });
		}
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	render: function () {
		var radioHaveAttended = React.createElement(
			"div",
			{ className: "form-group" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-1" },
					React.createElement(
						"label",
						null,
						React.createElement("span", { className: "glyphicon glyphicon-menu-right" }),
						" Have you attended SEDPI Financial Literacy Training?"
					)
				)
			),
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-2" },
					React.createElement("input", {
						type: "radio",
						name: "haveAttended",
						value: "Yes",
						checked: this.state.haveAttended === 'Yes',
						onChange: this.handleChange.bind(null, 'haveAttended') }),
					" Yes, I have attended a SEDPI Financial Literacy Training."
				),
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-2" },
					React.createElement("input", {
						type: "radio",
						name: "haveAttended",
						value: "No",
						checked: this.state.haveAttended === 'No',
						onChange: this.handleChange.bind(null, 'haveAttended') }),
					" ",
					"No, I haven't attended a SEDPI Financial Literacy Training."
				)
			)
		);

		var radioWillAttend = React.createElement(
			"div",
			{ className: "form-group" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-1" },
					React.createElement(
						"label",
						null,
						React.createElement("span", { className: "glyphicon glyphicon-menu-right" }),
						" Do you want to attend a SEDPI Financial Literacy Training?"
					)
				)
			),
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-2" },
					React.createElement("input", {
						type: "radio",
						name: "willAttend",
						value: "Yes",
						checked: this.state.willAttend === 'Yes',
						onChange: this.handleChange.bind(null, 'willAttend') }),
					" Yes, I would love to."
				),
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-2" },
					React.createElement("input", {
						type: "radio",
						name: "willAttend",
						value: "No",
						checked: this.state.willAttend === 'No',
						onChange: this.handleChange.bind(null, 'willAttend') }),
					" ",
					"No, I don't want to attend for now."
				)
			)
		);

		var radioTrainingType = React.createElement(
			"div",
			{ className: "form-group" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-1" },
					React.createElement(
						"label",
						null,
						React.createElement("span", { className: "glyphicon glyphicon-menu-right" }),
						" What SEDPI Financial Literacy Training do you want to attend?"
					)
				)
			),
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-2" },
					React.createElement("input", {
						type: "radio",
						name: "trainingType",
						value: "Live",
						checked: this.state.trainingType === 'Live',
						onChange: this.handleChange.bind(null, 'trainingType') }),
					" Live Financial Literacy Training."
				),
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-2" },
					React.createElement("input", {
						type: "radio",
						name: "trainingType",
						value: "Online",
						checked: this.state.trainingType === 'Online',
						onChange: this.handleChange.bind(null, 'trainingType') }),
					" Online Financial Literacy Training."
				)
			)
		);

		var radioWillInvest = React.createElement(
			"div",
			{ className: "form-group" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-1" },
					React.createElement(
						"label",
						null,
						React.createElement("span", { className: "glyphicon glyphicon-menu-right" }),
						" Do you want to invest in SEDPI?"
					)
				)
			),
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-2" },
					React.createElement("input", {
						type: "radio",
						name: "willInvest",
						value: "Yes",
						checked: this.state.willInvest === 'Yes',
						onChange: this.handleChange.bind(null, 'willInvest') }),
					" Yes, I want to invest in SEDPI."
				),
				React.createElement(
					"div",
					{ className: "col-md-10 col-md-offset-2" },
					React.createElement("input", {
						type: "radio",
						name: "willInvest",
						value: "No",
						checked: this.state.willInvest === 'No',
						onChange: this.handleChange.bind(null, 'willInvest') }),
					" ",
					"No, I don't want to invest for now."
				)
			)
		);
		return React.createElement(
			"div",
			{ className: "col-md-8 col-md-offset-2" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"SEDPI Membership Application"
						)
					),
					React.createElement(
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
														"h2",
														null,
														"Things we would to know from you"
													)
												),
												React.createElement(
													"div",
													{ className: "row" },
													radioHaveAttended,
													this.state.haveAttended === 'No' ? radioWillAttend : '',
													this.state.haveAttended === 'Yes' ? radioWillInvest : '',
													this.state.willAttend === 'Yes' ? radioTrainingType : ''
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
																{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'APPLICANT') },
																"Back"
															),
															React.createElement(
																"button",
																{
																	type: "submit",
																	className: "btn btn-primary",
																	disabled: this.state.willInvest === undefined && this.state.willAttend !== 'No' && this.state.trainingType === undefined },
																this.state.willAttend === 'No' || this.state.willInvest === 'No' ? 'Finish' : 'Continue'
															)
														)
													)
												)
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

/*----------  Apply TOC View  ----------*/

var ApplyTOCView = React.createClass({
	displayName: "ApplyTOCView",

	getInitialState: function () {
		return {
			tocChecked: this.props.tocData === undefined ? false : this.props.tocData.tocChecked
		};
	},
	handleChange: function (e) {
		if (e === 'tocChecked') {
			if ($("input[name=isTOCAccepted]").is(':checked')) this.setState({ tocChecked: true });else this.setState({ tocChecked: false });
		}
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.dataChange({ tocChecked: this.state.tocChecked }, 'tocData');
		this.props.mainViewChange('PERSONAL');
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-8 col-md-offset-2" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"SEDPI Membership Application"
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-10 col-md-offset-1" },
							React.createElement(
								"form",
								{ onSubmit: this.handleSubmit },
								React.createElement(
									"h2",
									null,
									"SEDPI Preferred Shares Dividend Rates"
								),
								React.createElement(
									"p",
									null,
									"The dividend rate for SEDPI Preferred Shares as follows:"
								),
								React.createElement(
									"div",
									{ className: "col-md-12" },
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
													"Investment(in pesos)"
												),
												React.createElement(
													"th",
													{ className: "text-center" },
													"Dividend Rates"
												)
											)
										),
										React.createElement(
											"tbody",
											null,
											React.createElement(
												"tr",
												{ className: "text-center" },
												React.createElement(
													"td",
													null,
													"Php 5,000 to Php 50,000"
												),
												React.createElement(
													"td",
													null,
													"3% per Annum"
												)
											),
											React.createElement(
												"tr",
												{ className: "text-center" },
												React.createElement(
													"td",
													null,
													"Php 50,001 to Php 250,000"
												),
												React.createElement(
													"td",
													null,
													"4% per Annum"
												)
											),
											React.createElement(
												"tr",
												{ className: "text-center" },
												React.createElement(
													"td",
													null,
													"Php 250,001 to Php 500,000"
												),
												React.createElement(
													"td",
													null,
													"5% per Annum"
												)
											),
											React.createElement(
												"tr",
												{ className: "text-center" },
												React.createElement(
													"td",
													null,
													"Php 500,001 ~ "
												),
												React.createElement(
													"td",
													null,
													"6% per Annum"
												)
											)
										)
									),
									React.createElement(
										"p",
										{ className: "text-justify" },
										"There is a ",
										React.createElement(
											"strong",
											null,
											"pre-termination rate of 3%"
										),
										" if the investment is withdrawn before ",
										React.createElement(
											"strong",
											null,
											"one (1) year"
										),
										". The dividends are variable - they could go lower or higher each year and only SEDPI can dictate what the dividend rate is for a specific year."
									),
									React.createElement(
										"p",
										{ className: "text-justify" },
										"As preferred stockholder, you do not have the right to vote and be voted upon in SEDPI. You take the risk and full responsibility in investing in SEDPI. All remittance fees and charges are to your account and SEDPI shall not bear any cost of remittance to your investment."
									),
									React.createElement(
										"div",
										{ className: "form-group" },
										React.createElement("input", {
											type: "checkbox",
											checked: this.state.tocChecked,
											name: "isTOCAccepted",
											onChange: this.handleChange.bind(null, 'tocChecked') }),
										" I have read and accept the Terms and Conditions."
									)
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
												{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'SURVEY') },
												"Back"
											),
											React.createElement(
												"button",
												{ type: "submit", className: "btn btn-primary", disabled: !this.state.tocChecked },
												"Continue"
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

/*----------  Apply Personal View  ----------*/

var ApplyPersonalView = React.createClass({
	displayName: "ApplyPersonalView",

	getInitialState: function () {
		var applicantData = this.props.applicantData;
		var personalData = this.props.personalData;
		return {
			firstName: personalData === undefined ? applicantData.firstName : personalData.firstName,
			middleName: personalData === undefined ? applicantData.middleName : personalData.middleName,
			lastName: personalData === undefined ? applicantData.lastName : personalData.lastName,
			sex: personalData === undefined ? '' : personalData.sex,
			birthDate: personalData === undefined ? '' : personalData.birthDate,
			birthPlace: personalData === undefined ? '' : personalData.birthPlace,
			civilStatus: personalData === undefined ? '' : personalData.civilStatus,
			otherCivilStatus: personalData === undefined ? '' : personalData.otherCivilStatus,
			spouseName: personalData === undefined ? '' : personalData.spouseName,
			nationality: personalData === undefined ? '' : personalData.nationality,
			occupation: personalData === undefined ? '' : personalData.occupation,
			sssGsis: personalData === undefined ? '' : personalData.sssGsis,
			tin: personalData === undefined ? '' : personalData.tin,
			annualIncome: personalData === undefined ? '' : personalData.annualIncome
		};
	},
	componentDidMount: function () {
		var that = this;
		$("#datetimepicker-birth-date").datetimepicker({
			format: "MM/DD/YYYY",
			maxDate: moment(),
			useCurrent: false

		}).on('dp.change', function (event) {
			that.setState({
				birthDate: moment(event.date).format('MM/DD/YYYY')
			});
			console.log('%cinput state changed: birthDate' + ' : ' + that.state.birthDate, 'color: aqua');
		});
	},
	validatePersonalInfo: function () {
		this.props.modalChange('VALIDATING');
		var postData = {
			firstName: this.state.firstName.trim(),
			middleName: this.state.middleName.trim(),
			lastName: this.state.lastName.trim(),
			sex: this.state.sex,
			birthDate: this.state.birthDate,
			birthPlace: this.state.birthPlace.trim(),
			civilStatus: this.state.civilStatus,
			otherCivilStatus: this.state.otherCivilStatus.trim(),
			spouseName: this.state.spouseName.trim(),
			nationality: this.state.nationality.trim(),
			occupation: this.state.occupation.trim(),
			sssGsis: this.state.sssGsis.trim(),
			tin: this.state.tin.trim(),
			annualIncome: this.state.annualIncome
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validatePersonalInfo',
			type: 'POST',
			data: {
				firstName: postData.firstName,
				lastName: postData.lastName,
				sex: postData.sex,
				birthDate: postData.birthDate,
				civilStatus: postData.civilStatus,
				otherCivilStatus: postData.otherCivilStatus,
				annualIncome: postData.annualIncome
			},
			success: function (response) {
				console.log(response.status);
				$("#ApplyMessageContainerModal").modal('hide');
				if (response.status === 'failed') {
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				} else if (response.status === 'success') {
					this.props.dataChange(postData, 'personalData');
					this.props.dataChange({
						firstName: postData.firstName,
						middleName: postData.middleName,
						lastName: postData.lastName,
						email: this.props.applicantData.email
					}, 'applicantData');
					this.props.mainViewChange('CONTACT');
				}
			}.bind(this)
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
		console.log(e.target.value);
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.validatePersonalInfo();
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-10 col-md-offset-1" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"SEDPI Membership Application"
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-3" },
							React.createElement(
								"ul",
								{ className: "nav nav-pills nav-stacked" },
								React.createElement(
									"li",
									{ className: "active" },
									React.createElement(
										"a",
										null,
										"Personal Information"
									)
								),
								React.createElement(
									"li",
									null,
									React.createElement(
										"a",
										null,
										"Contact Information"
									)
								),
								this.props.surveyData.willInvest === 'Yes' ? React.createElement(
									"li",
									null,
									React.createElement(
										"a",
										null,
										"Investment Information"
									)
								) : null,
								this.props.surveyData.willInvest === 'Yes' ? React.createElement(
									"li",
									null,
									React.createElement(
										"a",
										null,
										"Beneficiary Information"
									)
								) : null
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-9" },
							React.createElement(
								"div",
								{ className: "panel panel-default" },
								React.createElement(
									"div",
									{ className: "panel-heading" },
									"Personal Information",
									React.createElement(
										"div",
										{ className: "pull-right" },
										React.createElement(
											"p",
											{ className: "text-right" },
											React.createElement(
												"i",
												null,
												"1 of ",
												this.props.surveyData.willAttend === 'Yes' ? '2' : '4'
											)
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
												"form",
												{ onSubmit: this.handleSubmit },
												React.createElement(
													"div",
													{ className: "form-group" },
													React.createElement(
														"label",
														null,
														"Member Name"
													),
													React.createElement(
														"div",
														{ className: "row" },
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group has-feedback", id: "fg-firstName" },
																React.createElement("input", {
																	type: "text",
																	id: "input-firstName",
																	className: "form-control",
																	placeholder: "First Name *",
																	value: this.state.firstName,
																	onChange: this.handleChange.bind(null, 'firstName') })
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group has-feedback" },
																React.createElement("input", {
																	type: "text",
																	className: "form-control",
																	placeholder: "Middle Name",
																	value: this.state.middleName,
																	onChange: this.handleChange.bind(null, 'middleName') })
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group has-feedback", id: "fg-lastName" },
																React.createElement("input", {
																	type: "text",
																	id: "input-lastName",
																	className: "form-control",
																	placeholder: "Last Name *",
																	value: this.state.lastName,
																	onChange: this.handleChange.bind(null, 'lastName') })
															)
														)
													),
													React.createElement(
														"div",
														{ className: "row" },
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group has-feedback", id: "fg-sex" },
																React.createElement(
																	"label",
																	{ className: "control-label", htmlFor: "input-sex" },
																	"Sex *"
																),
																React.createElement(
																	"select",
																	{
																		className: "form-control",
																		id: "input-sex",
																		value: this.state.sex,
																		onChange: this.handleChange.bind(null, 'sex') },
																	React.createElement(
																		"option",
																		{ value: "", disabled: true },
																		"Please choose..."
																	),
																	React.createElement(
																		"option",
																		{ value: "male" },
																		"Male"
																	),
																	React.createElement(
																		"option",
																		{ value: "female" },
																		"Female"
																	)
																)
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group has-feedback", id: "fg-birthDate" },
																React.createElement(
																	"label",
																	{ className: "control-label", htmlFor: "input-birthDate" },
																	"Birth Date *"
																),
																React.createElement(
																	"div",
																	{ className: "input-group date", id: "datetimepicker-birth-date" },
																	React.createElement("input", {
																		type: "text",
																		id: "input-birthDate",
																		className: "form-control",
																		size: "16",
																		placeholder: "mm/dd/yyyy",
																		value: this.state.birthDate,
																		onChange: this.handleChange.bind(null, 'birthDate') }),
																	React.createElement(
																		"span",
																		{ className: "input-group-addon" },
																		React.createElement("span", { className: "glyphicon glyphicon-calendar" })
																	)
																)
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement(
																	"label",
																	null,
																	"Birth Place"
																),
																React.createElement("input", {
																	type: "text",
																	className: "form-control",
																	value: this.state.birthPlace,
																	onChange: this.handleChange.bind(null, 'birthPlace') })
															)
														)
													),
													React.createElement(
														"div",
														{ className: "row" },
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group has-feedback", id: "fg-civilStatus" },
																React.createElement(
																	"label",
																	{ className: "control-label", htmlFor: "input-civilStatus" },
																	"Civil Status *"
																),
																React.createElement(
																	"select",
																	{
																		className: "form-control",
																		id: "input-civilStatus",
																		value: this.state.civilStatus,
																		onChange: this.handleChange.bind(null, 'civilStatus') },
																	React.createElement(
																		"option",
																		{ value: "", disabled: true },
																		"Please choose..."
																	),
																	React.createElement(
																		"option",
																		{ value: "single" },
																		"Single"
																	),
																	React.createElement(
																		"option",
																		{ value: "married" },
																		"Married"
																	),
																	React.createElement(
																		"option",
																		{ value: "annulled" },
																		"Annulled"
																	),
																	React.createElement(
																		"option",
																		{ value: "divorced" },
																		"Divorced"
																	),
																	React.createElement(
																		"option",
																		{ value: "widowed" },
																		"Widowed"
																	),
																	React.createElement(
																		"option",
																		{ value: "others" },
																		"Others"
																	)
																)
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group has-feedback", id: "fg-otherCivilStatus" },
																React.createElement(
																	"label",
																	{ className: "control-label", htmlFor: "input-otherCivilStatus" },
																	"If Others,"
																),
																React.createElement("input", {
																	type: "text",
																	id: "input-otherCivilStatus",
																	className: "form-control",
																	placeholder: "Please specify...",
																	value: this.state.civilStatus === 'others' ? this.state.otherCivilStatus : '',
																	disabled: this.state.civilStatus !== 'others',
																	onChange: this.handleChange.bind(null, 'otherCivilStatus') })
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement(
																	"label",
																	null,
																	"Spouse Name"
																),
																React.createElement("input", {
																	type: "text",
																	className: "form-control",
																	value: this.state.civilStatus === 'married' ? this.state.spouseName : '',
																	disabled: this.state.civilStatus !== 'married',
																	onChange: this.handleChange.bind(null, 'spouseName') })
															)
														)
													),
													React.createElement(
														"div",
														{ className: "row" },
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement(
																	"label",
																	null,
																	"Nationality"
																),
																React.createElement("input", {
																	type: "text",
																	className: "form-control",
																	value: this.state.nationality,
																	onChange: this.handleChange.bind(null, 'nationality') })
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement(
																	"label",
																	null,
																	"Occupation"
																),
																React.createElement("input", {
																	type: "text",
																	className: "form-control",
																	value: this.state.occupation,
																	onChange: this.handleChange.bind(null, 'occupation') })
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement(
																	"label",
																	null,
																	"TIN"
																),
																React.createElement("input", {
																	type: "text",
																	className: "form-control",
																	value: this.state.tin,
																	onChange: this.handleChange.bind(null, 'tin') })
															)
														)
													),
													React.createElement(
														"div",
														{ className: "row" },
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement(
																	"label",
																	null,
																	"SSS/GSIS"
																),
																React.createElement("input", {
																	type: "text",
																	className: "form-control",
																	value: this.state.sssGsis,
																	onChange: this.handleChange.bind(null, 'sssGsis') })
															)
														),
														React.createElement(
															"div",
															{ className: "col-md-4" },
															React.createElement(
																"div",
																{ className: "form-group has-feedback", id: "fg-annualIncome" },
																React.createElement(
																	"label",
																	{ className: "control-label", htmlFor: "input-annualIncome" },
																	"Annual Income *"
																),
																React.createElement(
																	"select",
																	{
																		className: "form-control",
																		id: "input-annualIncome",
																		value: this.state.annualIncome,
																		onChange: this.handleChange.bind(null, 'annualIncome') },
																	React.createElement(
																		"option",
																		{ value: "", disabled: true },
																		"Please choose..."
																	),
																	React.createElement(
																		"option",
																		{ value: "1" },
																		"Over Php 5 million"
																	),
																	React.createElement(
																		"option",
																		{ value: "2" },
																		"Php 1 Million to Php 5 Million"
																	),
																	React.createElement(
																		"option",
																		{ value: "3" },
																		"Php 500,000 to Php 1 Million"
																	),
																	React.createElement(
																		"option",
																		{ value: "4" },
																		"Php 300,000 to Php 500,000"
																	),
																	React.createElement(
																		"option",
																		{ value: "5" },
																		"Below Php 300,000"
																	)
																)
															)
														)
													)
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
																{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'SURVEY') },
																"Back"
															),
															React.createElement(
																"button",
																{ type: "submit", className: "btn btn-primary" },
																"Next"
															)
														)
													)
												)
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

/*----------  Apply Contact View  ----------*/

var ApplyContactView = React.createClass({
	displayName: "ApplyContactView",

	getInitialState: function () {
		var applicantData = this.props.applicantData;
		var contactData = this.props.contactData;
		return {
			countries: undefined,
			sameChecked: contactData === undefined ? false : contactData.sameChecked,
			presentAddress: contactData === undefined ? '' : contactData.presentAddress,
			presentCountry: contactData === undefined ? '' : contactData.presentCountry,
			permanentAddress: contactData === undefined ? '' : contactData.permanentAddress,
			permanentCountry: contactData === undefined ? '' : contactData.permanentCountry,
			mailingAddress: contactData === undefined ? '' : contactData.mailingAddress,
			mobile: contactData === undefined ? '' : contactData.mobile,
			email: contactData === undefined ? applicantData.email : contactData.email
		};
	},
	componentWillMount: function () {
		this.getCountryOptions();
	},
	getCountryOptions: function () {
		$.ajax({
			url: '/api/utilities/getCountryList',
			type: 'POST',
			cache: false,
			dataType: 'json',
			success: function (countries) {
				this.setState({ countries: countries });
			}.bind(this)
		});
	},
	validateContactInfo: function () {
		var postData = {
			presentAddress: this.state.presentAddress.trim(),
			presentCountry: this.state.presentCountry,
			permanentAddress: this.state.sameChecked ? this.state.presentAddress.trim() : this.state.permanentAddress.trim(),
			permanentCountry: this.state.sameChecked ? this.state.presentCountry : this.state.permanentCountry,
			mailingAddress: this.state.sameChecked ? 'present' : this.state.mailingAddress,
			mobile: this.state.mobile.trim(),
			email: this.state.email.trim(),
			sameChecked: this.state.sameChecked
		};

		this.setState({
			presentAddress: postData.presentAddress,
			permanentAddress: postData.permanentAddress,
			mobile: postData.mobile,
			email: postData.email
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validateContactInfo',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if (response.status === 'failed') {
					$("#ApplyMessageContainerModal").modal('hide');
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				} else if (response.status === 'success') {
					this.props.dataChange(postData, 'contactData');
					this.props.dataChange({
						firstName: postData.firstName,
						middleName: postData.middleName,
						lastName: postData.lastName,
						email: this.props.applicantData.email
					}, 'applicantData');
					if (this.props.surveyData.willAttend === 'Yes') {
						this.props.modalChange('TRAINEE-DIALOG');
					} else if (this.props.surveyData.willInvest === 'Yes') {
						this.props.mainViewChange('INVESTMENT');
						$("#ApplyMessageContainerModal").modal('hide');
					}
				}
			}.bind(this)
		});
	},
	handleClick: function (event) {
		if (event === 'sameChecked') {
			if ($("input[name=isSameAsPresentAddress]").is(':checked')) this.setState({ sameChecked: true });else this.setState({ sameChecked: false });
		}
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.modalChange('VALIDATING');
		this.validateContactInfo();
	},
	render: function () {
		var countryOptions;
		if (this.state.countries !== undefined) {
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
			{ className: "col-md-10 col-md-offset-1" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"SEDPI Membership Application"
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-3" },
							React.createElement(
								"ul",
								{ className: "nav nav-pills nav-stacked" },
								React.createElement(
									"li",
									{ className: "done" },
									React.createElement(
										"a",
										null,
										"Personal Information ",
										React.createElement("i", { className: "fa fa-check-circle fa-fw" })
									)
								),
								React.createElement(
									"li",
									{ className: "active" },
									React.createElement(
										"a",
										null,
										"Contact Information"
									)
								),
								this.props.surveyData.willInvest === 'Yes' ? React.createElement(
									"li",
									null,
									React.createElement(
										"a",
										null,
										"Investment Information"
									)
								) : null,
								this.props.surveyData.willInvest === 'Yes' ? React.createElement(
									"li",
									null,
									React.createElement(
										"a",
										null,
										"Beneficiary Information"
									)
								) : null
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-9" },
							React.createElement(
								"div",
								{ className: "panel panel-default" },
								React.createElement(
									"div",
									{ className: "panel-heading" },
									"Contact Information",
									React.createElement(
										"div",
										{ className: "pull-right" },
										React.createElement(
											"p",
											{ className: "text-right" },
											React.createElement(
												"i",
												null,
												"1 of ",
												this.props.surveyData.willAttend === 'Yes' ? '2' : '4'
											)
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
												"form",
												{ onSubmit: this.handleSubmit },
												React.createElement(
													"div",
													{ className: "row" },
													React.createElement(
														"div",
														{ className: "col-md-8" },
														React.createElement(
															"div",
															{ className: "form-group has-feedback", id: "fg-presentAddress" },
															React.createElement(
																"label",
																{ className: "control-label", htmlFor: "input-presentAddress" },
																"Present Address *"
															),
															React.createElement("input", {
																type: "text",
																id: "input-presentAddress",
																className: "form-control",
																value: this.state.presentAddress,
																onChange: this.handleChange.bind(null, 'presentAddress') })
														)
													),
													React.createElement(
														"div",
														{ className: "col-md-4" },
														React.createElement(
															"div",
															{ className: "form-group has-feedback", id: "fg-presentCountry" },
															React.createElement(
																"label",
																{ className: "control-label", htmlFor: "input-presentCountry" },
																"Present Country *"
															),
															React.createElement(
																"select",
																{
																	id: "input-presentCountry",
																	className: "form-control",
																	value: this.state.presentCountry,
																	onChange: this.handleChange.bind(null, 'presentCountry') },
																React.createElement(
																	"option",
																	{ value: "", disabled: true },
																	"Please select..."
																),
																countryOptions
															)
														)
													),
													React.createElement(
														"div",
														{ className: "col-md-12" },
														React.createElement(
															"div",
															{ className: "form-group" },
															React.createElement("input", {
																type: "checkbox",
																name: "isSameAsPresentAddress",
																onClick: this.handleClick.bind(null, 'sameChecked') }),
															" Same as Present Address"
														)
													),
													React.createElement(
														"div",
														{ className: "col-md-8" },
														React.createElement(
															"div",
															{ className: "form-group has-feedback", id: "fg-permanentAddress" },
															React.createElement(
																"label",
																{ className: "control-label", htmlFor: "input-permanentAddress" },
																"Permanent Address *"
															),
															React.createElement("input", {
																type: "text",
																id: "input-permanentAddress",
																className: "form-control",
																value: this.state.sameChecked ? this.state.presentAddress : this.state.permanentAddress,
																disabled: this.state.sameChecked,
																onChange: this.handleChange.bind(null, 'permanentAddress') })
														)
													),
													React.createElement(
														"div",
														{ className: "col-md-4" },
														React.createElement(
															"div",
															{ className: "form-group has-feedback", id: "fg-permanentCountry" },
															React.createElement(
																"label",
																{ className: "control-label", htmlFor: "input-permanentCountry" },
																"Permanent Country *"
															),
															React.createElement(
																"select",
																{
																	className: "form-control",
																	id: "input-permanentCountry",
																	value: this.state.sameChecked ? this.state.presentCountry : this.state.permanentCountry,
																	disabled: this.state.sameChecked,
																	onChange: this.handleChange.bind(null, 'permanentCountry') },
																React.createElement(
																	"option",
																	{ value: "", disabled: true },
																	"Please select..."
																),
																countryOptions
															)
														)
													),
													React.createElement(
														"div",
														{ className: "col-md-4" },
														React.createElement(
															"div",
															{ className: "form-group has-feedback", id: "fg-mailingAddress" },
															React.createElement(
																"label",
																{ className: "control-label", htmlFor: "input-mailingAddress" },
																"Mailing Address *"
															),
															React.createElement(
																"select",
																{
																	className: "form-control",
																	id: "input-mailingAddress",
																	value: this.state.sameChecked ? 'present' : this.state.mailingAddress,
																	disabled: this.state.sameChecked,
																	onChange: this.handleChange.bind(null, 'mailingAddress') },
																React.createElement(
																	"option",
																	{ value: "", disabled: true },
																	"Please select..."
																),
																React.createElement(
																	"option",
																	{ value: "present" },
																	"Present Address"
																),
																React.createElement(
																	"option",
																	{ value: "permanent" },
																	"Permanent Address"
																)
															)
														)
													),
													React.createElement(
														"div",
														{ className: "col-md-4" },
														React.createElement(
															"div",
															{ className: "form-group has-feedback", id: "fg-mobile" },
															React.createElement(
																"label",
																{ className: "control-label", htmlFor: "input-mobile" },
																"Mobile *"
															),
															React.createElement("input", {
																type: "text",
																id: "input-mobile",
																className: "form-control",
																value: this.state.mobile,
																placeholder: "+639XXXXXXXXX",
																onChange: this.handleChange.bind(null, 'mobile') })
														)
													),
													React.createElement(
														"div",
														{ className: "col-md-4" },
														React.createElement(
															"div",
															{ className: "form-group has-feedback", id: "fg-email" },
															React.createElement(
																"label",
																{ className: "control-label", htmlFor: "input-email" },
																"Email Address *"
															),
															React.createElement("input", {
																type: "text",
																id: "input-email",
																className: "form-control",
																value: this.state.email,
																onChange: this.handleChange.bind(null, 'email') })
														)
													)
												),
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
																"div",
																{ className: "pull-right" },
																React.createElement(
																	"div",
																	{ className: "btn-group" },
																	React.createElement(
																		"button",
																		{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'PERSONAL') },
																		"Back"
																	),
																	React.createElement(
																		"button",
																		{ type: "submit", className: "btn btn-primary" },
																		this.props.surveyData.willInvest === 'Yes' ? "Next" : "Submit"
																	)
																)
															)
														)
													)
												)
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

/*----------  Apply Investment View  ----------*/

var ApplyInvestmentView = React.createClass({
	displayName: "ApplyInvestmentView",

	getInitialState: function () {
		var investmentData = this.props.investmentData;
		return {
			amountInvested: investmentData === undefined ? '' : investmentData.amountInvested,
			investmentDate: investmentData === undefined ? moment().format('MM/DD/YYYY') : moment(investmentData.investmentDate).format('MM/DD/YYYY'),
			sourceOfFunds: '',
			fundSalary: false,
			fundRetirement: false,
			fundBusiness: false,
			fundInvestment: false,
			fundOthers: false
		};
	},
	componentDidMount: function () {
		var that = this;
		$("#datetimepicker-investment-date").datetimepicker({
			format: "MM/DD/YYYY",
			minDate: moment(),
			useCurrent: true

		}).on('dp.change', function (event) {
			that.setState({
				investmentDate: moment(event.date).format('MM/DD/YYYY')
			});
			console.log('%cinput state changed: investmentDate' + ' : ' + that.state.investmentDate, 'color: aqua');
		});
	},
	validateInvestmentInfo: function () {
		var sourceOfFunds = [];
		if (this.state.fundSalary) sourceOfFunds.push('Salary');
		if (this.state.fundRetirement) sourceOfFunds.push('Retirement');
		if (this.state.fundBusiness) sourceOfFunds.push('Business');
		if (this.state.fundInvestment) sourceOfFunds.push('Investment');
		if (this.state.fundOthers) sourceOfFunds.push('Others');

		var postData = {
			amountInvested: this.state.amountInvested.trim(),
			investmentDate: this.state.investmentDate.trim(),
			sourceOfFunds: sourceOfFunds.toString()
		};

		this.setState({
			amountInvested: postData.amountInvested,
			investmentDate: this.state.investmentDate
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validateInvestmentInfo',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				$("#ApplyMessageContainerModal").modal('hide');
				if (response.status === 'failed') {
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				} else if (response.status === 'success') {
					this.props.dataChange(postData, 'investmentData');
					this.props.mainViewChange('BENEFICIARY');
				}
			}.bind(this)
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	sourceOfFundsChange: function (e) {
		switch (e) {
			case 'fundSalary':
				if ($("input[name=fundSalary]").is(':checked')) this.setState({ fundSalary: true });else this.setState({ fundSalary: false });
				break;

			case 'fundRetirement':
				if ($("input[name=fundRetirement]").is(':checked')) this.setState({ fundRetirement: true });else this.setState({ fundRetirement: false });
				break;

			case 'fundBusiness':
				if ($("input[name=fundBusiness]").is(':checked')) this.setState({ fundBusiness: true });else this.setState({ fundBusiness: false });
				break;

			case 'fundInvestment':
				if ($("input[name=fundInvestment]").is(':checked')) this.setState({ fundInvestment: true });else this.setState({ fundInvestment: false });
				break;

			case 'fundOthers':
				if ($("input[name=fundOthers]").is(':checked')) this.setState({ fundOthers: true });else this.setState({ fundOthers: false });
				break;
		}
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.modalChange('VALIDATING');
		this.validateInvestmentInfo();
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-10 col-md-offset-1" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"SEDPI Membership Application"
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-3" },
							React.createElement(
								"ul",
								{ className: "nav nav-pills nav-stacked" },
								React.createElement(
									"li",
									{ className: "done" },
									React.createElement(
										"a",
										null,
										"Personal Information ",
										React.createElement("i", { className: "fa fa-check-circle fa-fw" })
									)
								),
								React.createElement(
									"li",
									{ className: "done" },
									React.createElement(
										"a",
										null,
										"Contact Information ",
										React.createElement("i", { className: "fa fa-check-circle fa-fw" })
									)
								),
								React.createElement(
									"li",
									{ className: "active" },
									React.createElement(
										"a",
										null,
										"Investment Information"
									)
								),
								React.createElement(
									"li",
									null,
									React.createElement(
										"a",
										null,
										"Beneficiary Information"
									)
								)
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-9" },
							React.createElement(
								"div",
								{ className: "panel panel-default" },
								React.createElement(
									"div",
									{ className: "panel-heading" },
									"Investment Information",
									React.createElement(
										"div",
										{ className: "pull-right" },
										React.createElement(
											"p",
											{ className: "text-right" },
											React.createElement(
												"i",
												null,
												"1 of ",
												this.props.surveyData.willAttend === 'Yes' ? '2' : '4'
											)
										)
									)
								),
								React.createElement(
									"div",
									{ className: "panel-body" },
									React.createElement(
										"form",
										{ onSubmit: this.handleSubmit },
										React.createElement(
											"div",
											{ className: "row" },
											React.createElement(
												"div",
												{ className: "col-md-6" },
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-amountInvested" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-amountInvested" },
														"Amount to be Invested *"
													),
													React.createElement("input", {
														type: "text",
														id: "input-amountInvested",
														className: "form-control",
														placeholder: "0.00",
														value: this.state.amountInvested,
														onChange: this.handleChange.bind(null, 'amountInvested') })
												),
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-investmentDate" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-investmentDate" },
														"When do you intended to Invest *"
													),
													React.createElement(
														"div",
														{ className: "input-group date", id: "datetimepicker-investment-date" },
														React.createElement("input", {
															type: "text",
															id: "input-investmentDate",
															className: "form-control",
															size: "16",
															value: this.state.investmentDate,
															onChange: this.handleChange.bind(null, 'investmentDate'),
															placeholder: "mm/dd/yyyy" }),
														React.createElement(
															"span",
															{ className: "input-group-addon" },
															React.createElement("span", { className: "glyphicon glyphicon-calendar" })
														)
													)
												)
											),
											React.createElement(
												"div",
												{ className: "col-md-6" },
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-sourceOfFunds" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-sourceOfFunds" },
														"Source of Funds * ",
														React.createElement(
															"small",
															null,
															"(multiple answers)"
														)
													),
													React.createElement(
														"div",
														{ className: "panel panel-default", id: "input-sourceOfFunds" },
														React.createElement(
															"div",
															{ className: "panel-body" },
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement("input", {
																	type: "checkbox",
																	name: "fundSalary",
																	checked: this.state.fundSalary,
																	onChange: this.sourceOfFundsChange.bind(null, 'fundSalary') }),
																" Salary"
															),
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement("input", {
																	type: "checkbox",
																	name: "fundRetirement",
																	checked: this.state.fundRetirement,
																	onChange: this.sourceOfFundsChange.bind(null, 'fundRetirement') }),
																" Retirement"
															),
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement("input", {
																	type: "checkbox",
																	name: "fundBusiness",
																	checked: this.state.fundBusiness,
																	onChange: this.sourceOfFundsChange.bind(null, 'fundBusiness') }),
																" Business"
															),
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement("input", {
																	type: "checkbox",
																	name: "fundInvestment",
																	checked: this.state.fundInvestment,
																	onChange: this.sourceOfFundsChange.bind(null, 'fundInvestment') }),
																" Investment"
															),
															React.createElement(
																"div",
																{ className: "form-group" },
																React.createElement("input", {
																	type: "checkbox",
																	name: "fundOthers",
																	checked: this.state.fundOthers,
																	onChange: this.sourceOfFundsChange.bind(null, 'fundOthers') }),
																" Others"
															)
														)
													)
												)
											)
										),
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
														"div",
														{ className: "pull-right" },
														React.createElement(
															"div",
															{ className: "btn-group" },
															React.createElement(
																"button",
																{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'CONTACT') },
																"Back"
															),
															React.createElement(
																"button",
																{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'BENEFICIARY') },
																"Skip"
															),
															React.createElement(
																"button",
																{ type: "submit", className: "btn btn-primary" },
																"Next"
															)
														)
													)
												)
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

/*----------  Apply Beneficiary View  ----------*/

var ApplyBeneficiaryView = React.createClass({
	displayName: "ApplyBeneficiaryView",

	getInitialState: function () {
		return {
			b1Name: '',
			b1BirthDate: '',
			b1Address: '',
			b1Relationship: '',
			b2Name: '',
			b2BirthDate: '',
			b2Address: '',
			b2Relationship: ''
		};
	},
	componentDidMount: function () {
		var that = this;
		$("#datetimepicker-b1BirthDate").datetimepicker({
			format: "MM/DD/YYYY",
			maxDate: moment(),
			useCurrent: false

		}).on('dp.change', function (event) {
			that.setState({
				b1BirthDate: moment(event.date).format('MM/DD/YYYY')
			});
			console.log('%cinput state changed: birthDate' + ' : ' + that.state.b1BirthDate, 'color: aqua');
		});

		$("#datetimepicker-b2BirthDate").datetimepicker({
			format: "MM/DD/YYYY",
			maxDate: moment(),
			useCurrent: false

		}).on('dp.change', function (event) {
			that.setState({
				b2BirthDate: moment(event.date).format('MM/DD/YYYY')
			});
			console.log('%cinput state changed: birthDate' + ' : ' + that.state.b2BirthDate, 'color: aqua');
		});
	},
	validateBeneficiaryInfo: function () {
		var postData = {
			b1Name: this.state.b1Name.trim(),
			b1BirthDate: this.state.b1BirthDate.trim(),
			b1Address: this.state.b1Address.trim(),
			b1Relationship: this.state.b1Relationship.trim(),
			b2Name: this.state.b2Name.trim(),
			b2BirthDate: this.state.b2BirthDate.trim(),
			b2Address: this.state.b2Address.trim(),
			b2Relationship: this.state.b2Relationship.trim()
		};

		this.setState({
			b1Name: postData.b1Name,
			b1BirthDate: postData.b1BirthDate,
			b1Address: postData.b1Address,
			b1Relationship: postData.b1Relationship,
			b2Name: postData.b2Name.trim(),
			b2BirthDate: postData.b2BirthDate,
			b2Address: postData.b2Address,
			b2Relationship: postData.b2Relationship
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validateBeneficiaryInfo',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				$("#ApplyMessageContainerModal").modal('hide');
				if (response.status === 'failed') {
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				} else if (response.status === 'success') {
					this.props.dataChange(postData, 'beneficiaryData');
					this.props.mainViewChange('INSTRUCTION');
				}
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
		this.props.modalChange('VALIDATING');
		this.validateBeneficiaryInfo();
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-10 col-md-offset-1" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"SEDPI Membership Application"
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-3" },
							React.createElement(
								"ul",
								{ className: "nav nav-pills nav-stacked" },
								React.createElement(
									"li",
									{ className: "done" },
									React.createElement(
										"a",
										null,
										"Personal Information ",
										React.createElement("i", { className: "fa fa-check-circle fa-fw" })
									)
								),
								React.createElement(
									"li",
									{ className: "done" },
									React.createElement(
										"a",
										null,
										"Contact Information ",
										React.createElement("i", { className: "fa fa-check-circle fa-fw" })
									)
								),
								React.createElement(
									"li",
									{ className: "done" },
									React.createElement(
										"a",
										null,
										"Investment Information ",
										React.createElement("i", { className: "fa fa-check-circle fa-fw" })
									)
								),
								React.createElement(
									"li",
									{ className: "active" },
									React.createElement(
										"a",
										null,
										"Beneficiary Information"
									)
								)
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-9" },
							React.createElement(
								"div",
								{ className: "panel panel-default" },
								React.createElement(
									"div",
									{ className: "panel-heading" },
									"Beneficiary Information",
									React.createElement(
										"div",
										{ className: "pull-right" },
										React.createElement(
											"p",
											{ className: "text-right" },
											React.createElement(
												"i",
												null,
												"1 of ",
												this.props.surveyData.willAttend === 'Yes' ? '2' : '4'
											)
										)
									)
								),
								React.createElement(
									"div",
									{ className: "panel-body" },
									React.createElement(
										"form",
										{ onSubmit: this.handleSubmit },
										React.createElement(
											"div",
											{ className: "row" },
											React.createElement(
												"div",
												{ className: "col-md-6" },
												React.createElement(
													"div",
													{ className: "form-group" },
													React.createElement(
														"h4",
														null,
														"Beneficiary 1"
													)
												),
												React.createElement(
													"div",
													{ className: "form-group" },
													React.createElement(
														"label",
														null,
														"Complete Name"
													),
													React.createElement("input", {
														type: "text",
														className: "form-control",
														value: this.state.b1Name,
														onChange: this.handleChange.bind(null, 'b1Name') })
												),
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-b1BirthDate" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-b1BirthDate" },
														"Birth Date"
													),
													React.createElement(
														"div",
														{ className: "input-group date", id: "datetimepicker-b1BirthDate" },
														React.createElement("input", {
															type: "text",
															id: "input-b1BirthDate",
															className: "form-control",
															size: "16",
															value: this.state.b1BirthDate,
															onChange: this.handleChange.bind(null, 'b1BirthDate'),
															placeholder: "mm/dd/yyyy" }),
														React.createElement(
															"span",
															{ className: "input-group-addon" },
															React.createElement("span", { className: "glyphicon glyphicon-calendar" })
														)
													)
												),
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-b1Address" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-b1Address" },
														"Address"
													),
													React.createElement("input", {
														type: "text",
														id: "input-b1Address",
														className: "form-control",
														value: this.state.b1Address,
														onChange: this.handleChange.bind(null, 'b1Address') })
												),
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-b1Relationship" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-b1Relationship" },
														"Relationship"
													),
													React.createElement("input", {
														type: "text",
														className: "form-control",
														id: "input-b1Relationship",
														value: this.state.b1Relationship,
														onChange: this.handleChange.bind(null, 'b1Relationship') })
												)
											),
											React.createElement(
												"div",
												{ className: "col-md-6" },
												React.createElement(
													"div",
													{ className: "form-group" },
													React.createElement(
														"h4",
														null,
														"Beneficiary 2"
													)
												),
												React.createElement(
													"div",
													{ className: "form-group" },
													React.createElement(
														"label",
														null,
														"Complete Name"
													),
													React.createElement("input", {
														type: "text",
														className: "form-control",
														value: this.state.b2Name,
														onChange: this.handleChange.bind(null, 'b2Name') })
												),
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-b2BirthDate" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-b2BirthDate" },
														"Birth Date"
													),
													React.createElement(
														"div",
														{ className: "input-group date", id: "datetimepicker-b2BirthDate" },
														React.createElement("input", {
															type: "text",
															id: "input-b2BirthDate",
															className: "form-control",
															size: "16",
															value: this.state.b2BirthDate,
															onChange: this.handleChange.bind(null, 'b2BirthDate'),
															placeholder: "mm/dd/yyyy" }),
														React.createElement(
															"span",
															{ className: "input-group-addon" },
															React.createElement("span", { className: "glyphicon glyphicon-calendar" })
														)
													)
												),
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-b2Address" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-b2Address" },
														"Address"
													),
													React.createElement("input", {
														type: "text",
														id: "input-b1Address",
														className: "form-control",
														value: this.state.b2Address,
														onChange: this.handleChange.bind(null, 'b2Address') })
												),
												React.createElement(
													"div",
													{ className: "form-group has-feedback", id: "fg-b2Relationship" },
													React.createElement(
														"label",
														{ className: "control-label", htmlFor: "input-b2Relationship" },
														"Relationship"
													),
													React.createElement("input", {
														type: "text",
														className: "form-control",
														id: "input-b2Relationship",
														value: this.state.b2Relationship,
														onChange: this.handleChange.bind(null, 'b2Relationship') })
												)
											)
										),
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
														"div",
														{ className: "pull-right" },
														React.createElement(
															"div",
															{ className: "btn-group" },
															React.createElement(
																"button",
																{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'INVESTMENT') },
																"Back"
															),
															React.createElement(
																"button",
																{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'INSTRUCTION') },
																"Skip"
															),
															React.createElement(
																"button",
																{ type: "submit", className: "btn btn-primary" },
																"Next"
															)
														)
													)
												)
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

/*----------  Apply Instruction View  ----------*/

var ApplyInstructionView = React.createClass({
	displayName: "ApplyInstructionView",

	render: function () {
		var view;
		if (this.props.applicationSent) {
			view = React.createElement(
				"div",
				{ className: "text-center" },
				"Your Application has been Saved."
			);
		} else {
			view = React.createElement(
				"div",
				{ className: "text-center" },
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"div",
						{ className: "btn-group" },
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-primary btn-lg", onClick: this.props.buttonClick.bind(null, 'SAVE-INVESTOR') },
							"Submit my Application"
						)
					)
				),
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"a",
						{ className: "clickable-row" },
						React.createElement(
							"h5",
							null,
							"Reset Application"
						)
					)
				)
			);
		}
		return React.createElement(
			"div",
			{ className: "col-md-8 col-md-offset-2" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"SEDPI Membership Application"
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-10 col-md-offset-1" },
							React.createElement(
								"h2",
								null,
								"We're almost done. Just one more step."
							),
							React.createElement(
								"p",
								{ className: "text-justify" },
								"After you submit your application, you may remit your deposit to SDFI through any means available to you such as bank transfers, money transfer operators such as Western Union, wire transfers and many others. The table below shows the information you need to be able to remit your investment."
							),
							React.createElement(
								"div",
								{ className: "col-md-10 col-md-offset-1" },
								React.createElement(
									"table",
									{ className: "table table-bordered table-striped table-condensed" },
									React.createElement(
										"tbody",
										null,
										React.createElement(
											"tr",
											null,
											React.createElement(
												"td",
												null,
												"Account Name"
											),
											React.createElement(
												"td",
												null,
												"SEDPI Foundation, Inc."
											)
										),
										React.createElement(
											"tr",
											null,
											React.createElement(
												"td",
												null,
												"Bank"
											),
											React.createElement(
												"td",
												null,
												"Banco de Oro Unibank"
											)
										),
										React.createElement(
											"tr",
											null,
											React.createElement(
												"td",
												null,
												"Account Number"
											),
											React.createElement(
												"td",
												null,
												"004690126723"
											)
										),
										React.createElement(
											"tr",
											null,
											React.createElement(
												"td",
												null,
												"Account Type"
											),
											React.createElement(
												"td",
												null,
												"Savings"
											)
										),
										React.createElement(
											"tr",
											null,
											React.createElement(
												"td",
												null,
												"SWIFT Code"
											),
											React.createElement(
												"td",
												null,
												"BNORPHMM"
											)
										),
										React.createElement(
											"tr",
											null,
											React.createElement(
												"td",
												null,
												"Address"
											),
											React.createElement(
												"td",
												null,
												"134 EDSA Corner Timog Avenue, Quezon City, Philippines"
											)
										)
									)
								)
							),
							React.createElement(
								"div",
								{ className: "col-md-12" },
								React.createElement(
									"p",
									{ className: "text-justify" },
									"Kindly email us the remittance receipt at ",
									React.createElement(
										"a",
										{ href: "mailto:info@sedpi.com", target: "_top" },
										"info@sedpi.com"
									),
									" so we can verify and validate this with our bank account. Keep the remittance receipt as proof of record for your security and protection."
								),
								React.createElement(
									"p",
									{ className: "text-justify" },
									"Once we receive your remittance, we will send you a scanned copy of your official receipt and stock certificate, which will serve as proof of your investment. Kindly inform us if you want us to send a hard copy of said documents. If delivery address is within the Philippines, SDFI will shoulder the courier costs. If delivery address is outside the Philippines, we will deduct the courier costs from your investment. You may also choose to allow us to safe keep your documents, which you may get from us when you go home to the Philippines."
								)
							),
							React.createElement(
								"div",
								{ className: "col-md-12" },
								view
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Apply Views  ======*/

/*==================================
=            Apply Main            =
==================================*/

var ApplyMain = React.createClass({
	displayName: "ApplyMain",

	getInitialState: function () {
		return {
			mainView: undefined,
			dialogView: undefined,
			applicantData: undefined,
			surveyData: undefined,
			tocData: undefined,
			personalData: undefined,
			contactData: undefined,
			investmentData: undefined,
			beneficiaryData: undefined,
			applicationSent: false
		};
	},
	saveNonMember: function () {
		this.onModalChange('SAVING');
		$.ajax({
			url: '/api/application/saveNonMember',
			type: 'POST',
			data: this.state.applicantData,
			success: function (response) {
				console.log(response);
				if (response.status === 'success') {
					//$("#ApplyMessageContainerModal").modal('hide');
					this.onModalChange('SAVED');
				}
			}.bind(this)
		});
	},
	saveTraineeMember: function () {
		this.onModalChange('SAVING');

		var postData = {};
		var surveyData = this.state.surveyData;
		var personalData = this.state.personalData;
		var contactData = this.state.contactData;

		for (var propName in surveyData) {
			postData[propName] = surveyData[propName];
		}
		for (var propName in personalData) {
			postData[propName] = personalData[propName];
		}
		for (var propName in contactData) {
			postData[propName] = contactData[propName];
		}

		console.log(postData);

		$.ajax({
			url: '/api/application/saveTraineeMember',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if (response.status === 'success') {
					this.onModalChange('SAVED');
				}
			}.bind(this)
		});
	},
	saveInvestorMember: function () {
		this.onModalChange('SAVING');

		var postData = {};
		var surveyData = this.state.surveyData;
		var personalData = this.state.personalData;
		var contactData = this.state.contactData;
		var investmentData = this.state.investmentData;
		var beneficiaryData = this.state.beneficiaryData;

		for (var propName in surveyData) {
			postData[propName] = surveyData[propName];
		}
		for (var propName in personalData) {
			postData[propName] = personalData[propName];
		}
		for (var propName in contactData) {
			postData[propName] = contactData[propName];
		}
		for (var propName in investmentData) {
			postData[propName] = investmentData[propName];
		}
		for (var propName in beneficiaryData) {
			postData[propName] = beneficiaryData[propName];
		}

		console.log(postData);

		$.ajax({
			url: '/api/application/saveInvestorMember',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.onModalChange('INVESTOR-SAVED');
				this.setState({
					applicantData: undefined,
					surveyData: undefined,
					tocData: undefined,
					personalData: undefined,
					contactData: undefined,
					investmentData: undefined,
					beneficiaryData: undefined,
					applicationSent: true
				});
			}.bind(this)
		});
	},
	onMainViewChange: function (mainViewKeyword) {
		switch (mainViewKeyword) {
			case 'APPLICANT':
				this.setState({ mainView: undefined });
				break;

			case 'SURVEY':
				this.setState({ mainView: 'SURVEY' });
				break;

			case 'TOC':
				this.setState({ mainView: 'TOC' });
				break;

			case 'PERSONAL':
				this.setState({ mainView: 'PERSONAL' });
				break;

			case 'CONTACT':
				this.setState({ mainView: 'CONTACT' });
				break;

			case 'INVESTMENT':
				this.setState({ mainView: 'INVESTMENT' });
				break;

			case 'BENEFICIARY':
				this.setState({ mainView: 'BENEFICIARY' });
				break;

			case 'INSTRUCTION':
				this.setState({ mainView: 'INSTRUCTION' });
				break;
		}
	},
	onModalChange: function (modalKeyword) {
		console.log(modalKeyword);
		console.log($("#ApplyMessageContainerModal").data('bs.modal'));
		switch (modalKeyword) {
			case 'VALIDATING':
				this.setState({ dialogView: 'VALIDATING' });
				$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = false;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = 'static';
				break;

			case 'NON-MEMBER-DIALOG':
				this.setState({ dialogView: 'NON-MEMBER-DIALOG' });
				$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = true;
				break;

			case 'SAVING':
				this.setState({ dialogView: 'SAVING' });
				$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = false;
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = 'static';
				break;

			case 'SAVED':
				this.setState({ dialogView: 'SAVED' });
				$("#ApplyMessageContainerModal").modal().on('hidden.bs.modal', function (e) {
					window.location.reload();
				});
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = true;
				break;

			case 'TRAINEE-DIALOG':
				this.setState({ dialogView: 'TRAINEE-DIALOG' });
				//$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = true;
				break;

			case 'INVESTOR-SAVED':
				this.setState({ dialogView: 'SAVED' });
				$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = true;
				break;

		}
	},
	onDataChange: function (postData, type) {
		switch (type) {
			case 'applicantData':
				this.setState({ applicantData: postData });
				break;

			case 'surveyData':
				this.setState({ surveyData: postData });
				break;

			case 'tocData':
				this.setState({ tocData: postData });
				break;

			case 'personalData':
				this.setState({ personalData: postData });
				break;

			case 'contactData':
				this.setState({ contactData: postData });
				break;

			case 'investmentData':
				this.setState({ investmentData: postData });
				break;

			case 'beneficiaryData':
				this.setState({ beneficiaryData: postData });
				break;
		}
	},
	onHandleClick: function (buttonKeyword) {
		console.log(buttonKeyword);
		switch (buttonKeyword) {
			case 'SAVE-NON-MEMBER':
				//this.onModalChange('NON-MEMBER-SAVING');
				this.saveNonMember();
				break;

			case 'SAVE-TRAINEE':
				this.saveTraineeMember();
				break;

			case 'SAVE-INVESTOR':
				this.saveInvestorMember();
				break;
		}
	},
	render: function () {
		var view;
		switch (this.state.mainView) {
			case 'SURVEY':
				view = React.createElement(ApplySurveyView, {
					surveyData: this.state.surveyData,
					modalChange: this.onModalChange,
					dataChange: this.onDataChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'TOC':
				view = React.createElement(ApplyTOCView, {
					tocData: this.state.tocData,
					dataChange: this.onDataChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'PERSONAL':
				view = React.createElement(ApplyPersonalView, {
					surveyData: this.state.surveyData,
					personalData: this.state.personalData,
					applicantData: this.state.applicantData,
					modalChange: this.onModalChange,
					dataChange: this.onDataChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'CONTACT':
				view = React.createElement(ApplyContactView, {
					surveyData: this.state.surveyData,
					contactData: this.state.contactData,
					applicantData: this.state.applicantData,
					modalChange: this.onModalChange,
					dataChange: this.onDataChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'INVESTMENT':
				view = React.createElement(ApplyInvestmentView, {
					surveyData: this.state.surveyData,
					investmentData: this.state.investmentData,
					modalChange: this.onModalChange,
					dataChange: this.onDataChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'BENEFICIARY':
				view = React.createElement(ApplyBeneficiaryView, {
					surveyData: this.state.surveyData,
					beneficiaryData: this.state.beneficiaryData,
					modalChange: this.onModalChange,
					dataChange: this.onDataChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'INSTRUCTION':
				view = React.createElement(ApplyInstructionView, {
					applicationSent: this.state.applicationSent,
					modalChange: this.onModalChange,
					buttonClick: this.onHandleClick,
					mainViewChange: this.onMainViewChange });
				break;

			default:
				view = React.createElement(ApplyLandingView, {
					applicantData: this.state.applicantData,
					modalChange: this.onModalChange,
					dataChange: this.onDataChange,
					mainViewChange: this.onMainViewChange });
				break;
		}
		return React.createElement(
			"div",
			{ className: "row" },
			view,
			React.createElement(ApplyMessageContainerModal, {
				dialogView: this.state.dialogView,
				buttonClick: this.onHandleClick })
		);
	}
});

/*=====  End of Apply Main  ======*/

if (typeof $("#apply-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(ApplyMain, null), document.getElementById('apply-app-node'));
}