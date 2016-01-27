/*=====================================
=            Deposit Views            =
=====================================*/

var DepositMainView = React.createClass({
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
		}).on('changeDate', function(e){
			self.setState({dateDeposit: e.date});
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
			type:  'POST',
			dataType: 'json',
			data: postData,
			success: function (response) {
				this.props.modalViewChange('ADVICE-SUCCESS');
				this.props.mainViewChange('DEPOSIT-INSTRUCTION');
				$("#DepositMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#DepositMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (response) {
				if(response.status === 422)
				{
					$("#DepositMessageContainerModal").modal('hide');
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});	
				}
				else
				{
					this.props.modalViewChange('ADVICE-ERROR');
					$("#DepositMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#DepositMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}
		});
	},
	amountBlurred: function () {
		this.setState({amount: accounting.formatNumber(this.state.amount, 2)});
	},
	amountFocused: function () {
		this.setState({amount: accounting.unformat(this.state.amount)});
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
										<div className="form-group" id="fg-amount">
											<label className="control-label" htmlFor="input-amount">Amount Deposit</label>
											<div className="input-group">
												<span className="input-group-addon">
													<span>Php</span>
												</span>
												<input 
													type="text" 
													id="input-amount"
													className="form-control text-right"
													value={this.state.amount}
													onFocus={this.amountFocused}
													onBlur={this.amountBlurred}
													onChange={this.handleChange.bind(null, 'amount')}/>
											</div>
										</div>
										<div className="form-group has-feedback" id="fg-dateDeposit">
											<label className="control-label" htmlFor="input-dateDeposit">Date Deposit</label>
											<div className="input-group date" id="datetimepicker-dateDeposit">
												<input 
													type="text" 
													id="input-dateDeposit"
													className="form-control"
													size="16"
													value={this.state.dateDeposit}
													onChange={this.handleChange.bind(null, 'dateDeposit')}/>
												<span className="input-group-addon">
													<span className="glyphicon glyphicon-calendar"></span>
												</span>
											</div>
										</div>
										<div className="form-group">
											<div className="pull-right">
												<div className="btn-group">
													<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'MAIN')}>Cancel</button>
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

/*----------  Deposit Post Advice View ----------*/

var DepositInstructionView = React.createClass({
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
											<button className="btn btn-primary" onClick={this.props.mainViewChange.bind(null, 'MAIN')}>Back to Deposit Menu</button>
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

/*----------  Deposit Advice Table View   ----------*/

var DepositAdviceTableView = React.createClass({
	getInitialState: function () {
		return {
			adviceDeposits: undefined,
			actualDeposits: undefined
		};
	},
	getDepositDetails: function () {
		$.ajax({
			url: '/api/investors/getDepositDetails',
			type: 'POST',
			dataType: 'json',
			success: function (deposits) {

			}
		});
	},
	render: function () {
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h2>Your Deposit Advice Details</h2>
						</div>
						<div className="row">
							<div className="col-md-12">
								<table className="table table-condensed table-striped table-bordered">
									<thead>
										<tr>
											<th className="text-center">Date</th>
											<th className="text-center">Amount</th>
											<th className="text-center">Date Expected</th>
											<th className="text-center">Status</th>
										</tr>
									</thead>
									<tbody>
										<tr className="text-center clickable-row">
											<td>1</td>
											<td>Php 5,000.00</td>
											<td>Jan 12, 2016</td>
											<td>Jan 12, 2016 01:02:23 PM</td>	
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="page-header">
							<h2>Your Actual Deposit Details</h2>
						</div>
						<div className="row">
							<div className="col-md-12">
								<table className="table table-condensed table-striped table-bordered">
									<thead>
										<tr>
											<th className="text-center">Date</th>
											<th className="text-center">Amount</th>
											<th className="text-center">Date Expected</th>
											<th className="text-center">Status</th>
										</tr>
									</thead>
									<tbody>
										<tr className="text-center clickable-row">
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

/*=====  End of Deposit Views  ======*/

/*==============================================
=            Deposit Message Modals            =
==============================================*/

var DepositMessageContainerModal = React.createClass({
	render: function () {
		var modalMessageComponent;
			var modalView = this.props.modalView;
			switch(modalView) {
				case 'ADVICE-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Saving Your Deposit Advice
											</div>
											<div className="panel-body">
												<div className="row">
													<div className="col-md-12">
														<div className="form-group">
															<p className="text-center"><i className="fa fa-circle-o-notch fa-2x fa-spin"></i></p>
															<p className="text-center">Please wait a moment.</p>
														</div>
													</div>
												</div>
											</div>
										</div>;
				break;

				case 'ADVICE-SUCCESS':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Your deposit has been saved.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

				case 'ADVIVE-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-times-circle fa-fw"></i> Your adviced deposit not saved. Please try again.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;
			}
			return (		
				<div className="modal fade" id="DepositMessageContainerModal" role="dialog">
					<div className="modal-dialog" role="document">
						{ modalMessageComponent }
					</div>
				</div>
		);
	}
});

/*=====  End of Deposit Message Modals  ======*/


/*====================================
=            Deposit Main            =
====================================*/

var DepositMain = React.createClass({
	getInitialState: function () {
		return {
			mainView: undefined,
			modalView: undefined
		};
	},
	onMainViewChange: function (mainViewKeyword) {
		this.setState({mainView: mainViewKeyword});
	},	
	onModalViewChange: function (modalViewKeyword) {
		this.setState({modalView: modalViewKeyword});
	},
	render: function () {
		var view;
		switch(this.state.mainView) {
			case 'ADVICE':
				view = <DepositAdviceView 
							modalViewChange={this.onModalViewChange}
							mainViewChange={this.onMainViewChange}/>
				break;

			case 'ADVICE-TABLE':
				view = <DepositAdviceTableView 
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'DEPOSIT-INSTRUCTION':
				view = <DepositInstructionView 
							mainViewChange={this.onMainViewChange}/>
				break;




			default: 
				view = <DepositMainView mainViewChange={this.onMainViewChange}/>;
				break;
		}
		return (
			<div className="row">
				{ view }
				<DepositMessageContainerModal modalView={this.state.modalView}/>
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