/*========================================
=            Investments Main            =
========================================*/

var InvestmentsMain = React.createClass({
	displayName: 'InvestmentsMain',

	getInitialState: function () {
		return {
			investmentData: undefined,
			retries: 0
		};
	},
	componentWillMount: function () {
		this.getInvestorInvestments(this.state.retries);
	},
	getInvestorInvestments: function (retries) {
		this.setState({ retries: retries + 1 });
		$.ajax({
			url: '/api/investors/getInvestorInvestments',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (investmentData) {
				this.setState({
					investmentData: investmentData,
					retries: 0
				});
			}.bind(this),
			error: function () {
				if (retries <= 3) this.getInvestorInvestments(id, retries);
			}.bind(this)
		});
	},
	render: function () {
		var view = React.createElement(
			'div',
			{ className: 'panel panel-default' },
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
							'div',
							{ className: 'text-center' },
							React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
							' Loading Data...'
						)
					)
				)
			)
		);

		if (this.state.investmentData !== undefined) {
			var SOA = React.createElement(
				'tr',
				{ className: 'text-center' },
				React.createElement(
					'td',
					{ colSpan: '5' },
					'No Transactions Created.'
				)
			);

			if (this.state.investmentData.length > 0) {
				SOA = this.state.investmentData.map(function (account, index) {
					account.transaction_date = moment(account.transaction_date).format('DD MMM YYYY');
					account.amount = accounting.formatNumber(account.amount, 2);
					account.runningBalance = accounting.formatNumber(account.runningBalance, 2);
					return React.createElement(
						'tr',
						{ key: index },
						React.createElement(
							'td',
							{ className: 'text-center' },
							account.transaction_date
						),
						React.createElement(
							'td',
							{ className: 'text-right' },
							account.transaction_type === 'DP' ? account.amount : null
						),
						React.createElement(
							'td',
							{ className: 'text-right' },
							account.transaction_type === 'WD' ? account.amount : null
						),
						React.createElement(
							'td',
							{ className: 'text-right' },
							account.transaction_type === 'DV' ? account.amount : null
						),
						React.createElement(
							'td',
							{ className: 'text-right' },
							account.runningBalance
						)
					);
				}.bind(this));
			}
			view = React.createElement(
				'table',
				{ className: 'table table-bordered table-striped table-condensed' },
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Date'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Deposit'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Withdraw'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Dividend'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Balance'
						)
					)
				),
				React.createElement(
					'tbody',
					null,
					SOA
				)
			);
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-2 col-md-offset-1' },
				React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement('img', { src: '/images/profile_placeholder.jpg', width: '100%' })
						)
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'col-md-8' },
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
								'My Investments'
							)
						),
						React.createElement(
							'div',
							{ className: 'row' },
							React.createElement(
								'div',
								{ className: 'col-md-12' },
								view
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Investments Main  ======*/

if (typeof $("#investments-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(InvestmentsMain, null), document.getElementById('investments-app-node'));
}