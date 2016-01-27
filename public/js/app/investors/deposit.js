/*=====================================
=            Deposit Views            =
=====================================*/

var DepositMainView = React.createClass({
	displayName: "DepositMainView",

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

	getInitialState: function () {
		return {
			amount: '0.00',
			dateDeposit: moment().format('MM/DD/YYYY')
		};
	},
	componentDidMount: function () {
		var self = this;
		$("#datetimepicker-dateDeposit").datepicker({
			autoclose: true
		}).on('changeDate', function (e) {
			self.setState({ dateDeposit: e.date });
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange('ADVICE-SAVING');
		$("#DepositMessageContainerModal").modal();
		$("#DepositMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#DepositMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			amount: accounting.unformat(this.state.amount),
			dateDeposit: this.state.dateDeposit
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investors/saveAdviceDeposit',
			type: 'POST',
			dataType: 'json',
			data: postData,
			success: function (response) {
				this.props.modalViewChange('ADVICE-SUCCESS');
				this.props.mainViewChange('DEPOSIT-INSTRUCTION');
				$("#DepositMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#DepositMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (response) {
				if (response.status === 422) {
					$("#DepositMessageContainerModal").modal('hide');
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				} else {
					this.props.modalViewChange('ADVICE-ERROR');
					$("#DepositMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#DepositMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}
		});
	},
	amountBlurred: function () {
		this.setState({ amount: accounting.formatNumber(this.state.amount, 2) });
	},
	amountFocused: function () {
		this.setState({ amount: accounting.unformat(this.state.amount) });
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
										{ className: "form-group", id: "fg-amount" },
										React.createElement(
											"label",
											{ className: "control-label", htmlFor: "input-amount" },
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
												id: "input-amount",
												className: "form-control text-right",
												value: this.state.amount,
												onFocus: this.amountFocused,
												onBlur: this.amountBlurred,
												onChange: this.handleChange.bind(null, 'amount') })
										)
									),
									React.createElement(
										"div",
										{ className: "form-group has-feedback", id: "fg-dateDeposit" },
										React.createElement(
											"label",
											{ className: "control-label", htmlFor: "input-dateDeposit" },
											"Date Deposit"
										),
										React.createElement(
											"div",
											{ className: "input-group date", id: "datetimepicker-dateDeposit" },
											React.createElement("input", {
												type: "text",
												id: "input-dateDeposit",
												className: "form-control",
												size: "16",
												value: this.state.dateDeposit,
												onChange: this.handleChange.bind(null, 'dateDeposit') }),
											React.createElement(
												"span",
												{ className: "input-group-addon" },
												React.createElement("span", { className: "glyphicon glyphicon-calendar" })
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
													{ type: "button", className: "btn btn-default", onClick: this.props.mainViewChange.bind(null, 'MAIN') },
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

/*----------  Deposit Post Advice View ----------*/

var DepositInstructionView = React.createClass({
	displayName: "DepositInstructionView",

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
											{ className: "btn btn-primary", onClick: this.props.mainViewChange.bind(null, 'MAIN') },
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

/*----------  Deposit Advice Table View   ----------*/

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
							"h2",
							null,
							"Your Deposit Advice Details"
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
											"Date"
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
											"Status"
										)
									)
								),
								React.createElement(
									"tbody",
									null,
									React.createElement(
										"tr",
										{ className: "text-center clickable-row" },
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
					),
					React.createElement(
						"div",
						{ className: "page-header" },
						React.createElement(
							"h2",
							null,
							"Your Actual Deposit Details"
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
											"Date"
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
											"Status"
										)
									)
								),
								React.createElement(
									"tbody",
									null,
									React.createElement(
										"tr",
										{ className: "text-center clickable-row" },
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

/*=====  End of Deposit Views  ======*/

/*==============================================
=            Deposit Message Modals            =
==============================================*/

var DepositMessageContainerModal = React.createClass({
	displayName: "DepositMessageContainerModal",

	render: function () {
		var modalMessageComponent;
		var modalView = this.props.modalView;
		switch (modalView) {
			case 'ADVICE-SAVING':
				modalMessageComponent = React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Saving Your Deposit Advice"
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

			case 'ADVICE-SUCCESS':
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
								" Your deposit has been saved.",
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

			case 'ADVIVE-ERROR':
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
								React.createElement("i", { className: "fa fa-times-circle fa-fw" }),
								" Your adviced deposit not saved. Please try again.",
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
			{ className: "modal fade", id: "DepositMessageContainerModal", role: "dialog" },
			React.createElement(
				"div",
				{ className: "modal-dialog", role: "document" },
				modalMessageComponent
			)
		);
	}
});

/*=====  End of Deposit Message Modals  ======*/

/*====================================
=            Deposit Main            =
====================================*/

var DepositMain = React.createClass({
	displayName: "DepositMain",

	getInitialState: function () {
		return {
			mainView: undefined,
			modalView: undefined
		};
	},
	onMainViewChange: function (mainViewKeyword) {
		this.setState({ mainView: mainViewKeyword });
	},
	onModalViewChange: function (modalViewKeyword) {
		this.setState({ modalView: modalViewKeyword });
	},
	render: function () {
		var view;
		switch (this.state.mainView) {
			case 'ADVICE':
				view = React.createElement(DepositAdviceView, {
					modalViewChange: this.onModalViewChange,
					mainViewChange: this.onMainViewChange });
				break;

			case 'ADVICE-TABLE':
				view = React.createElement(DepositAdviceTableView, {
					mainViewChange: this.onMainViewChange });
				break;

			case 'DEPOSIT-INSTRUCTION':
				view = React.createElement(DepositInstructionView, {
					mainViewChange: this.onMainViewChange });
				break;

			default:
				view = React.createElement(DepositMainView, { mainViewChange: this.onMainViewChange });
				break;
		}
		return React.createElement(
			"div",
			{ className: "row" },
			view,
			React.createElement(DepositMessageContainerModal, { modalView: this.state.modalView })
		);
	}
});

/*=====  End of Deposit Main  ======*/

if (typeof $("#deposit-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(DepositMain, null), document.getElementById('deposit-app-node'));
}