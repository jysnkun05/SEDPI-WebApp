/*========================================
=            Transaction View            =
========================================*/

var TransacationTableView = React.createClass({
	displayName: 'TransacationTableView',

	getInitialState: function () {
		return {
			viewAction: 'deposit'
		};
	},
	render: function () {
		var view;
		switch (this.state.viewAction) {
			case 'deposit':
				view = React.createElement(
					'table',
					{ className: 'table table-condensed table-bordered table-striped' },
					React.createElement(
						'thead',
						null,
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Date'
							),
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Investor Name'
							),
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Amount Deposit'
							),
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Bank/Remittance Channel'
							),
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Status'
							)
						)
					),
					React.createElement(
						'tbody',
						null,
						React.createElement(
							'tr',
							{ className: 'text-center' },
							React.createElement(
								'td',
								null,
								'03 Jan 2016'
							),
							React.createElement(
								'td',
								null,
								'Jayson Busano De los Reyes'
							),
							React.createElement(
								'td',
								null,
								'Php 5,000.00'
							),
							React.createElement('td', null),
							React.createElement(
								'td',
								null,
								'Adviced'
							)
						),
						React.createElement(
							'tr',
							{ className: 'text-center' },
							React.createElement(
								'td',
								null,
								'03 Jan 2016'
							),
							React.createElement(
								'td',
								null,
								'Jayson Busano De los Reyes'
							),
							React.createElement(
								'td',
								null,
								'Php 5,000.00'
							),
							React.createElement(
								'td',
								null,
								'BDO'
							),
							React.createElement(
								'td',
								null,
								'Reported'
							)
						)
					)
				);
				break;

			case 'withdrawal':
				view = React.createElement(
					'table',
					{ className: 'table table-condensed table-bordered table-striped' },
					React.createElement(
						'thead',
						null,
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Date'
							),
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Investor Name'
							),
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Amount Deposit'
							),
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Bank/Remittance Channel'
							),
							React.createElement(
								'td',
								{ className: 'text-center' },
								'Status'
							)
						)
					),
					React.createElement(
						'tbody',
						null,
						React.createElement(
							'tr',
							{ className: 'text-center' },
							React.createElement(
								'td',
								null,
								'03 Jan 2016'
							),
							React.createElement(
								'td',
								null,
								'Jayson Busano De los Reyes'
							),
							React.createElement(
								'td',
								null,
								'Php 5,000.00'
							),
							React.createElement('td', null),
							React.createElement(
								'td',
								null,
								'Adviced'
							)
						),
						React.createElement(
							'tr',
							{ className: 'text-center' },
							React.createElement(
								'td',
								null,
								'03 Jan 2016'
							),
							React.createElement(
								'td',
								null,
								'Jayson Busano De los Reyes'
							),
							React.createElement(
								'td',
								null,
								'Php 5,000.00'
							),
							React.createElement(
								'td',
								null,
								'BDO'
							),
							React.createElement(
								'td',
								null,
								'Reported'
							)
						)
					)
				);

				break;

		}
		return React.createElement(
			'div',
			{ className: 'col-md-10 col-md-offset-1' },
			React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'div',
						{ className: 'form-group' },
						React.createElement(
							'ul',
							{ className: 'nav nav-tabs' },
							React.createElement(
								'li',
								{ role: 'presentation', className: this.state.viewAction === "deposit" ? "active" : "" },
								React.createElement(
									'a',
									null,
									'Deposit'
								)
							),
							React.createElement(
								'li',
								{ role: 'presentation', className: this.state.viewAction === "withdrawal" ? "active" : "" },
								React.createElement(
									'a',
									null,
									'Withdrawal'
								)
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'form-group' },
						view
					)
				)
			)
		);
	}
});

/*----------  Transaction Detail View  ----------*/

