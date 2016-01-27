
/*=========================================
=            Transaction Views            =
=========================================*/

var TransactionOpenRequestsView = React.createClass({
	render: function () {
		return (
			<div className="row">
				<div className="col-md-12">
					<table className="table table-bordered table-striped table-condensed">
						<thead>
							<tr>
								<td className="text-center">Date</td>
								<td className="text-center">Investor Name</td>
								<td className="text-center">Transaction Type</td>
								<td className="text-center">Amount</td>
								<td className="text-center">Status</td>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		);
	}
});

/*=====  End of Transaction Views  ======*/

/*========================================
=            Transaction Main            =
========================================*/

var TransactionMain = React.createClass({
	render: function () {
		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="page-header">
								<h2>Transactions</h2>
							</div>
							<div className="row">
								<div className="col-md-12">
									<div className="form-group">
										<ul className="nav nav-tabs">
											<li role="presentation" className="active"><a>Open Request</a></li>
											<li role="presentation"><a>Approved Requests</a></li> 
											<li role="presentation"><a>Failed Requests</a></li>
										</ul>
									</div>
									<div className="form-group">
										<TransactionOpenRequestsView />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
/*=====  End of Transaction Main  ======*/

if(typeof $("#transaction-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<TransactionMain />,
	document.getElementById('transaction-app-node'));
}