/*===========================================
=            My Investment Views            =
===========================================*/

/*----------  My Statement of Accounts  ----------*/

var MyStatementOfAccountsView = React.createClass({
	displayName: "MyStatementOfAccountsView",

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
		} else if (this.props.account === 'error') {
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
			var investments = this.props.account.transactions;
			var investmentList = React.createElement(
				"tr",
				null,
				React.createElement(
					"td",
					{ className: "text-center", colSpan: "5" },
					React.createElement("i", { className: "fa fa-info-circle fa-fw" }),
					" No Entries Available."
				)
			);

			if (investments.length > 0) {
				investmentList = investments.map(function (investment, index) {
					var amount = accounting.formatNumber(investment.amount);
					var runningBalance = accounting.formatNumber(investment.runningBalance, 2);
					if (investments.length - 1 === index) runningBalance = React.createElement(
						"strong",
						null,
						accounting.formatNumber(investment.runningBalance, 2)
					);
					investment.date = moment(investment.transactionDate).format('DD MMM YYYY');
					return React.createElement(
						"tr",
						{ key: index },
						React.createElement(
							"td",
							{ className: "text-center" },
							investment.date
						),
						React.createElement(
							"td",
							{ className: "text-center" },
							investment.transaction_type.description
						),
						React.createElement(
							"td",
							{ className: "text-right red-bg" },
							investment.transaction_type.account_type === "DR" ? amount : null
						),
						React.createElement(
							"td",
							{ className: "text-right" },
							investment.transaction_type.account_type === "CR" ? amount : null
						),
						React.createElement(
							"td",
							{ className: "text-right" },
							runningBalance
						)
					);
				});
			}

			detailView = React.createElement(
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
							"Transaction"
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
					investmentList
				)
			);
		}
		return React.createElement(
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
						{ className: "panel-body" },
						React.createElement(
							"div",
							{ className: "page-header" },
							React.createElement(
								"h2",
								null,
								"My Statement of Account"
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
				)
			)
		);
	}
});

/*=====  End of My Investment Views  ======*/

/*==========================================
=            My Investment Main            =
==========================================*/

var MyInvestmentMain = React.createClass({
	displayName: "MyInvestmentMain",

	getInitialState: function () {
		return {
			mainView: undefined,
			account: undefined
		};
	},
	componentDidMount: function () {
		this._getAccountDetails(0);
	},
	_getAccountDetails: function (counter) {
		$.ajax({
			url: '/api/investor/getAccountDetails',
			type: 'POST',
			success: function (account) {
				this.setState({ account: account });
			}.bind(this),
			error: function (xhr, status, error) {
				if (counter < 3) {
					this.setState({ account: 'retrying' });
					this._getAccountDetails(counter + 1);
				} else {
					this.setState({ account: status });
				}
			}.bind(this)
		});
	},
	_onRetryGetAccountDetails: function () {
		this.setState({ account: undefined });
		this._getAccountDetails(0);
	},
	render: function () {
		var mainView = React.createElement(MyStatementOfAccountsView, {
			account: this.state.account,
			retryGetAccountDetails: this._onRetryGetAccountDetails });
		return React.createElement(
			"div",
			{ className: "row" },
			React.createElement(
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
												className: "list-group-item btn-xs active" },
											React.createElement("i", { className: "fa fa-chevron-right fa-fw" }),
											" My Statement of Account"
										),
										React.createElement(
											"button",
											{
												type: "button",
												disabled: "true",
												className: "list-group-item btn-xs" },
											React.createElement("i", { className: "fa fa-chevron-right fa-fw" }),
											" My Profile ",
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
						mainView
					)
				)
			)
		);
	}
});

/*=====  End of My Investment Main  ======*/

if (typeof $("#investments-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(MyInvestmentMain, null), document.getElementById('investments-app-node'));
}