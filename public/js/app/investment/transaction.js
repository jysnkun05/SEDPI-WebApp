
/*=========================================
=            Transaction Views            =
=========================================*/

var TransactionOpenRequestsView = React.createClass({
	displayName: "TransactionOpenRequestsView",

	render: function () {
		return React.createElement(
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
								"td",
								{ className: "text-center" },
								"Date"
							),
							React.createElement(
								"td",
								{ className: "text-center" },
								"Investor Name"
							),
							React.createElement(
								"td",
								{ className: "text-center" },
								"Transaction Type"
							),
							React.createElement(
								"td",
								{ className: "text-center" },
								"Amount"
							),
							React.createElement(
								"td",
								{ className: "text-center" },
								"Status"
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Transaction Views  ======*/

/*========================================
=            Transaction Main            =
========================================*/

var TransactionMain = React.createClass({
	displayName: "TransactionMain",

	render: function () {
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
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "page-header" },
							React.createElement(
								"h2",
								null,
								"Transactions"
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
										"ul",
										{ className: "nav nav-tabs" },
										React.createElement(
											"li",
											{ role: "presentation", className: "active" },
											React.createElement(
												"a",
												null,
												"Open Request"
											)
										),
										React.createElement(
											"li",
											{ role: "presentation" },
											React.createElement(
												"a",
												null,
												"Approved Requests"
											)
										),
										React.createElement(
											"li",
											{ role: "presentation" },
											React.createElement(
												"a",
												null,
												"Failed Requests"
											)
										)
									)
								),
								React.createElement(
									"div",
									{ className: "form-group" },
									React.createElement(TransactionOpenRequestsView, null)
								)
							)
						)
					)
				)
			)
		);
	}
});
/*=====  End of Transaction Main  ======*/

if (typeof $("#transaction-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(TransactionMain, null), document.getElementById('transaction-app-node'));
}