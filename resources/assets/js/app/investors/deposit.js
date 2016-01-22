/*====================================
=            Deposit View            =
====================================*/
var DepositLandingView = React.createClass({
	render: function () {
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>Make a Deposit</h1>
						</div>
						<div className="row">
							<div className="col-md-10 col-md-offset-1">
								<div className="form-group">
									<button className="btn btn-default btn-lg btn-block" onClick={this.props.mainViewChange.bind(null, 'ADVICE')}>{ "Advice for New Deposit" }</button>
									<button className="btn btn-default btn-lg btn-block" onClick={this.props.mainViewChange.bind(null, 'ADVICE-TABLE')}>{ "Report Actual Deposit" }</button>
									<button className="btn btn-default btn-lg btn-block">{ "Ask a Question" }</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Deposit Advice View  ----------*/

var DepositAdviceView = React.createClass({
	handleSubmit: function (e) {
		e.preventDefault();
		console.log('hello');
		this.props.mainViewChange('FINISH');
	},
	render: function () {
		return (
			<div className="col-md-4 col-md-offset-4">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>Advice a New Deposit</h1>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
									<form onSubmit={this.handleSubmit}>
										<div className="form-group">
											<label>Amount Deposit</label>
											<input 
												type="text"
												className="form-control"/>
										</div>
										<div className="form-group">
											<label>Expected Date of Deposit</label>
											<input 
												type="text"
												className="form-control"/>
										</div>
										<div className="form-group">
											<div className="pull-right">
												<div className="btn-group">
													<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'LANDING')}>Cancel</button>
													<button type="submit" className="btn btn-primary">Submit</button>
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

/*----------  Deposit Finish View ----------*/

var DepositFinishView = React.createClass({
	render: function () {
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>Advice a New Deposit</h1>
						</div>
						<div className="row">
							<div className="col-md-10 col-md-offset-1">
								<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
								<p className="text-justify">Curabitur ac urna augue. Proin eu lectus odio. Vestibulum ut dapibus dui, ac volutpat elit. Nulla id dui aliquam, aliquet nisl vel, varius justo. Nulla volutpat nisi vitae urna viverra aliquam. Curabitur in tellus scelerisque, ultricies ex sed, malesuada arcu. Nunc aliquam pretium malesuada.</p>
								<table className="table table-bordered table-striped table-condensed">
									<tbody>
										<tr>
											<td>Account Name</td>
											<td>SEDPI Foundation, Inc.</td>
										</tr>
										<tr>
											<td>Bank</td>
											<td>Banco de Oro Unibank</td>
										</tr>
										<tr>
											<td>Account Number</td>
											<td>004690126723</td>
										</tr>
										<tr>
											<td>Account Type</td>
											<td>Savings</td>
										</tr>
										<tr>
											<td>SWIFT Code</td>
											<td>BNORPHMM</td>
										</tr>
										<tr>
											<td>Address</td>
											<td>134 EDSA Corner Timog Avenue, Quezon City, Philippines</td>
										</tr>
									</tbody>
								</table>
								<div className="form-group">
									<div className="pull-right">
										<div className="btn-group">
											<button className="btn btn-primary" onClick={this.props.mainViewChange.bind(null, 'LANDING')}>Back to Deposit Menu</button>
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

/*----------  Deposit Advice Table View  ----------*/

var DepositAdviceTableView = React.createClass({
	render: function() {
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>Report Actual Deposit</h1>
						</div>
						<div className="row">
							<div className="col-md-12">
								<table className="table table-condensed table-striped table-bordered">
									<thead>
										<tr className="text-center">
											<td>#</td>
											<td>Amount</td>
											<td>Date Expected</td>
											<td>Date Submitted</td>
										</tr>
									</thead>
									<tbody>
										<tr className="text-center clickable-row" onClick={this.props.mainViewChange.bind(null, 'REPORT')}>
											<td>1</td>
											<td>Php 5,000.00</td>
											<td>Jan 12, 2016</td>
											<td>Jan 12, 2016 01:02:23 PM</td>	
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Deposit Report View  ----------*/

var DepositReportView = React.createClass({
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.mainViewChange('REPORT-FINISH');
	},
	render: function () {
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>Report Actual Deposit</h1>
						</div>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label>Deposit Details</label>
									<table className="table table-bordered table-striped table-condensed">
										<tbody>
											<tr>
												<td className="table-title-col">Date Expected to Deposit</td>
												<td>Jan 16, 2016</td>
											</tr>
											<tr>
												<td className="table-title-col">Amount Deposit</td>
												<td>Php 5,000.00</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div className="col-md-6">
								<form onSubmit={this.handleSubmit}>
									<div className="form-group">
										<label>Bank/RemittanceChannel</label>
										<input 
											type="text"
											className="form-control"/>
									</div>
									<div className="form-group">
										<label>Upload Image</label>
										<div className="panel panel-default">
											<div className="panel-body">
												<img src="/images/img_placeholder.png" width="100%" />
											</div>
										</div>
									</div>
									<div className="form-group">
										<div className="pull-right">
											<div className="btn-group">
												<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'LANDING')}>Cancel</button>
												<button type="submit" className="btn btn-primary">Submit</button>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Deposit Report Finish View  ----------*/

var DepositReportFinishView = React.createClass({
	render: function () {
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>Report Actual Deposit</h1>
						</div>
						<div className="row">
							<div className="col-md-10 col-md-offset-1">
								<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
								<p className="text-justify">{ "Thank you for your deposit. SEDPI will validate your information you've sent." }</p>
								<div className="form-group">
									<div className="pull-right">
										<div className="btn-group">
											<button className="btn btn-primary" onClick={this.props.mainViewChange.bind(null, 'LANDING')}>Back to Deposit Menu</button>
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


/*=====  End of Deposit View  ======*/

/*====================================
=            Deposit Main            =
====================================*/

var DepositMain = React.createClass({
	getInitialState: function () {
		return {
			mainView: undefined
		};
	},
	onMainViewChange: function (mainViewKeyword) {
		switch(mainViewKeyword) {
			case 'LANDING':
				this.setState({ mainView: undefined});
				break;

			case 'ADVICE':
				this.setState({ mainView: 'ADVICE'});
				break;

			case 'FINISH':
				this.setState({ mainView: 'FINISH'});
				break;

			case 'ADVICE-TABLE':
				this.setState({ mainView: 'ADVICE-TABLE'});
				break;

			case 'REPORT':
				this.setState({ mainView: 'REPORT' });
				break;

			case 'REPORT-FINISH':
				this.setState({ mainView: 'REPORT-FINISH' });
				break;
		}
	},
	render: function () {
		var view;
		switch(this.state.mainView) {
			case 'ADVICE': 
				view = <DepositAdviceView 
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'FINISH':
				view = <DepositFinishView 
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'ADVICE-TABLE':
				view = <DepositAdviceTableView 
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'REPORT':
				view = <DepositReportView 
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'REPORT-FINISH':
				view = <DepositReportFinishView 
							mainViewChange={this.onMainViewChange}/>;
				break;

			default: 
				view = <DepositLandingView 
							mainViewChange={this.onMainViewChange}/>;
				break;
		}
		return (
			<div className="row">
				{ view }
			</div>
		);
	}
});

/*=====  End of Deposit Main  ======*/


if(typeof $("#deposit-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<DepositMain />,
	document.getElementById('deposit-app-node'));
}