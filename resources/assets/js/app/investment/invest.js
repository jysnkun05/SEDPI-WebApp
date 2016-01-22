/*===========================================
=            Investor Table View            =
===========================================*/

var InvestTableView = React.createClass({
	render: function () {
		var investors = this.props.investors;
		var rows;
		if(investors === undefined)
		{
			rows = 	<tr className="text-center">
						<td colSpan="6"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retrieving Investors...</td>
					</tr>;
		}
		else if(investors.length > 0)
		{
			rows = investors.map(function (investor, index) {
				investor.fullName = investor.middleName !== null ? investor.firstName + " " + investor.middleName + " " + investor.lastName : investor.firstName + " " + investor.lastName;
				investor.location = investor.location !== null ? investor.location : 'Not Set';
				investor.member_since = moment.tz(investor.member_since, moment.tz.guess()).format('DD MMM YYYY');
				investor.balance = accounting.formatMoney(investor.balance, "PhP ");
				return 	<tr key={index} className="text-center clickable-row" onClick={this.props.investorSelect.bind(null, investor.id)}>
							<td>{index + 1}</td>
							<td>{investor.fullName}</td>
							<td>{investor.location}</td>
							<td>{investor.member_since}</td>
							<td>{investor.balance}</td>
						</tr>;
			}.bind(this));
		}
		else 
		{
			rows = 	<tr className="text-center">
						<td colSpan="6">{"No Investors Created. Try to add new one."}</td>
					</tr>;
		}
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-heading">
						Investor List
						<div className="pull-right">
							<div className="btn-group">
								<button type="button" className="btn btn-primary btn-xs" onClick={this.props.mainViewChange.bind(null, 'ADD')}>Add New Investor</button>
							</div>
						</div>
					</div>
					<div className="panel-body">
						<table className="table table-bordered table-striped table-condensed">
							<thead>
								<tr>
									<th className="text-center">#</th>
									<th className="text-center">Investor Name</th>
									<th className="text-center">Location</th>
									<th className="text-center">Member Since</th>
									<th className="text-center">Balance</th>
								</tr>
							</thead>
							<tbody>
								{ rows }
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Investor Table View  ======*/

/*=========================================
=            Investor Add View            =
=========================================*/

var InvestAddView = React.createClass({
	getInitialState: function () {
		return {
			firstName: '',
			middleName: '',
			lastName: '',
			location: '',
			email: '',
			retries: 0,
			countries: undefined
		};
	},
	componentWillMount: function () {
		this.getCountryList();
	},
	getCountryList: function () {
		this.setState({retries: this.state.retries + 1});
		$.ajax({
			url: '/api/utilities/getCountryList',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (countries) {
				this.setState({
					retries: 0,
					countries: countries
				});
			}.bind(this),
			error: function () {
				if(this.state.retries <= 3)
					this.getCountryList();
			}.bind(this)
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var postData = {
			firstName: this.state.firstName.trim(),
			middleName: this.state.middleName.trim(),
			lastName: this.state.lastName.trim(),
			location: this.state.location,
			email: this.state.email.trim()
		};

		this.setState({
			firstName: postData.firstName,
			middleName: postData.middleName,
			lastName: postData.lastName,
			email: postData.email
		});

		this.props.modalViewChange('ADD-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/investment/saveInvestor',
			type: 'POST',
			dataType: 'json',
			data: postData,
			success: function () {
				this.props.modalViewChange('ADD-SUCCESS');
				this.props.mainViewChange('TABLE');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (response) {
				$("#InvestMessageContainerModal").modal('hide');
				if(response.status === 422)
				{
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});	
				}
			}
		});

	},
	render: function () {
		var countryOptions;
		if(this.state.countries === undefined) 
		{
			countryOptions = <option disabled={true}>Please wait...</option>;
		}
		else
		{
			var counter = 0;
			countryOptions = $.map(this.state.countries, function (country, index) {
				return <option key={++counter} value={index}>{country}</option>;
			}.bind(this));
		}
		return (
			<div className="col-md-6 col-md-offset-3">
				<div className="panel panel-default">
					<div className="panel-heading">
						Add New Investor
					</div>
					<div className="panel-body">
						<div className="row">
							<div className="col-md-12">
								<form onSubmit={this.handleSubmit}>
									<div className="form-group">
										<label>Investor Name *</label>
										<div className="form-group has-feedback" id="fg-firstName">
											<input
												type="text"
												id="input-firstName"
												placeholder="First Name *"
												className="form-control"
												onChange={this.handleChange.bind(null, 'firstName')}/>
										</div>
										<div className="form-group">
											<input
												type="text"
												placeholder="Middle Name"
												className="form-control"
												onChange={this.handleChange.bind(null, 'middleName')}/>
										</div>
										<div className="form-group has-feedback" id="fg-lastName">
											<input
												type="text"
												id="input-lastName"
												placeholder="Last Name *"
												className="form-control"
												onChange={this.handleChange.bind(null, 'lastName')}/>
										</div>
									</div>
									<div className="form-group">
										<label>Location *</label>
										<select className="form-control" value={this.state.location} onChange={this.handleChange.bind(null, 'location')} disabled={this.state.countries === undefined}>
											{this.state.countries !== undefined ? 
												<option value="" disabled={true}>Please select...</option> : null}
											{ countryOptions }
										</select>
									</div>
									<div className="form-group has-feedback" id="fg-email">
										<label className="control-label">Email Address *</label>
										<input
											type="text"
											id="input-email"
											placeholder="someone@company.com"
											className="form-control"
											onChange={this.handleChange.bind(null, 'email')}/>
									</div>
									<div className="form-group">
										<div className="pull-right">
											<div className="btn-group">
												<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'TABLE')}>Cancel</button>
												<button type="submit" className="btn btn-primary">Create</button>
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

/*=====  End of Investor Add View  ======*/

/*===========================================
=            Invest Details View            =
===========================================*/

var InvestDetailView = React.createClass({
	getInitialState: function () {
		return {
			detailView: 'PROFILE',
			profileData: undefined,
			investmentData: undefined,
			retries: 0,
		};
	},
	componentWillMount: function () {
		this.getInvestorProfile(this.props.selectedInvestorId, this.state.retries);
		this.getInvestorInvestments(this.props.selectedInvestorId, this.state.retries);
	},
	sendEmailVerification: function (id) {
		this.props.modalViewChange('EMAIL-SENDING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';
		$.ajax({
			url: '/api/investment/sendEmailVerification',
			type: 'POST',
			data: {id : id},
			dataType: 'json',
			success: function (response) {
				this.props.modalViewChange('EMAIL-SENT');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				this.getInvestorProfile(this.props.selectedInvestorId, this.state.retries);
			}.bind(this),
			error: function () {
				this.props.modalViewChange('EMAIL-ERROR');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this)
		});
	},
	getInvestorProfile: function (id, retries) {
		this.setState({retries: retries + 1});
		$.ajax({
			url: '/api/investment/getInvestorProfile',
			type: 'POST',
			data: {id: id},
			dataType: 'json',
			cache: false,
			success: function (profileData) {
				this.setState({
					profileData: profileData,
					retries: 0
				});
			}.bind(this),
			error: function () {
				if(retries <= 3)
					this.getInvestorProfile(id ,retries);
			}.bind(this)	
		});
	},
	getInvestorInvestments: function (id, retries) {
		this.setState({retries: retries + 1});
		$.ajax({
			url: '/api/investment/getInvestorInvestments',
			type: 'POST',
			data: {id: id},
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
	onDetailViewChange: function (detailViewKeyword) {
		this.setState({detailView : detailViewKeyword});
	},
	render: function () {
		var view;
		if(this.state.detailView === 'PROFILE')
		{
			view =	<InvestProfileDetails 
						profileData={this.state.profileData}
						mainViewChange={this.props.mainViewChange}
						sendEmailVerification={this.sendEmailVerification}/>;
		}
		else if(this.state.detailView === 'INVESTMENT')
		{
			view =	<InvestInvestmentsDetails
						investmentData={this.state.investmentData}
						mainViewChange={this.props.mainViewChange}/>;
		}
		return (
			<div className="col-md-12">
				<div className="row">
					<div className="col-md-2 col-md-offset-1">
						<div className="panel panel-default">
							<div className="panel-body">
								<div className="form-group">
									<img src="/images/profile_placeholder.jpg" width="100%" className="img-circle"/>
								</div>
								<div className="list-group">
								  	<button type="button" 
								  		className={this.state.detailView === 'PROFILE' ? "list-group-item btn-xs active" : "list-group-item btn-xs"} 
								  		onClick={this.onDetailViewChange.bind(null, 'PROFILE')}>
								  			View Profile 
							  		</button>
								  	<button type="button" 
								  		className={this.state.detailView === 'INVESTMENT' ? "list-group-item btn-xs active" : "list-group-item btn-xs"}
								  		onClick={this.onDetailViewChange.bind(null, 'INVESTMENT')}>
								  			View Investments
								  	</button>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-8">
						{ view }
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Invest Details View  ======*/

/*==============================================
=            Invest Investments Details            =
==============================================*/

var InvestInvestmentsDetails = React.createClass({
	render: function () {
		var investmentView;
		if(this.props.investmentData === undefined) 
		{
			investmentView = 	<div className="panel panel-default">
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
		else
		{
			investmentView = 	<InvestAccountDetails 
									investmentData={this.props.investmentData}
									mainViewChange={this.props.mainViewChange}/>;
		}
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div className="page-header">
						<div className="pull-right">
							<button className="btn btn-link btn-xs" onClick={this.props.mainViewChange.bind(null, 'TABLE')}>Back to Investor List</button>
						</div>
						<h2>Investment Details</h2>
					</div>
					<div className="row">
						<div className="col-md-12">
							{ investmentView }
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Invest SOA Details  ----------*/

var InvestAccountDetails = React.createClass({
	render: function () {
		var SOA = 	<tr className="text-center">
						<td colSpan="5">No Transactions Created.</td>
					</tr>;

		if(this.props.investmentData.length > 0) {
			SOA = this.props.investmentData.map(function (account, index) {
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
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Statement of Account
					<div className="pull-right">
						<div className="btn-group">
							<button type="button" className="btn btn-default btn-xs" onClick={this.props.mainViewChange.bind(null, 'DEPOSIT')}>Deposit</button>
							<button type="button" className="btn btn-default btn-xs" onClick={this.props.mainViewChange.bind(null, 'WITHDRAW')}>Withdraw</button>
						</div>
					</div>
				</div>
				<div className="panel-body">
					<table className="table table-condensed table-striped table-bordered">
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
					</table>
				</div>
			</div>
		);
	}
});

/*=====  End of Invest Account Details  ======*/


/*==============================================
=            Invest Profile Details            =
==============================================*/

var InvestProfileDetails = React.createClass({
	render: function () {
		var profileView;
		if(this.props.profileData === undefined) 
		{
			profileView = 	<div className="panel panel-default">
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
		else
		{
			profileView = 	<ProfileUserCredentials 
								profileData={this.props.profileData}
								sendEmailVerification={this.props.sendEmailVerification}/>;
		}
		return(
			<div className="panel panel-default">
				<div className="panel-body">
					<div className="page-header">
						<div className="pull-right">
							<button className="btn btn-link btn-xs" onClick={this.props.mainViewChange.bind(null, 'TABLE')}>Back to Investor List</button>
						</div>
						<h2>Investor Profile</h2>
					</div>
					<div className="row">
						<div className="col-md-12">
							{ profileView }
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Invest Profile User Credentials  ----------*/

var ProfileUserCredentials = React.createClass({
	componentDidMount: function () {
		if(typeof $("#email-verification-warning-icon").prop('tagName') !== typeof undefined) {
			$("#email-verification-warning-icon").popover({trigger: 'hover', content: 'Email Address not yet verified.', placement: 'top'});
		}

		if(typeof $("#email-verified-icon").prop('tagName') !== typeof undefined) {
			$("#email-verified-icon").popover({trigger: 'hover', content: 'Email Address verified.', placement: 'top'});
		}
	},
	render: function () {
		var user = this.props.profileData.user;
		var investor = this.props.profileData.investor;
		investor.fullName = investor.middleName !== null ? investor.firstName + " " + investor.middleName + " " + investor.lastName : investor.firstName + " " + investor.lastName;
			
		var sendEmailButton = user.is_verified ? null : <button type="button" className="btn btn-link btn-xs" onClick={this.props.sendEmailVerification.bind(null, investor.id)}>{user.verification_code ? "Send Email Verification" : "Resend Email Verification"}</button>;

		return(
			<div className="panel panel-default">
				<div className="panel-heading">
					User Credentials
					<div className="pull-right">
						{ sendEmailButton }
					</div>
				</div>
				<div className="panel-body">
					<table className="table table-condensed table-striped table-bordered">
						<tbody>
							<tr>
								<td className="table-title-col">Name</td>
								<td>{investor.fullName}</td>
							</tr>
							<tr>
								<td className="table-title-col">Email Address</td>
								<td>
									{user.email} {user.is_verified ? <i className="fa fa-check-circle green-bg" id="email-verified-icon"></i> : <i className="fa fa-exclamation-triangle orange-bg" id="email-verification-warning-icon"></i>}
								</td>
							</tr>
							<tr>
								<td className="table-title-col">User Name</td>
								<td>{user.username === null ? "Username not set." : user.username}</td>
							</tr>
							<tr>
								<td className="table-title-col">Password</td>
								<td>{user.has_password ? '******': 'Password not set.'}</td>
							</tr>
							<tr>
								<td className="table-title-col">Status</td>
								<td>{user.is_active ? 'Online' : 'Locked'}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
});

/*=====  End of Invest Profile Details  ======*/

/*======================================
=            Invest Deposit            =
======================================*/

var InvestDepositForm = React.createClass({
	getInitialState: function () {
		return {
			depositDate: moment().format('MM/DD/YYYY'),
			depositAmount: "0.00",
			notes: ''
		};
	},
	componentDidMount: function () {
		var self = this;
		$("#datetimepicker-depositDate").datepicker({
			autoclose: true
		}).on('changeDate', function(e){
			self.setState({depositDate: e.date});
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange('DEPOSIT-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.selectedInvestorId,
			depositDate: this.state.depositDate,
			depositAmount: accounting.unformat(this.state.depositAmount),
			notes: this.state.notes
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/transaction/deposit',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				this.props.modalViewChange('DEPOSIT-SUCCESS');
				this.props.mainViewChange('DETAILS');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;

			}.bind(this),
			error: function (response) {
				if(response.status === 422)
				{
					$("#InvestMessageContainerModal").modal('hide');	
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});	
				}
				else
				{
					this.props.modalViewChange('DEPOSIT-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	amountBlurred: function () {
		this.setState({depositAmount: accounting.formatNumber(this.state.depositAmount, 2)});
	},
	amountFocused: function () {
		this.setState({depositAmount: accounting.unformat(this.state.depositAmount)});
	},
	render: function () {
		return (
			<div className="col-md-4 col-md-offset-4">
				<div className="panel panel-default">
					<div className="panel-heading">
						Deposit Investment
					</div>
					<div className="panel-body">
						<div className="row">
							<div className="col-md-12">
								<form onSubmit={this.handleSubmit}>
									<div className="form-group has-feedback" id="fg-depositDate">
										<label className="control-label" htmlFor="input-depositDate">Date Deposit</label>
											<div className="input-group date" id="datetimepicker-depositDate">
												<input 
													type="text" 
													id="input-depositDate"
													className="form-control"
													size="16"
													value={this.state.depositDate}
													onChange={this.handleChange.bind(null, 'depositDate')}/>
												<span className="input-group-addon">
													<span className="glyphicon glyphicon-calendar"></span>
												</span>
											</div>
									</div>
									<div className="form-group" id="fg-depositAmount">
										<label className="control-label" htmlFor="input-depositAmount">Amount Deposit</label>
										<div className="input-group">
											<span className="input-group-addon">
												<span>Php</span>
											</span>
											<input 
												type="text" 
												id="input-depositAmount"
												className="form-control text-right"
												value={this.state.depositAmount}
												onFocus={this.amountFocused}
												onBlur={this.amountBlurred}
												onChange={this.handleChange.bind(null, 'depositAmount')}/>
										</div>
									</div>
									<div className="form-group">
										<label>Notes/Reason <small>(optional)</small></label>
										<textarea 
											className="form-control"
											rows="5"
											value={this.state.notes}
											onChange={this.handleChange.bind(null, 'notes')}/>

									</div>
									<div className="form-group">
										<div className="pull-right">
											<div className="btn-group">
												<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'DETAILS')}>Cancel</button>
												<button type="submit" className="btn btn-primary">Add Deposit</button>
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

/*=====  End of Invest Deposit  ======*/

/*=======================================
=            Invest Withdraw            =
=======================================*/

var InvestWithdrawForm = React.createClass({
	getInitialState: function () {
		return {
			withdrawDate: moment().format('MM/DD/YYYY'),
			withdrawAmount: "0.00",
			notes: ''
		};
	},
	componentDidMount: function () {
		var self = this;
		$("#datetimepicker-withdrawDate").datepicker({
			autoclose: true
		}).on('changeDate', function(e){
			self.setState({withdrawDate: e.date});
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange('WITHDRAW-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.selectedInvestorId,
			withdrawDate: this.state.withdrawDate,
			withdrawAmount: accounting.unformat(this.state.withdrawAmount),
			notes: this.state.notes
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/transaction/withdraw',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				this.props.modalViewChange('WITHDRAW-SUCCESS');
				this.props.mainViewChange('DETAILS');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;

			}.bind(this),
			error: function (response) {
				if(response.status === 422)
				{
					$("#InvestMessageContainerModal").modal('hide');	
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});	
				}
				else
				{
					this.props.modalViewChange('WITHDRAW-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	amountBlurred: function () {
		this.setState({withdrawAmount: accounting.formatNumber(this.state.withdrawAmount, 2)});
	},
	amountFocused: function () {
		this.setState({withdrawAmount: accounting.unformat(this.state.withdrawAmount)});
	},
	render: function () {
		return (
			<div className="col-md-4 col-md-offset-4">
				<div className="panel panel-default">
					<div className="panel-heading">
						Withdraw Investment
					</div>
					<div className="panel-body">
						<div className="row">
							<form onSubmit={this.handleSubmit}>
								<div className="col-md-12">
									<div className="form-group has-feedback" id="fg-withdrawDate">
										<label className="control-label" htmlFor="input-withdrawDate">Date Withdraw</label>
											<div className="input-group date" id="datetimepicker-withdrawDate">
												<input 
													type="text" 
													id="input-withdrawDate"
													className="form-control"
													size="16"
													value={this.state.withdrawDate}
													onChange={this.handleChange.bind(null, 'withdrawDate')}/>
												<span className="input-group-addon">
													<span className="glyphicon glyphicon-calendar"></span>
												</span>
											</div>
									</div>
									<div className="form-group" id="fg-withdrawAmount">
										<label className="control-label" htmlFor="input-withdrawAmount">Amount Withdraw</label>
										<div className="input-group">
											<span className="input-group-addon">
													<span>Php</span>
												</span>
											<input 
												type="text" 
												id="input-withdrawAmount"
												className="form-control text-right"
												value={this.state.withdrawAmount}
												onFocus={this.amountFocused}
												onBlur={this.amountBlurred}
												onChange={this.handleChange.bind(null, 'withdrawAmount')}/>
										</div>
									</div>
									<div className="form-group">
										<label>Notes/Reason <small>(optional)</small></label>
										<textarea 
											className="form-control"
											rows="5"
											value={this.state.notes}
											onChange={this.handleChange.bind(null, 'notes')}/>
									</div>
									<div className="form-group">
										<div className="pull-right">
											<div className="btn-group">
												<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'DETAILS')}>Cancel</button>
												<button type="submit" className="btn btn-primary">Add Withdrawal</button>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Invest Withdraw  ======*/

/*=============================================
=            Invest Message Modals            =
=============================================*/

var InvestMessageContainerModal = React.createClass({
	render: function () {
		var modalMessageComponent;
		var modalView = this.props.modalView;
		switch(modalView) {
			case 'ADD-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Saving New Investor
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

			case 'ADD-SUCCESS':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> New Investor Added.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'EMAIL-SENDING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Sending Email Verification
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

			case 'EMAIL-SENT':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Email Verification Sent.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'EMAIL-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Email Verification not sent. Please try again.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'DEPOSIT-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Saving Deposit
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

			case 'DEPOSIT-SUCCESS':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> New Deposit Added.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'DEPOSIT-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Deposit not saved. Please try again.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'WITHDRAW-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Saving Withdrawal
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

			case 'WITHDRAW-SUCCESS':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> New Withdrawal Added.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'WITHDRAW-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Withdrawal not saved. Please try again.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

		}
		return (
			<div className="modal fade" id="InvestMessageContainerModal" role="dialog">
				<div className="modal-dialog" role="document">
					{ modalMessageComponent }
				</div>
			</div>
		);
	}
});

/*=====  End of Invest Message Modals  ======*/

/*===================================
=            Invest Main            =
===================================*/

var InvestMain = React.createClass({
	getInitialState: function () {
		return {
			investors: undefined,
			retries: 0,
			mainView: undefined,
			modalView: undefined,
			selectedInvestorId: undefined
		};
	},
	componentWillMount: function () {
		this.getInvestors(this.state.retries);
	},
	getInvestors: function (retries) {
		this.setState({retries: this.state.retries + 1});
		$.ajax({
			url: '/api/investment/getInvestors',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (investors) {
				this.setState({
					investors: investors,
					retries: 0 
				});
			}.bind(this),
			error: function () {
				if(this.state.retries <= 3)
					this.getInvestors(this.state.retries);
			}.bind(this)
		});
	},
	onInvestorSelect: function (id) {
		this.setState({
			selectedInvestorId: id,
			mainView: 'DETAILS'
		});
	},
	onMainViewChange: function (mainViewKeyword) {
		if(mainViewKeyword === 'TABLE')
		{
			this.setState({investors: undefined});
			this.getInvestors();
		}
		this.setState({ mainView: mainViewKeyword });
	},
	onModalViewChange: function (modalViewKeyword) {
		this.setState({ modalView: modalViewKeyword });
	},
	render: function () {
		var view;
		switch(this.state.mainView) {
			case 'ADD':
				view = 	<InvestAddView
							modalViewChange={this.onModalViewChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'DETAILS':
				view = 	<InvestDetailView 
							selectedInvestorId={this.state.selectedInvestorId}
							modalViewChange={this.onModalViewChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'DEPOSIT':
				view = 	<InvestDepositForm 
							selectedInvestorId={this.state.selectedInvestorId}
							modalViewChange={this.onModalViewChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'WITHDRAW':
				view = 	<InvestWithdrawForm 
							selectedInvestorId={this.state.selectedInvestorId}
							modalViewChange={this.onModalViewChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			default: 
				view = 	<InvestTableView
							investors = {this.state.investors}
							investorSelect={this.onInvestorSelect}
							mainViewChange={this.onMainViewChange}/>;
				break;
		}
		return (
			<div className="row">
				{ view }
				<InvestMessageContainerModal modalView={this.state.modalView}/>
			</div>
		);
	}
});

/*=====  End of Invest Main  ======*/

if(typeof $("#invest-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<InvestMain />,
	document.getElementById('invest-app-node'));
}