/*========================================
=            Transaction View            =
========================================*/

var TransacationTableView = React.createClass({
	getInitialState: function () {
		return {
			viewAction: 'deposit'
		};
	},
	render: function () {
		var view;
		switch(this.state.viewAction) {
			case 'deposit':
				view = 	<table className="table table-condensed table-bordered table-striped">
							<thead>
								<tr>
									<td className="text-center">Date</td>
									<td className="text-center">Investor Name</td>
									<td className="text-center">Amount Deposit</td>
									<td className="text-center">Bank/Remittance Channel</td>
									<td className="text-center">Status</td>
								</tr>
							</thead>
							<tbody>
								<tr className="text-center">
									<td>03 Jan 2016</td>
									<td>Jayson Busano De los Reyes</td>
									<td>Php 5,000.00</td>
									<td></td>
									<td>Adviced</td>
								</tr>
								<tr className="text-center">
									<td>03 Jan 2016</td>
									<td>Jayson Busano De los Reyes</td>
									<td>Php 5,000.00</td>
									<td>BDO</td>
									<td>Reported</td>
								</tr>
							</tbody>
						</table>;
				break;

			case 'withdrawal':
				view = 	<table className="table table-condensed table-bordered table-striped">
							<thead>
								<tr>
									<td className="text-center">Date</td>
									<td className="text-center">Investor Name</td>
									<td className="text-center">Amount Deposit</td>
									<td className="text-center">Bank/Remittance Channel</td>
									<td className="text-center">Status</td>
								</tr>
							</thead>
							<tbody>
								<tr className="text-center">
									<td>03 Jan 2016</td>
									<td>Jayson Busano De los Reyes</td>
									<td>Php 5,000.00</td>
									<td></td>
									<td>Adviced</td>
								</tr>
								<tr className="text-center">
									<td>03 Jan 2016</td>
									<td>Jayson Busano De los Reyes</td>
									<td>Php 5,000.00</td>
									<td>BDO</td>
									<td>Reported</td>
								</tr>
							</tbody>
						</table>;

				break;

		}
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="form-group">
							<ul className="nav nav-tabs">
								<li role="presentation" className={this.state.viewAction === "deposit" ? "active" : ""}><a>Deposit</a></li>
								<li role="presentation" className={this.state.viewAction === "withdrawal" ? "active" : ""}><a>Withdrawal</a></li> 
							</ul>
						</div>
						<div className="form-group">
							{ view }
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Transaction Detail View  ----------*/

var TransactionDepositDetailView = React.createClass({
	render: function () {
		return (
			<div className="col-md-6 col-md-offset-3">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h2>Transaction Details - Deposit</h2>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
									<table className="table table-striped table-bordered table-condensed">
										<tbody>
											<tr>
												<td className="table-title-col">Investor Name</td>
												<td>Jayson Busano De los Reyes</td>
											</tr>
											<tr>
												<td className="table-title-col">Amount Deposited</td>
												<td>Php 5,000.00</td>
											</tr>
											<tr>
												<td className="table-title-col">Date Adviced</td>
												<td>03 Jan 2016</td>
											</tr>
											<tr>
												<td className="table-title-col">Date Reported</td>
												<td>04 Jan 2016</td>
											</tr>
											<tr>
												<td className="table-title-col">Bank/Remittance Channel</td>
												<td>BDO Unibank, Inc.</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div className="form-group">
									<label>Uploaded Image</label>
									<div className="media">
										<img className="img-responsive" width="100%" src="/images/deposit_slip_sample.jpg"/>
									</div>
								</div>
								<div className="form-group">
									<div className="pull-right">
										<div className="btn-group">
											<button className="button" className="btn btn-default">Back</button>
											<button className="button" className="btn btn-primary">Verify</button>
										</div>
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

/*=====  End of Transaction View  ======*/

/*=================================================
=            Transaction Modal Message            =
=================================================*/

var TransactionModalMessage = React.createClass({
	componentDidMount: function () {
		//$("#TransactionModalMessage").modal();
	},
	render: function () {
		return (
			<div className="modal fade" tabIndex="-1" role="dialog" id="TransactionModalMessage">
  				<div className="modal-dialog">
  					<div className="panel panel-default">
  						<div className="panel-heading">
  							Verify Deposit
  							<button type="button" className="close" data-dismiss="modal">&times;</button>
  						</div>
  						<div className="panel-body">
  							<div className="row">
  								<div className="col-md-12">
  									<form>
  										<div className="form-group">
  											<label>Status</label>
  											<select className="form-control" defaultValue="">
  												<option disabled={true} value="">Please Choose...</option>
  												<option value="Accept">Accept & Post</option>
  												<option value="Reject">Reject</option>
  											</select>
  										</div>
  										<div className="form-group">
  											<label>Message/Reason</label>
  											<textarea
  												type="text"
  												className="form-control"
  												rows="3">
  											</textarea>
  										</div>
  										<div className="form-group">
  											<div className="pull-right">
  												<div className="btn-group">
  													<button type="button" className="btn btn-default">Cancel</button>
  													<button type="submit" className="btn btn-primary">Confirm</button>
  												</div>
  											</div>
  										</div>
  									</form>
  								</div>
  							</div>
  						</div>
  					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Transaction Modal Message  ======*/


/*========================================
=            Transaction Main            =
========================================*/

var TransactionMain = React.createClass({
	render: function () {
		return (
			<div className="row">
				<TransacationTableView />
				<TransactionModalMessage />
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