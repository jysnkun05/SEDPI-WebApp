/*========================================
=            My Deposit Views            =
========================================*/

/*----------  Deposit Selection View  ----------*/

var DepositSelectionView = React.createClass({
	displayName: "DepositSelectionView",

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
										{ className: "btn btn-default btn-lg btn-block" },
										"Advice for New Deposit"
									),
									React.createElement(
										"button",
										{ className: "btn btn-default btn-lg btn-block" },
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
			)
		);
	}
});

/*=====  End of My Deposit Views  ======*/

/*========================================
=            Modal Components            =
========================================*/

/*----------  Form Modal  ----------*/

var DepositFormContainerModal = React.createClass({
	displayName: "DepositFormContainerModal",

	render: function () {

		var modalFormComponent;
		switch (this.props.modalForm) {
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

/*----------  Advice Deposit Components  ----------*/

var AdviceDepositComponents = React.createClass({
	displayName: "AdviceDepositComponents",

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
						{ className: "panel-heading" },
						"Advice New Deposit"
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"form",
							null,
							React.createElement("div", { className: "form-group" })
						)
					)
				)
			)
		);
	}
});

/*=====  End of Form Modal Components  ======*/

/*=======================================
=            My Deposit Main            =
=======================================*/

var MyDepositMain = React.createClass({
	displayName: "MyDepositMain",

	render: function () {
		return React.createElement(
			"div",
			{ createClass: "row" },
			React.createElement(
				"div",
				{ className: "col-md-10 col-md-offset-1" },
				React.createElement(DepositSelectionView, null)
			)
		);
	}
});

/*=====  End of My Deposit Main  ======*/

if (typeof $("#deposit-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(MyDepositMain, null), document.getElementById('deposit-app-node'));
}