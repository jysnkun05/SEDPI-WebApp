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
				investor.country = investor.country !== null ? investor.country : 'Not Set';
				investor.member_since = moment.tz(investor.member_since, moment.tz.guess()).format('DD MMM YYYY');
				investor.balance = accounting.formatMoney(investor.balance, "PhP ");
				return 	<tr key={index} className="text-center clickable-row" onClick={this.props.investorSelect.bind(null, investor.id)}>
							<td>{index + 1}</td>
							<td>{investor.fullName}</td>
							<td>{investor.country}</td>
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
			country: '',
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
			country: this.state.country,
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
										<label>Country</label>
										<select className="form-control" value={this.state.country} onChange={this.handleChange.bind(null, 'country')} disabled={this.state.countries === undefined}>
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
			profileRetries: 0,
			investmentRetries: 0,
			retries: 0
		};
	},
	componentWillMount: function () {
		this.getInvestorProfile(this.props.selectedInvestorId, this.state.profileRetries);
		this.getInvestorInvestments(this.props.selectedInvestorId, this.state.investmentRetries);
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
				if(response.status === 'success')
					this.props.modalViewChange('EMAIL-SENT');	
				else if(response.status === 'validated')
					this.props.modalViewChange('EMAIL-VALIDATED');
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
	getInvestorProfile: function (id, profileRetries) {
		this.setState({profileRetries: profileRetries + 1});
		$.ajax({
			url: '/api/investment/getInvestorProfile',
			type: 'POST',
			data: {id: id},
			dataType: 'json',
			cache: false,
			success: function (profileData) {
				this.setState({
					profileData: profileData,
					profileRetries: 0
				});
			}.bind(this),
			error: function () {
				if(profileRetries <= 3)
					this.getInvestorProfile(id ,profileRetries);
			}.bind(this)	
		});
	},
	getInvestorInvestments: function (id, investmentRetries) {
		this.setState({investmentRetries: investmentRetries + 1});
		$.ajax({
			url: '/api/investment/getInvestorInvestments',
			type: 'POST',
			data: {id: id},
			dataType: 'json',
			cache: false,
			success: function (investmentData) {
				this.setState({
					investmentData: investmentData,
					investmentRetries: 0
				});
			}.bind(this),
			error: function () {
				if(investmentRetries <= 3)
					this.getInvestorInvestments(id ,investmentRetries);
			}.bind(this)	
		});
	},
	onProfileDataChange: function () {
		this.getInvestorProfile(this.props.selectedInvestorId, this.state.profileRetries);
	},
	onInvestmentDataChange: function () {
		this.getInvestorInvestments(this.props.selectedInvestorId, this.state.investmentRetries);
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
						profileDataChange={this.onProfileDataChange}
						modalViewChange={this.props.modalViewChange}
						mainViewChange={this.props.mainViewChange}
						sendEmailVerification={this.sendEmailVerification}/>;
		}
		else if(this.state.detailView === 'INVESTMENT')
		{
			view =	<InvestInvestmentsDetails
						selectedInvestorId={this.props.selectedInvestorId}
						investmentData={this.state.investmentData}
						investmentDataChange={this.onInvestmentDataChange}
						modalViewChange={this.props.modalViewChange}
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
	getInitialState: function () {
		return {
			investmentView: undefined,
			selectedTransactionId: undefined
		};
	},
	onInvestmentViewChange: function (investmentViewKeyword) {
		this.setState({investmentView: investmentViewKeyword});
	},
	onTransactionSelect: function (id) {
		this.setState({
			selectedTransactionId: id,
			investmentView: 'DETAILS'
		});
	},
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
			switch(this.state.investmentView) {
				case 'TRANSACTION':
					investmentView = 	<InvestTransactionForm
											selectedInvestorId={this.props.selectedInvestorId}
											investmentDataChange={this.props.investmentDataChange}
											investmentViewChange={this.onInvestmentViewChange}
											modalViewChange={this.props.modalViewChange}/>;
					break;

				case 'DETAILS':
					investmentView =	<InvestTransactionDetails 
											selectedTransactionId={this.state.selectedTransactionId}
											modalViewChange={this.props.modalViewChange}
											investmentDataChange={this.props.investmentDataChange}
											investmentViewChange={this.onInvestmentViewChange}/>;
					break;

				default:
					investmentView = 	<InvestAccountDetails 
											investmentData={this.props.investmentData}
											investmentViewChange={this.onInvestmentViewChange}
											transactionSelect={this.onTransactionSelect}
											mainViewChange={this.props.mainViewChange}/>;
					break;
			}
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
				account.transactionDate = moment(account.transactionDate).format('DD MMM YYYY');
				account.amount = accounting.formatNumber(account.amount, 2);
				account.runningBalance = accounting.formatNumber(account.runningBalance, 2);
				return 	<tr key={index} className="clickable-row" onClick={this.props.transactionSelect.bind(null, account.id)}>
							<td className="text-center">{account.transactionDate}</td>
							<td className="text-center">{account.transaction_type_id}</td>
							<td className="text-right">{account.transaction_type.account_type === 'DR' ? account.amount : null}</td>
							<td className="text-right">{account.transaction_type.account_type === 'CR' ? account.amount : null}</td>
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
							<button type="button" className="btn btn-link btn-xs" onClick={this.props.investmentViewChange.bind(null, 'TRANSACTION')}>Add New Transaction</button>
						</div>
					</div>
				</div>
				<div className="panel-body">
					<table className="table table-condensed table-striped table-bordered">
						<thead>
							<tr>
								<th className="text-center">Date</th>
								<th className="text-center">TC</th>
								<th className="text-center">Debit</th>
								<th className="text-center">Credit</th>
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

/*----------  Invest Transaction Form  ----------*/

var InvestTransactionForm = React.createClass({
	getInitialState: function () {
		return {
			transactionTypes: undefined,
			transactionDate: moment().format('MM/DD/YYYY'),
			amount: '0.00',
			transaction_type_id: '',
			notes: ''
		};
	},
	componentWillMount: function () {
		this.getTransactionTypes();
	},
	componentDidMount: function () {
		var self = this;
		$("#datepicker-transactionDate").datepicker({
			autoclose: true
		}).on('changeDate', function(e){
			self.setState({transactionDate: moment(e.date).format('MM/DD/YYYY')});
		});
	},
	getTransactionTypes: function () {
		$.ajax({
			url: '/api/transaction/getTransactionTypes',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (types) {
				this.setState({transactionTypes: types});
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

		this.props.modalViewChange('TRANSACTION-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.selectedInvestorId,
			transactionDate: this.state.transactionDate,
			amount: accounting.unformat(this.state.amount),
			transaction_type_id: this.state.transaction_type_id,
			notes: this.state.notes
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/transaction/saveTransaction',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.modalViewChange('TRANSACTION-SUCCESS');
				this.props.investmentDataChange();
				this.props.investmentViewChange(undefined);
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
					this.props.modalViewChange('TRANSACTION-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	amountBlurred: function () {
		this.setState({amount: accounting.formatNumber(this.state.amount, 2)});
	},
	amountFocused: function () {
		this.setState({amount: accounting.unformat(this.state.amount)});
	},
	render: function () {
		var transactionTypeOptions;
		if(this.state.transactionTypes !== undefined)
		{
			transactionTypeOptions = this.state.transactionTypes.map (function (type, index) {
				return <option key={index} value={type.id}>{type.description}</option>;
			}.bind(this));
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Add New Transaction
				</div>
				<div className="panel-body">
					<div className="row">
						<div className="col-md-6 col-md-offset-3">
							<form onSubmit={this.handleSubmit}>
								<div className="form-group" id="fg-transactionDate">
									<label className="control-label" htmlFor="input-transactionDate">Transaction Date</label>
									<div className="input-group date" id="datepicker-transactionDate">
										<input
											type="text"
											className="form-control"
											id="input-transactionDate"
											value={this.state.transactionDate}
											onChange={this.handleChange.bind(null, 'transactionDate')}/>
										<span className="input-group-addon">
											<span className="glyphicon glyphicon-calendar"></span>
										</span>
									</div>
								</div>
								<div className="form-group" id="fg-amount">
									<label className="control-label" htmlFor="input-amount">Amount</label>
									<div className="input-group">
										<span className="input-group-addon">
											<span>Php</span>
										</span>
										<input
											type="text"
											className="form-control text-right"
											id="input-amount"
											value={this.state.amount}
											onFocus={this.amountFocused}
											onBlur={this.amountBlurred}
											onChange={this.handleChange.bind(null, 'amount')}/>
									</div>
								</div>
								<div className="form-group"  id="fg-transaction_type_id">
									<label className="control-label" htmlFor="input-transaction_type_id">Transaction Type</label>
									<select
										className="form-control"
										id="input-transaction_type_id"
										value={this.state.transaction_type_id}
										disabled={this.state.transactionTypes === undefined}
										onChange={this.handleChange.bind(null, 'transaction_type_id')}>
											<option value="" disabled={true}>Please select...</option>
											{ transactionTypeOptions }
									</select>
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
											<button type="button" className="btn btn-default" onClick={this.props.investmentViewChange.bind(null, undefined)}>Cancel</button>
											<button type="submit" className="btn btn-primary">Save Transaction</button>
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

/*----------  Invest View Transaction Details  ----------*/

var InvestTransactionDetails = React.createClass({
	getInitialState: function () {
		return {
			transactionTypes: undefined,
			transactionDetails: undefined,
			transactionDate: moment().format('MM/DD/YYYY'),
			amount: '0.00',
			transaction_type_id: '',
			notes: '',
			editMode: false 

		};
	},
	componentWillMount: function () {
		this.getTransactionDetails();
		this.getTransactionTypes();
	},
	getTransactionDetails: function () {
		$.ajax({
			url: '/api/transaction/getTransactionDetails',
			type: 'POST',
			data: {id: this.props.selectedTransactionId},
			dataType: 'json',
			cache: false,
			success: function (transaction) {
				this.setState({
					transactionDetails: transaction,
					transactionDate: moment(transaction.transactionDate).format("MM/DD/YYYY"),
					amount: accounting.formatNumber(transaction.amount, 2),
					transaction_type_id: transaction.transaction_type_id,
					notes: transaction.notes
				});
			}.bind(this)
		});
	},
	getTransactionTypes: function () {
		$.ajax({
			url: '/api/transaction/getTransactionTypes',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (types) {
				this.setState({transactionTypes: types});
			}.bind(this)
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);

		var transactionDetails = this.state.transactionDetails;

		if(this.state.transactionDate == transactionDetails.transactionDate && 
			this.state.amount == transactionDetails.amount && 
			this.state.transaction_type_id == transactionDetails.transaction_type_id &&
			this.state.notes == transactionDetails.notes)
				this.setState({editMode: false});
		else
			this.setState({editMode: true});
	},
	handleSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange('UPDATE-TRANSACTION-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.selectedTransactionId,
			transactionDate: this.state.transactionDate,
			amount: accounting.unformat(this.state.amount),
			transaction_type_id: this.state.transaction_type_id,
			notes: this.state.notes
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: 'api/transaction/updateTransaction',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.modalViewChange('UPDATE-TRANSACTION-SUCCESS');
				this.props.investmentDataChange();
				this.props.investmentViewChange(undefined);
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
					this.props.modalViewChange('UPDATE-TRANSACTION-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	amountBlurred: function () {
		this.setState({amount: accounting.formatNumber(this.state.amount, 2)});
	},
	amountFocused: function () {
		this.setState({amount: accounting.unformat(this.state.amount)});
	},
	render: function () {
		var transactionTypeOptions;
		if(this.state.transactionTypes !== undefined)
		{
			transactionTypeOptions = this.state.transactionTypes.map (function (type, index) {
				return <option key={index} value={type.id}>{type.description}</option>;
			}.bind(this));
		}
		var view;
		if(this.state.transactionDetails === undefined) {
			view = 	<div className="panel panel-default">
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
			view = 	<div className="row">
						<div className="col-md-6 col-md-offset-3">
							<form onSubmit={this.handleSubmit}>
								<div className="form-group" id="fg-transactionDate">
									<label className="control-label" htmlFor="input-transactionDate">Transaction Date</label>
									<div className="input-group date" id="datepicker-transactionDate">
										<input
											type="text"
											className="form-control"
											id="input-transactionDate"
											value={this.state.transactionDate}
											onChange={this.handleChange.bind(null, 'transactionDate')}/>
										<span className="input-group-addon">
											<span className="glyphicon glyphicon-calendar"></span>
										</span>
									</div>
								</div>
								<div className="form-group" id="fg-amount">
									<label className="control-label" htmlFor="input-amount">Amount</label>
									<div className="input-group">
										<span className="input-group-addon">
											<span>Php</span>
										</span>
										<input
											type="text"
											className="form-control text-right"
											id="input-amount"
											value={this.state.amount}
											onFocus={this.amountFocused}
											onBlur={this.amountBlurred}
											onChange={this.handleChange.bind(null, 'amount')}/>
									</div>
								</div>
								<div className="form-group"  id="fg-transaction_type_id">
									<label className="control-label" htmlFor="input-transaction_type_id">Transaction Type</label>
									<select
										className="form-control"
										id="input-transaction_type_id"
										value={this.state.transaction_type_id}
										disabled={this.state.transactionTypes === undefined}
										onChange={this.handleChange.bind(null, 'transaction_type_id')}>
											<option value="" disabled={true}>Please select...</option>
											{ transactionTypeOptions }
									</select>
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
											<button type="button" className="btn btn-default" onClick={this.props.investmentViewChange.bind(null, undefined)}>Cancel</button>
											<button 
												type="submit" 
												className="btn btn-primary" 
												disabled={!this.state.editMode}>
													Update Transaction
												</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Transaction Details
					<div className="pull-right">
						<button className="btn btn-link btn-xs">Edit Details</button>
					</div>
				</div>
				<div className="panel-body">
					{ view }
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
	getInitialState: function () {
		return {
			profileView: undefined
		};
	},
	onProfileViewChange: function (profileViewKeyword) {
		this.setState({profileView: profileViewKeyword});
	},
	render: function () {
		var view;
		if(this.props.profileData === undefined) 
		{
			view = 	<div className="panel panel-default">
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
			switch(this.state.profileView) {
				case 'PROFILE-MANAGE':
					view = 	<ManageProfileUserCredentials
								profileData={this.props.profileData}
								profileDataChange={this.props.profileDataChange}
								modalViewChange={this.props.modalViewChange}
								profileViewChange={this.onProfileViewChange}/>;
					break; 

				default:
					view = 	<ProfileUserCredentials 
								profileData={this.props.profileData}
								profileViewChange={this.onProfileViewChange}
								sendEmailVerification={this.props.sendEmailVerification}/>;
					break;
			}
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
							{ view }
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
						<button type="button" className="btn btn-link btn-xs" onClick={this.props.profileViewChange.bind(null, 'PROFILE-MANAGE')}>Manage User Credentials</button>
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

/*----------  Manage Profile User Credentials  ----------*/

var ManageProfileUserCredentials = React.createClass({
	getInitialState: function () {
		return {
			email: '',
			username: '',
			password: '',
			confirmPassword: '' 
		};
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	handleSubmitEmail: function (e) {
		e.preventDefault();
		
		this.props.modalViewChange('CHANGE-EMAIL-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.profileData.user.id,
			email: this.state.email.trim()
		};

		this.setState({
			email: postData.email
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investment/updateEmailAddress',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if(response.status === 'success')
				{
					this.props.profileDataChange();
					this.props.modalViewChange('CHANGE-EMAIL-SAVED');
					this.setState({
						email: '',
						username: '',
						password: '',
						confirmPassword: '' 
					});
				}
				else if(response.status === 'unchanged')
				{
					this.props.modalViewChange('CHANGE-EMAIL-UNCHANGED');
				}	
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
					this.props.modalViewChange('CHANGE-EMAIL-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	handleSubmitUsername: function (e) {
		e.preventDefault();
		
		this.props.modalViewChange('CHANGE-USERNAME-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.profileData.user.id,
			username: this.state.username.trim()
		};

		this.setState({
			username: postData.username
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investment/updateUsername',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if(response.status === 'success')
				{
					this.props.profileDataChange();
					this.props.modalViewChange('CHANGE-USERNAME-SAVED');
					this.setState({
						email: '',
						username: '',
						password: '',
						confirmPassword: '' 
					});
				}
				else if(response.status === 'unchanged')
				{
					this.props.modalViewChange('CHANGE-USERNAME-UNCHANGED');
				}	
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
					this.props.modalViewChange('CHANGE-USERNAME-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	handleSubmitPassword: function (e) {
		e.preventDefault();
		
		this.props.modalViewChange('CHANGE-PASSWORD-SAVING');
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.profileData.user.id,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investment/updatePassword',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if(response.status === 'success')
				{
					this.props.profileDataChange();
					this.props.modalViewChange('CHANGE-PASSWORD-SAVED');
					this.setState({
						email: '',
						username: '',
						password: '',
						confirmPassword: '' 
					});
				}
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
					this.props.modalViewChange('CHANGE-PASSWORD-ERROR');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}
			}.bind(this)
		});
	},
	render: function () {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Manage User Credentials
					<div className="pull-right">
						<button type="button" className="close" onClick={this.props.profileViewChange.bind(null, undefined)}>&times;</button>
					</div>
				</div>
				<div className="panel-body">
					<div className="page-header">
						<h2>Edit E-mail Address</h2>
					</div>
					<div className="row">
						<div className="col-md-6">
							<form onSubmit={this.handleSubmitEmail}>
								<div className="form-group" id="fg-email">
									<label className="control-label" htmlFor="input-email">New Email Address</label>
									<input 
										type="text"
										className="form-control"
										id="input-email"
										value={this.state.email}
										placeholder={this.props.profileData.user.email}
										onChange={this.handleChange.bind(null, 'email')}/>
								</div>
								<div className="form-group">
									<button type="submit" className="btn btn-primary">Update Email Address</button>
								</div>
							</form>
						</div>
					</div>
					<div className="page-header">
						<h2>Edit Username</h2>
					</div>
					<div className="row">
						<div className="col-md-6">
							<form onSubmit={this.handleSubmitUsername}>
								<div className="form-group" id="fg-username">
									<label className="control-label" htmlFor="input-username">New Username</label>
									<input 
										type="text"
										className="form-control"
										id="input-username"
										value={this.state.username}
										placeholder={this.props.profileData.user.username === null ? 'Username not set.' : this.props.profileData.user.username === null }
										onChange={this.handleChange.bind(null, 'username')}/>
								</div>
								<div className="form-group">
									<button type="submit" className="btn btn-primary">Update Username</button>
								</div>
							</form>
						</div>
					</div>
					<div className="page-header">
						<h2>Edit Password</h2>
					</div>
					<div className="row">
						<div className="col-md-6">
							<form onSubmit={this.handleSubmitPassword}>
								<div className="form-group" id="fg-password">
									<label className="control-label" htmlFor="input-password">New Password</label>
									<input 
										type="password"
										className="form-control"
										id="input-password"
										value={this.state.password}
										onChange={this.handleChange.bind(null, 'password')}/>
								</div>
								<div className="form-group" id="fg-confirmPassword">
									<label className="control-label" htmlFor="input-confirmPassword">Confirm New Password</label>
									<input 
										type="password"
										className="form-control"
										id="input-confirmPassword"
										value={this.state.confirmPassword}
										onChange={this.handleChange.bind(null, 'confirmPassword')}/>
								</div>
								<div className="form-group">
									<button type="submit" className="btn btn-primary">Update Password</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Invest Profile Details  ======*/

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

			case 'EMAIL-VALIDATED':
				modalMessageComponent = <div className="panel-custom-info">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Email already verified.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'TRANSACTION-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Saving Transaction
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

			case 'TRANSACTION-SUCCESS':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> New Transaction Saved.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'UPDATE-TRANSACTION-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Transaction not Saved. Please try again.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'UPDATE-TRANSACTION-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Updating Transaction
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

			case 'UPDATE-TRANSACTION-SUCCESS':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Transaction Updated.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'TRANSACTION-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Transaction not Updated. Please try again.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'CHANGE-EMAIL-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Updating Email Address
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

			case 'CHANGE-EMAIL-SAVED':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Email Address Updated.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'CHANGE-EMAIL-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Updating Email Failed. Please try again.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'CHANGE-EMAIL-UNCHANGED':
				modalMessageComponent = <div className="panel-custom-info">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Email not changed.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'CHANGE-USERNAME-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Updating Username
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

			case 'CHANGE-USERNAME-SAVED':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Username Updated.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'CHANGE-USERNAME-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Updating Username Failed. Please try again.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'CHANGE-USERNAME-UNCHANGED':
				modalMessageComponent = <div className="panel-custom-info">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Username not changed.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'CHANGE-PASSWORD-SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Updating Password
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

			case 'CHANGE-PASSWORD-SAVED':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Password Updated.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

			case 'CHANGE-PASSWORD-ERROR':
				modalMessageComponent = <div className="panel-custom-error">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> Updating Password Failed. Please try again.
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