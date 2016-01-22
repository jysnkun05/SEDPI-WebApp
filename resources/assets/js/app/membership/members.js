/*==========================================
=            Member Detail View            =
==========================================*/

var MemberDetailView = React.createClass({
	render: function () {
		return (
			<div className="col-md-12">
				<div className="row">
					<div className="col-md-8 col-md-offset-2">
						<div className="panel panel-default">
							<div className="panel-body">
								<div className="form-group">
									<ul className="nav nav-tabs">
										<li role="presentation" className="active"><a>Statement of Account</a></li>
										<li role="presentation"><a>Profile</a></li> 
										<li role="presentation"><a>Transaction Logs</a></li>
									</ul>
								</div>
								<div className="form-group">
									<div className="row">
										<div className="col-md-12">
											<table className="table table-bordered table-striped table-condensed">
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

												</tbody>
											</table>
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
})

/*=====  End of Member Detail View  ======*/

/*=========================================
=            Member Table View            =
=========================================*/

var MemberTableView = React.createClass({
	render: function () {
		return(
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-heading">
						Member List
					</div>
					<div className="panel-body">
						<div className="row">
							<div className="col-md-12">
								<table className="table table-bordered table-striped table-condensed">
									<thead>
										<tr>
											<th className="text-center">#</th>
											<th className="text-center">Member Name</th>
											<th className="text-center">Location</th>
											<th className="text-center">Member Since</th>
											<th className="text-center">Balance</th>
										</tr>
									</thead>
									<tbody>

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

/*=====  End of Member Table View  ======*/


/*===================================
=            Member Main            =
===================================*/

var MemberMain = React.createClass({
	render: function () {
		return (
			<div className="row">
				<MemberDetailView />
			</div>
		);
	}
});

/*=====  End of Member Main  ======*/


if(typeof $("#members-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<MemberMain />,
	document.getElementById('members-app-node'));
}