/*==========================================
=            Member Detail View            =
==========================================*/

var MemberDetailView = React.createClass({
	displayName: "MemberDetailView",

	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-12" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
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
								{ className: "form-group" },
								React.createElement(
									"ul",
									{ className: "nav nav-tabs" },
									React.createElement(
										"li",
										{ role: "presentation", className: "active" },
										React.createElement(
											"a",
											null,
											"Statement of Account"
										)
									),
									React.createElement(
										"li",
										{ role: "presentation" },
										React.createElement(
											"a",
											null,
											"Profile"
										)
									),
									React.createElement(
										"li",
										{ role: "presentation" },
										React.createElement(
											"a",
											null,
											"Transaction Logs"
										)
									)
								)
							),
							React.createElement(
								"div",
								{ className: "form-group" },
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
											React.createElement("tbody", null)
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

/*=====  End of Member Detail View  ======*/

/*=========================================
=            Member Table View            =
=========================================*/

var MemberTableView = React.createClass({
	displayName: "MemberTableView",

	render: function () {
		return React.createElement(
			"div",
			{ className: "col-md-10 col-md-offset-1" },
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					"Member List"
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
											"Member Name"
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
								React.createElement("tbody", null)
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Member Table View  ======*/

/*===================================
=            Member Main            =
===================================*/

var MemberMain = React.createClass({
	displayName: "MemberMain",

	render: function () {
		return React.createElement(
			"div",
			{ className: "row" },
			React.createElement(MemberDetailView, null)
		);
	}
});

/*=====  End of Member Main  ======*/

if (typeof $("#members-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(MemberMain, null), document.getElementById('members-app-node'));
}