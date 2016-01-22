/*========================================
=            Investments Main            =
========================================*/

var InvestmentsMain = React.createClass({
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
		this.setState({retries: retries + 1});
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
				if(retries <= 3)
					this.getInvestorInvestments(id ,retries);
			}.bind(this)	
		});
	},
	render: function () {
		var view =  <div className="panel panel-default">
						<div className="panel-body">
							<div className="row">
								<div className="col-md-12">
									<div className="text-center">
										<i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Loading Data...
									</div>
								</div>
							</div>
						</div>
					</div>; 
		
		if(this.state.investmentData !== undefined)
		{
			var SOA = 	<tr className="text-center">
						<td colSpan="5">No Transactions Created.</td>
					</tr>;

			if(this.state.investmentData.length > 0) 
			{
				SOA = this.state.investmentData.map(function (account, index) {
					account.transaction_date = moment(account.transaction_date).format('DD MMM YYYY');
					account.amount = accounting.formatNumber(account.amount, 2);
					account.runningBalance = accounting.formatNumber(account.runningBalance, 2);
					return 	<tr key={index}>
								<td className="text-center">{account.transaction_date}</td>
								<td className="text-right">{account.transaction_type === 'DP' ? account.amount : null}</td>
								<td className="text-right">{account.transaction_type === 'WD' ? account.amount : null}</td>
								<td className="text-right">{account.transaction_type === 'DV' ? account.amount : null}</td>
								<td className="text-right">{account.runningBalance}</td>
							</tr>;
				}.bind(this));
			}
			view =	<table className="table table-bordered table-striped table-condensed">
						<thead>
							<tr>
								<th className="text-center">Date</th>
								<th className="text-center">Deposit</th>
								<th className="text-center">Withdraw</th>
								<th className="text-center">Dividend</th>
								<th className="text-center">Balance</th>
							</tr>
						</thead>
						<tbody>
							{ SOA }
						</tbody>
					</table>;
		}
		return (
			<div className="row">
				<div className="col-md-2 col-md-offset-1">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="form-group">
								<img src="/images/profile_placeholder.jpg" width="100%"/>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-8">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="page-header">
								<h2>My Investments</h2>
							</div>
							<div className="row">
								<div className="col-md-12">
									{ view }
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Investments Main  ======*/

if(typeof $("#investments-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<InvestmentsMain />,
	document.getElementById('investments-app-node'));
}