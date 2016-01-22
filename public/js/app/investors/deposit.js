/*====================================
=            Deposit View            =
====================================*/
var DepositLandingView = React.createClass({
	displayName: "DepositLandingView",

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
							"Make a Deposit"
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
								{ className: "form-group" },
								React.createElement(
									"button",
									{ className: "btn btn-default btn-lg btn-block", onClick: this.props.mainViewChange.bind(null, 'ADVICE') },
									"Advice for New Deposit"
								),
								React.createElement(
									"button",
									{ className: "btn btn-default btn-lg btn-block", onClick: this.props.mainViewChange.bind(null, 'ADVICE-TABLE') },
									"Report Actual Deposit"
								),
								React.createElement(
									"button",
									{ className: "btn btn-default btn-lg btn-block" },
									"Ask a Question"
								)
							)
						)
					)
				)
			)
		);
	}
});

/*----------  Deposit Advice View  ----------*/

var DepositAdviceView = React.createClass({
	displayName: "DepositAdviceView",

	handleSubmit: function (e) {
		e.preventDefault();
		console.log('hello');
		this.props.mainViewChange('FINISH');
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
					{ className: "panel-body" },
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h1",
							null,
							"Advice a New Deposit"
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
									"form",
									{ onSubmit: this.handleSubmit },
									React.createElement(
										"div",
										{ className: "form-group" },
										React.createElement(
											"label",
											null,
											"Amount Deposit"
										),
										React.createElement("input", {
											type: "text",
											className: "form-control" })
									),
									React.createElement(
										"div",
										{ className: "form-group" },
										React.createElement(
											"label",
											null,
											"Expected Date of Deposit"
										),
										React.createElement("input", {
											type: "text",
											className: "form-control" })
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
													{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'LANDING') },
													"Cancel"
												),
												React.createElement(
													"button",
													{ type: "submit", className: "btn btn-primary" },
													"Submit"
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

/*----------  Deposit Finish View ----------*/

var DepositFinishView = React.createClass({
	displayName: "DepositFinishView",

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
							"Advice a New Deposit"
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
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit."
							),
							React.createElement(
								"p",
								{ className: "text-justify" },
								"Curabitur ac urna augue. Proin eu lectus odio. Vestibulum ut dapibus dui, ac volutpat elit. Nulla id dui aliquam, aliquet nisl vel, varius justo. Nulla volutpat nisi vitae urna viverra aliquam. Curabitur in tellus scelerisque, ultricies ex sed, malesuada arcu. Nunc aliquam pretium malesuada."
							),
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
											{ className: "btn btn-primary", onClick: this.props.mainViewChange.bind(null, 'LANDING') },
											"Back to Deposit Menu"
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

/*----------  Deposit Advice Table View  ----------*/

var DepositAdviceTableView = React.createClass({
	displayName: "DepositAdviceTableView",

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
							"Report Actual Deposit"
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
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
										{ className: "text-center" },
										React.createElement(
											"td",
											null,
											"#"
										),
										React.createElement(
											"td",
											null,
											"Amount"
										),
										React.createElement(
											"td",
											null,
											"Date Expected"
										),
										React.createElement(
											"td",
											null,
											"Date Submitted"
										)
									)
								),
								React.createElement(
									"tbody",
									null,
									React.createElement(
										"tr",
										{ className: "text-center clickable-row", onClick: this.props.mainViewChange.bind(null, 'REPORT') },
										React.createElement(
											"td",
											null,
											"1"
										),
										React.createElement(
											"td",
											null,
											"Php 5,000.00"
										),
										React.createElement(
											"td",
											null,
											"Jan 12, 2016"
										),
										React.createElement(
											"td",
											null,
											"Jan 12, 2016 01:02:23 PM"
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

/*----------  Deposit Report View  ----------*/

var DepositReportView = React.createClass({
	displayName: "DepositReportView",

	handleSubmit: function (e) {
		e.preventDefault();
		this.props.mainViewChange('REPORT-FINISH');
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
							"Report Actual Deposit"
						)
					),
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
									"label",
									null,
									"Deposit Details"
								),
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
												{ className: "table-title-col" },
												"Date Expected to Deposit"
											),
											React.createElement(
												"td",
												null,
												"Jan 16, 2016"
											)
										),
										React.createElement(
											"tr",
											null,
											React.createElement(
												"td",
												{ className: "table-title-col" },
												"Amount Deposit"
											),
											React.createElement(
												"td",
												null,
												"Php 5,000.00"
											)
										)
									)
								)
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement(
								"form",
								{ onSubmit: this.handleSubmit },
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"label",
										null,
										"Bank/RemittanceChannel"
									),
									React.createElement("input", {
										type: "text",
										className: "form-control" })
								),
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(
										"label",
										null,
										"Upload Image"
									),
									React.createElement(
										"div",
										{ className: "panel panel-default" },
										React.createElement(
											"div",
											{ className: "panel-body" },
											React.createElement("img", { src: "/images/img_placeholder.png", width: "100%" })
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
												{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'LANDING') },
												"Cancel"
											),
											React.createElement(
												"button",
												{ type: "submit", className: "btn btn-primary" },
												"Submit"
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

/*----------  Deposit Report Finish View  ----------*/

var DepositReportFinishView = React.createClass({
	displayName: "DepositReportFinishView",

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
							"Report Actual Deposit"
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
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit."
							),
							React.createElement(
								"p",
								{ className: "text-justify" },
								"Thank you for your deposit. SEDPI will validate your information you've sent."
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
											{ className: "btn btn-primary", onClick: this.props.mainViewChange.bind(null, 'LANDING') },
											"Back to Deposit Menu"
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

/*=====  End of Deposit View  ======*/

/*====================================
=            Deposit Main            =
====================================*/

var DepositMain = React.createClass({
	displayName: "DepositMain",

	getInitialState: function () {
		return {
			mainView: undefined
		};
	},
	onMainViewChange: function (mainViewKeyword) {
		switch (mainViewKeyword) {
			case 'LANDING':
				this.setState({ mainView: undefined });
				break;

			case 'ADVICE':
				this.setState({ mainView: 'ADVICE' });
				break;

			case 'FINISH':
				this.setState({ mainView: 'FINISH' });
				break;

			case 'ADVICE-TABLE':
				this.setState({ mainView: 'ADVICE-TABLE' });
				break;

			case 'REPORT':
				this.setState({ mainView: 'REPORT' });
				break;

			case 'REPORT-FINISH':
				this.setState({ mainView: 'REPORT-FINISH' });
				break;
		}
	},
	render: function () {
		var view;
		switch (this.state.mainView) {
			case 'ADVICE':
				view = React.createElement(DepositAdviceView, {
					mainViewChange: this.onMainViewChange });
				break;

			case 'FINISH':
				view = React.createElement(DepositFinishView, {
					mainViewChange: this.onMainViewChange });
				break;

			case 'ADVICE-TABLE':
				view = React.createElement(DepositAdviceTableView, {
					mainViewChange: this.onMainViewChange });
				break;

			case 'REPORT':
				view = React.createElement(DepositReportView, {
					mainViewChange: this.onMainViewChange });
				break;

			case 'REPORT-FINISH':
				view = React.createElement(DepositReportFinishView, {
					mainViewChange: this.onMainViewChange });
				break;

			default:
				view = React.createElement(DepositLandingView, {
					mainViewChange: this.onMainViewChange });
				break;
		}
		return React.createElement(
			"div",
			{ className: "row" },
			view
		);
	}
});

/*=====  End of Deposit Main  ======*/

if (typeof $("#deposit-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(DepositMain, null), document.getElementById('deposit-app-node'));
}