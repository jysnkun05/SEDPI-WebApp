/*===========================================
=            My Investment Views            =
===========================================*/

/*----------  My Statement of Accounts  ----------*/

var MyStatementOfAccountsView = React.createClass({
	render: function () {
		var detailView;
		if(this.props.account === undefined)
		{
			detailView = 	<div className="panel panel-default">
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
		}
		else if(this.props.account === 'retrying')
		{
			detailView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retying to load account details. Please wait.
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else if (this.props.account === 'error')
		{
			detailView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-exclamation-triangle fa-fw"></i> {"Unable to load account details."} <button className="btn btn-link btn-xs" onClick={this.props.retryGetAccountDetails}>Retry</button>
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else 
		{
			var investments = this.props.account.transactions;
			var investmentList = 	<tr>
										<td className="text-center" colSpan="5"><i className="fa fa-info-circle fa-fw"></i> No Entries Available.</td>
									</tr>;

			if(investments.length > 0)
			{
				investmentList = investments.map(function (investment, index) {
					var amount = accounting.formatNumber(investment.amount);
					var runningBalance = accounting.formatNumber(investment.runningBalance, 2);
					if(investments.length - 1 === index)
						runningBalance = <strong>{accounting.formatNumber(investment.runningBalance, 2)}</strong>;
					investment.date = moment(investment.transactionDate).format('DD MMM YYYY');
					return 	<tr key={index}>
								<td className="text-center">{investment.date}</td>
								<td className="text-center">{investment.transaction_type.description}</td>
								<td className="text-right red-bg">{investment.transaction_type.account_type === "DR" ? amount : null}</td>
								<td className="text-right">{investment.transaction_type.account_type === "CR" ? amount : null}</td>
								<td className="text-right">{runningBalance}</td>
							</tr>;
				});
			}

			detailView = 	<table className="table table-bordered table-striped table-condensed">
								<thead>
									<tr>
										<th className="text-center">Date</th>
										<th className="text-center">Transaction</th>
										<th className="text-center">Debit</th>
										<th className="text-center">Credit</th>
										<th className="text-center">Balance</th>
									</tr>
								</thead>
								<tbody>
									{investmentList}
								</tbody>
							</table>;
		}
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="page-header">
								<h2>My Statement of Account</h2>
							</div>
							<div className="row">
								<div className="col-md-12">
									{detailView}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of My Investment Views  ======*/


/*==========================================
=            My Investment Main            =
==========================================*/

var MyInvestmentMain = React.createClass({
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
				this.setState({account: account});
			}.bind(this),
			error: function (xhr, status, error) {
				if(counter < 3)
				{
					this.setState({account: 'retrying'});
					this._getAccountDetails(counter + 1);
				}
				else 
				{
					this.setState({account: status});
				}
			}.bind(this)
		});
	},
	_onRetryGetAccountDetails: function () {
		this.setState({account: undefined});
		this._getAccountDetails(0);
	},
	render: function () {
		var mainView = <MyStatementOfAccountsView 
							account={this.state.account}
							retryGetAccountDetails={this._onRetryGetAccountDetails}/>;
		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="row">
						<div className="col-md-3">
							<div className="panel panel-default">
								<div className="panel-body">
									<div className="form-group">
										<div className="list-group">
											<button
												type="button" 
												className="list-group-item btn-xs active">
													<i className="fa fa-chevron-right fa-fw"></i> My Statement of Account
											</button>
											<button
												type="button" 
												disabled="true"
												className="list-group-item btn-xs">
													<i className="fa fa-chevron-right fa-fw"></i> My Profile <small>coming soon</small>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-9">
							{mainView}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of My Investment Main  ======*/


if(typeof $("#investments-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<MyInvestmentMain />,
	document.getElementById('investments-app-node'));
}