var TransactionDepositDetailView = React.createClass({
	displayName: 'TransactionDepositDetailView',

	render: function () {
		return React.createElement(
			'div',
			{ className: 'col-md-6 col-md-offset-3' },
			React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'div',
						{ className: 'page-header' },
						React.createElement(
							'h2',
							null,
							'Transaction Details - Deposit'
						)
					),
					React.createElement(
						'div',
						{ className: 'row' },
						React.createElement(
							'div',
							{ className: 'col-md-12' },
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'table',
									{ className: 'table table-striped table-bordered table-condensed' },
									React.createElement(
										'tbody',
										null,
										React.createElement(
											'tr',
											null,
											React.createElement(
												'td',
												{ className: 'table-title-col' },
												'Investor Name'
											),
											React.createElement(
												'td',
												null,
												'Jayson Busano De los Reyes'
											)
										),
										React.createElement(
											'tr',
											null,
											React.createElement(
												'td',
												{ className: 'table-title-col' },
												'Amount Deposited'
											),
											React.createElement(
												'td',
												null,
												'Php 5,000.00'
											)
										),
										React.createElement(
											'tr',
											null,
											React.createElement(
												'td',
												{ className: 'table-title-col' },
												'Date Adviced'
											),
											React.createElement(
												'td',
												null,
												'03 Jan 2016'
											)
										),
										React.createElement(
											'tr',
											null,
											React.createElement(
												'td',
												{ className: 'table-title-col' },
												'Date Reported'
											),
											React.createElement(
												'td',
												null,
												'04 Jan 2016'
											)
										),
										React.createElement(
											'tr',
											null,
											React.createElement(
												'td',
												{ className: 'table-title-col' },
												'Bank/Remittance Channel'
											),
											React.createElement(
												'td',
												null,
												'BDO Unibank, Inc.'
											)
										)
									)
								)
							),
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'label',
									null,
									'Uploaded Image'
								),
								React.createElement(
									'div',
									{ className: 'media' },
									React.createElement('img', { className: 'img-responsive', width: '100%', src: '/images/deposit_slip_sample.jpg' })
								)
							),
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'div',
									{ className: 'pull-right' },
									React.createElement(
										'div',
										{ className: 'btn-group' },
										React.createElement(
											'button',
											{ className: 'button', className: 'btn btn-default' },
											'Back'
										),
										React.createElement(
											'button',
											{ className: 'button', className: 'btn btn-primary' },
											'Verify'
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

/*=====  End of Transaction View  ======*/

/*=================================================
=            Transaction Modal Message            =
=================================================*/

var TransactionModalMessage = React.createClass({
	displayName: 'TransactionModalMessage',

	componentDidMount: function () {
		//$("#TransactionModalMessage").modal();
	},
	render: function () {
		return React.createElement(
			'div',
			{ className: 'modal fade', tabIndex: '-1', role: 'dialog', id: 'TransactionModalMessage' },
			React.createElement(
				'div',
				{ className: 'modal-dialog' },
				React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						'Verify Deposit',
						React.createElement(
							'button',
							{ type: 'button', className: 'close', 'data-dismiss': 'modal' },
							'×'
						)
					),
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'div',
							{ className: 'row' },
							React.createElement(
								'div',
								{ className: 'col-md-12' },
								React.createElement(
									'form',
									null,
									React.createElement(
										'div',
										{ className: 'form-group' },
										React.createElement(
											'label',
											null,
											'Status'
										),
										React.createElement(
											'select',
											{ className: 'form-control', defaultValue: '' },
											React.createElement(
												'option',
												{ disabled: true, value: '' },
												'Please Choose...'
											),
											React.createElement(
												'option',
												{ value: 'Accept' },
												'Accept & Post'
											),
											React.createElement(
												'option',
												{ value: 'Reject' },
												'Reject'
											)
										)
									),
									React.createElement(
										'div',
										{ className: 'form-group' },
										React.createElement(
											'label',
											null,
											'Message/Reason'
										),
										React.createElement('textarea', {
											type: 'text',
											className: 'form-control',
											rows: '3' })
									),
									React.createElement(
										'div',
										{ className: 'form-group' },
										React.createElement(
											'div',
											{ className: 'pull-right' },
											React.createElement(
												'div',
												{ className: 'btn-group' },
												React.createElement(
													'button',
													{ type: 'button', className: 'btn btn-default' },
													'Cancel'
												),
												React.createElement(
													'button',
													{ type: 'submit', className: 'btn btn-primary' },
													'Confirm'
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

/*=====  End of Transaction Modal Message  ======*/

/*========================================
=            Transaction Main            =
========================================*/

var TransactionMain = React.createClass({
	displayName: 'TransactionMain',

	render: function () {
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(TransacationTableView, null),
			React.createElement(TransactionModalMessage, null)
		);
	}
});

/*=====  End of Transaction Main  ======*/

if (typeof $("#transaction-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(TransactionMain, null), document.getElementById('transaction-app-node'));
}