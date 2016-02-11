/*========================================
=            My Deposit Views            =
========================================*/

/*----------  Deposit Selection View  ----------*/

var DepositSelectionView = React.createClass({
	render: function () {
		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="page-header">
								<h2>Make a Deposit</h2>
							</div>
							<div className="row">
								<div className="col-md-10 col-md-offset-1">
									<div className="form-group">
										<button className="btn btn-default btn-lg btn-block">{ "Advice for New Deposit" }</button>
										<button className="btn btn-default btn-lg btn-block">{ "Report Actual Deposit" }</button>
										<button className="btn btn-default btn-lg btn-block">{ "Ask a Question" }</button>
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

/*=====  End of My Deposit Views  ======*/

/*========================================
=            Modal Components            =
========================================*/

/*----------  Form Modal  ----------*/

var DepositFormContainerModal = React.createClass({
	render: function () {

		var modalFormComponent;
		switch(this.props.modalForm) {
			default:
				modalFormComponent = null;
				break;
		}
		return (
			<div className="modal fade" id="InvestFormContainerModal" role="dialog">
				<div className="modal-dialog" role="document">
					{ modalFormComponent }
				</div>
			</div>
		);
	}
});

/*=====  End of Modal Components  ======*/

/*=============================================
=            Form Modal Components            =
=============================================*/

/*----------  Advice Deposit Components  ----------*/

var AdviceDepositComponents = React.createClass({
	render: function () {
		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="panel panel-default">
						<div className="panel-heading">
							Advice New Deposit
						</div>
						<div className="panel-body">
							<form>
								<div className="form-group">

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
});	

/*=====  End of Form Modal Components  ======*/


/*=======================================
=            My Deposit Main            =
=======================================*/

var MyDepositMain = React.createClass({
	render: function () {
		return (
			<div createClass="row">
				<div className="col-md-10 col-md-offset-1">
					<DepositSelectionView />
				</div>
			</div>
		);
	}
});

/*=====  End of My Deposit Main  ======*/

if(typeof $("#deposit-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<MyDepositMain />,
	document.getElementById('deposit-app-node'));
}