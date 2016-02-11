/*=======================================
=            View Components            =
=======================================*/

/*----------  Investor List View  ----------*/

var InvestorTableListView = React.createClass({
	render: function () {
		var accountList;
		if(this.props.accounts === undefined)
		{
			accountList = 	<tr className="text-center">
								<td colSpan="4"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Loading Accounts.</td>
							</tr>;
		}
		else if(this.props.accounts === 'retrying')
		{
			accountList = 	<tr className="text-center">
								<td colSpan="4"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retying to load accounts. Please wait.</td>
							</tr>;
		}
		else if(this.props.accounts == 'error')
		{
			accountList = 	<tr className="text-center">
								<td colSpan="4"><i className="fa fa-exclamation-triangle fa-fw"></i> {"Unable to load accounts."} <button type="button" className="btn btn-link btn-xs" onClick={this.props.retryGetAllAccounts}>Retry</button></td>
							</tr>;
		}
		else if(this.props.accounts.length > 0)
		{
			accountList = this.props.accounts.map(function (account, index) {

				return 	<tr className="text-center clickable-row" key={index} onClick={this.props.viewAccountDetails.bind(null, account.id)}>
							<td>{index + 1}</td>
							<td>{account.name}</td>
							<td>{account.type === "joint" ? "Joint Account" : "Individual Account"}</td>
							<td>{accounting.formatMoney(account.balance, "Php ", 2)}</td>
						</tr>;
			}.bind(this));
		}
		else {
			accountList = 	<tr className="text-center">
								<td colSpan="4"><i className="fa fa-info-circle fa-fw"></i> No Accounts Created.</td>
							</tr>;
		}
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-heading">
						Investor Account List
						<div className="pull-right">
							<button type="button" className="btn btn-primary btn-xs" onClick={this.props.mainViewChange.bind(null, 'CREATE-ACCOUNT')}>Create Account</button>
						</div>
					</div>
					<div className="panel-body">
						<div className="row">
							<div className="col-md-12">
								<table className="table table-bordered table-striped table-condensed">
									<thead>
										<tr>
											<th className="text-center">#</th>
											<th className="text-center">Account Name</th>
											<th className="text-center">Account Type</th>
											<th className="text-center">Balance</th>
										</tr>
									</thead>
									<tbody>
										{accountList}
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

/*----------  Create Investor Account  ----------*/

var CreateInvestorAccount = React.createClass({
	getInitialState: function () {
		return {
			//account fields,
			accountName: '',
			accountType: 'individual',
			coInvestors: [],
			//investor fields
			firstName: '',
			middleName: '',
			lastName: '',
			email: '',
			//co investor fields
			coFirstName: '',
			coMiddleName: '',
			coLastName: '',
			//others
			selectedCoInvestorIndex: undefined,
 		};
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_saveInvestorSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating Account and Investor Data'
		});
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';
		
		var postData = {
			accountName: this.state.accountName.trim() === '' ? this.state.firstName + " " + this.state.lastName : this.state.accountName.trim(),
			accountType: this.state.accountType,
			coInvestors: this.state.coInvestors,
			firstName: this.state.firstName.trim(),
			middleName: this.state.middleName.trim(),
			lastName: this.state.lastName.trim()
		};

		this.setState({
			accountName: postData.accountName,
			firstName: postData.firstName,
			middleName: postData.middleName,
			lastName: postData.lastName
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investor/addAccount',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.accountsChange();
				this.props.modalViewChange({
					type: 'SUCCESS-MODAL',
					message: response.message
				});
				this.props.mainViewChange('LIST');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (xhr, status, error) {
				if(xhr.status === 422)
				{
					$("#InvestMessageContainerModal").modal('hide');
					$.each(xhr.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});	
				}
			}.bind(this)
		});
	},
	_addCoInvestorSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating Co Investor'
		});
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			coFirstName: this.state.coFirstName.trim(),
			coMiddleName: this.state.coMiddleName.trim(),
			coLastName: this.state.coLastName.trim()
		};

		this.setState({
			coFirstName: postData.coFirstName,
			coMiddleName: postData.coMiddleName,
			coLastName: postData.coLastName	
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/investor/addCoInvestor',
			type: 'POST',
			data: postData,
			success: function (response) {
				$("#InvestMessageContainerModal").modal('hide');
				var coInvestors = this.state.coInvestors;
				
				if(this.state.selectedCoInvestorIndex === undefined)
					coInvestors.push(postData);
				else
					coInvestors.splice(this.state.selectedCoInvestorIndex, 1, postData);

				this.setState({
					coInvestors: coInvestors,
					coFirstName: '',
					coMiddleName: '',
					coLastName: '',
					selectedCoInvestorIndex: undefined
				});

			}.bind(this),
			error: function (xhr, status, error) {
				$("#InvestMessageContainerModal").modal('hide');
				if(xhr.status === 422)
				{
					$.each(xhr.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});	
				}
			}.bind(this)
		});
	},
	_removeCoInvestor: function (targetIndex) {
		var coInvestors = this.state.coInvestors;
		coInvestors.splice(targetIndex, 1);
		//console.log(coInvestors);
		this.setState({coInvestors: coInvestors});
	},
	_editCoInvestor: function (targetIndex) {
		var coInvestor = this.state.coInvestors[targetIndex];
		//console.log(coInvestor);
		this.setState({
			coFirstName: coInvestor.coFirstName,
			coMiddleName: coInvestor.coMiddleName,
			coLastName: coInvestor.coLastName,
			selectedCoInvestorIndex: targetIndex
		});
	},
	_clearSelectedCoInvestor: function () {
		this.setState({
			coFirstName: '',
			coMiddleName: '',
			coLastName: '',
			selectedCoInvestorIndex: undefined
		});
	},
	render: function () {
		var coInvestorList = 	<tr className="text-center">
									<td colSpan="3"><i className="fa fa-info-circle fa-fw"></i> No Co Investor Listed</td>
								</tr>;

		if(this.state.coInvestors.length > 0) {
			coInvestorList = this.state.coInvestors.map(function (coInvestor, index) {
				return 	<tr className={this.state.selectedCoInvestorIndex === index ? "text-center selected-row" : "text-center"} key={index}>
							<td>{index + 1}</td>
							<td>{coInvestor.coMiddleName !== "" ? coInvestor.coFirstName + " " + coInvestor.coMiddleName + " " + coInvestor.coLastName : coInvestor.coFirstName + " " + coInvestor.coLastName} </td>
							<td>
								{this.state.selectedCoInvestorIndex !== index ?
									<div className="btn-group">
										<button type="button" className="btn btn-link btn-xs" onClick={this._editCoInvestor.bind(null, index)}>Edit</button>
										<button type="button" className="btn btn-link btn-xs red-bg" onClick={this._removeCoInvestor.bind(null, index)}>Remove</button>
									</div>
									: <button type="button" className="btn btn-link btn-xs white-bg" onClick={this._clearSelectedCoInvestor}>Cancel</button> }
							</td>
						</tr>;
			}.bind(this));
		}

		var coInvestorsForm =	<div className="col-md-12">
									<form onSubmit={this._addCoInvestorSubmit}>
									<fieldset>
										<legend>Co Investor Details</legend>
										<div className="form-group">
											<table className="table table-bordered table-striped table-condensed">
												<thead>
													<tr>
														<th className="text-center">#</th>
														<th className="text-center">Co Investor Name</th>
														<th></th>
													</tr>
												</thead>
												<tbody>
													{ coInvestorList }
												</tbody>
											</table>
										</div>
										<div className="form-group">
											<label className="control-label" htmlFor="input-coFirstName input-coLastName">Co Investor Name *</label>
											<div className="form-group" id="fg-coFirstName">
												<input
													type="text"
													className="form-control"
													id="input-coFirstName"
													value={this.state.coFirstName}
													onChange={this._handleChange.bind(null, 'coFirstName')}
													placeholder="First Name *"/>
											</div>
											<div className="form-group" id="fg-coMiddleName">
												<input
													type="text"
													className="form-control"
													id="input-coMiddleName"
													value={this.state.coMiddleName}
													onChange={this._handleChange.bind(null, 'coMiddleName')}
													placeholder="Middle Name"/>
											</div>
											<div className="form-group" id="fg-coLastName">
												<input
													type="text"
													className="form-control"
													id="input-coLastName"
													value={this.state.coLastName}
													onChange={this._handleChange.bind(null, 'coLastName')}
													placeholder="Last Name *"/>
											</div>
											<div className="form-group">
												<div className="pull-right">
													<button type="submit" className="btn btn-primary">{this.state.selectedCoInvestorIndex === undefined ? "Add Co Investor" : "Edit Co Investor"}</button> 
												</div>
											</div>
										</div>
									</fieldset>
									</form>
								</div>;
		return (
			<div className="col-md-6 col-md-offset-3">
				<div className="panel panel-default">
					<div className="panel-heading">
						<button type="button" className="btn btn-link btn-xs" onClick={this.props.mainViewChange.bind(null, 'LIST')}><i className="fa fa-chevron-left"></i></button>
						Create Investor Account
						<div className="pull-right">
							<button type="submit" className="btn btn-primary btn-xs" onClick={this._saveInvestorSubmit}>Save Account</button>
						</div>
					</div>
					<div className="panel-body">
						<div className="row">
							<form onSubmit={this._saveInvestorSubmit}>
							<div className="col-md-12">
								<fieldset>
									<legend>Account Details</legend>
									<div className="form-group" id="fg-accountName">
										<label className="control-label" htmlFor="input-accountName">Account Name *</label>
										<input
											type="text"
											id="input-accountName"
											value={this.state.accountName}
											onChange={this._handleChange.bind(null, 'accountName')}
											className="form-control"/>
									</div>
									<div className="form-group">
										<label>Account Type *</label>
										<select
											className="form-control"
											value={this.state.accountType}
											onChange={this._handleChange.bind(null, 'accountType')}>
											<option value="individual">Individual Account</option>
											<option value="joint">Joint Account</option>
										</select>
									</div> 
								</fieldset>
							</div>
							<div className="col-md-12">
								<fieldset>
									<legend>Investor Details</legend>
									<div className="form-group">
										<label coLastName="control-label" htmlFor="input-firstName input-lastName">Full Name *</label>
										<div className="form-group" id="fg-firstName">
											<input
												type="text"
												className="form-control"
												id="input-firstName"
												value={this.state.firstName}
												onChange={this._handleChange.bind(null, 'firstName')}
												placeholder="First Name *"/>
										</div>
										<div className="form-group" id="fg-middleName">
											<input
												type="text"
												className="form-control"
												id="input-middleName"
												value={this.state.middleName}
												onChange={this._handleChange.bind(null, 'middleName')}
												placeholder="Middle Name"/>
										</div>
										<div className="form-group" id="fg-lastName">
											<input 
												type="text"
												className="form-control"
												id="input-lastName"
												value={this.state.lastName}
												onChange={this._handleChange.bind(null, 'lastName')}
												placeholder="Last Name *"/>
										</div>
									</div>
									<div className="form-group" id="fg-email">
										<label className="control-label" htmlFor="input-email">E-mail Address</label>
										<input 
											type="text"
											className="form-control"
											id="input-email"
											value={this.state.email}
											onChange={this._handleChange.bind(null, 'email')}
											placeholder="someone@company.com"/>
									</div>
								</fieldset>
							</div>
							<button type="submit" className="hide">hide</button> 
							</form>
							{ this.state.accountType === 'joint' ? coInvestorsForm : null }
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  View Investor Account  ----------*/

var ViewInvestorAccount = React.createClass({
	getInitialState: function () {
		return {
			accountView: 'ACCOUNT-DETAILS'
		};
	},
	_onAccountViewChange: function (accountView) {
		this.setState ({accountView: accountView});
	},
	render: function () {
		var accountView;
		switch(this.state.accountView) {
			case 'ACCOUNT-DETAILS':
				accountView = <AccountDetails 
									account={this.props.account}
									getAllAccounts={this.props.getAllAccounts}
									getAccountDetails={this.props.getAccountDetails}
									retryGetAccountDetails={this.props.retryGetAccountDetails}
									mainViewChange={this.props.mainViewChange}/>;
				break;

			case 'INVESTMENT-DETAILS':
				accountView = <InvestmentDetails
									account={this.props.account}
									retryGetAccountDetails={this.props.retryGetAccountDetails}
									modalFormChange={this.props.modalFormChange}
									modalViewChange={this.props.modalViewChange}
									mainViewChange={this.props.mainViewChange}/>;
				break;

			case 'INVESTORS-DETAILS':
				accountView = <InvestorsDetails
									account={this.props.account}
									retryGetAccountDetails={this.props.retryGetAccountDetails}
									mainViewChange={this.props.mainViewChange}/>;
				break;
		}
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="row">
					<div className="col-md-3">
						<div className="panel panel-default">
							<div className="panel-body">
								<div className="form-group">
									<div className="list-group">
										<button 
											type="button" 
											className={this.state.accountView === 'ACCOUNT-DETAILS' ? "list-group-item btn-xs active" : "list-group-item btn-xs"}
											onClick={this._onAccountViewChange.bind(null, 'ACCOUNT-DETAILS')}>
												<i className="fa fa-user fa-fw"></i> Account
										</button>
										<button 
											type="button" 
											className={this.state.accountView === 'INVESTMENT-DETAILS' ? "list-group-item btn-xs active" : "list-group-item btn-xs"}
											onClick={this._onAccountViewChange.bind(null, 'INVESTMENT-DETAILS')}>
												<i className="fa fa-money fa-fw"></i> Investment
										</button>
										<button 
											type="button" 
											className={this.state.accountView === 'INVESTORS-DETAILS' ? "list-group-item btn-xs active" : "list-group-item btn-xs"}>
												<i className="fa fa-users fa-fw"></i> Investors <small>coming soon</small>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-9">
						{accountView}
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of View Components  ======*/

/*===============================================
=            View Details Components            =
===============================================*/

/*----------  Account Details  ----------*/

var AccountDetails = React.createClass({
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
		else if (this.props.account == 'error')
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
			account = this.props.account;
			user = this.props.account.user;
			investors = this.props.account.investors;
			investorList = investors.map( function (investor, index) {
				var fullName = investor.middleName ? null === investor.firstName + " " + investor.middleName + " " + investor.lastName : investor.firstName + " " + investor.lastName;
				return <p key={index}>{fullName} {investor.isOwner ? <i className="fa fa-user fa-fw blue-bg"></i> : null }</p>;
			});
			detailView = 	<table className="table table-condensed table-striped table-hover">
								<tbody>
									<AccountNameComponent 
										account={account} 
										getAllAccounts={this.props.getAllAccounts}
										getAccountDetails={this.props.getAccountDetails}/>
									<AccountTypeComponent 
										account={account} 
										getAllAccounts={this.props.getAllAccounts}
										getAccountDetails={this.props.getAccountDetails}/>
									<UsernameComponent 
										account={account}
										user={user} 
										getAllAccounts={this.props.getAllAccounts}
										getAccountDetails={this.props.getAccountDetails}/>
									<PasswordComponent 
										account={account}
										user={user} 
										getAllAccounts={this.props.getAllAccounts}
										getAccountDetails={this.props.getAccountDetails}/>
									<UserActiveComponent 
										account={account}
										user={user} 
										getAllAccounts={this.props.getAllAccounts}
										getAccountDetails={this.props.getAccountDetails}/>
									
									<tr>
										<td className="table-title-col">Investor(s)</td>
										<td>
											{investorList}
										</td>
										<td className="text-right"><button className="btn btn-link btn-xs">Edit</button></td>
									</tr>
								</tbody>
							</table>;
		} 
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div className="page-header">
						<div className="pull-right">
							<button type="button" className="btn btn-link btn-xs" onClick={this.props.mainViewChange.bind(null, 'LIST')}>Back to Investor Account List</button>
						</div>
						<h2>Account Details</h2>
					</div>
					<div className="row">
						<div className="col-md-12">
							{detailView}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Investment Details  ----------*/

var InvestmentDetails = React.createClass({
	_onShowAddTransactionForm: function () {
		this.props.modalFormChange('ADD-TRANSACTION');
		$("#InvestFormContainerModal").modal();
	},
	_onShowEditTransactionForm: function (id) {
		this.props.modalFormChange('EDIT-TRANSACTION', id);
		$("#InvestFormContainerModal").modal();
	},
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
		else if(this.props.accounts === 'retrying')
		{
			detailView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retying to load investment details. Please wait.
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else if (this.props.account == 'error')
		{
			detailView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-exclamation-triangle fa-fw"></i> {"Unable to load investment details."} <button className="btn btn-link btn-xs" onClick={this.props.retryGetAccountDetails}>Retry</button>
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else {
			var account = this.props.account;
			var transactions = account.transactions;
			var transactionList;
			if(transactions.length > 0)
			{
				transactionList = transactions.map( function (transaction, index) {
					var amount = accounting.formatNumber(transaction.amount, 2);
					var runningBalance = accounting.formatNumber(transaction.runningBalance, 2);
					if(transactions.length - 1 === index)
						runningBalance = <strong>{accounting.formatNumber(transaction.runningBalance, 2)}</strong>;
					return 	<tr key={index} className="clickable-row" onClick={this._onShowEditTransactionForm.bind(null, transaction.id)}>
								<td className="text-center">{moment(transaction.transactionDate).format('DD MMM YYYY')}</td>
								<td className="text-center">{transaction.transaction_type.code}</td>
								<td className="text-right red-bg">{transaction.transaction_type.account_type === "DR" ? amount : null}</td>
								<td className="text-right">{transaction.transaction_type.account_type === "CR" ? amount : null}</td>
								<td className="text-right">{runningBalance}</td>
							</tr>;
				}.bind(this));
			}
			else
			{
				transactionList = 	<tr className="text-center">
										<td colSpan="5"><i className="fa fa-info-circle fa-fw"></i> No Transaction Posted.</td>
									</tr>;
			}

			detailView =	<div className="row">
								<div className="col-md-12">
									<div className="panel panel-default">
										<div className="panel-heading">
											Statement of Account
											<div className="pull-right">
												<div className="btn-group">
													<button type="button" className="btn btn-default btn-xs" onClick={this._onShowAddTransactionForm}>Add New Transaction</button>
													<button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
														<span className="caret"></span>
														<span className="sr-only">Toggle Dropdown</span>
													</button>	
													<ul className="dropdown-menu">
														<li><a>Import Transaction <small>coming soon</small></a></li>
													</ul>
												</div>
											</div>
										</div>
										<div className="panel-body">
											<table className="table table-bordered table-striped table-condensed table-hover">
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
													{transactionList}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>;
		}
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div className="page-header">
						<div className="pull-right">
							<button type="button" className="btn btn-link btn-xs" onClick={this.props.mainViewChange.bind(null, 'LIST')}>Back to Investor Account List</button>
						</div>
						<h2>Investment Details</h2>
					</div>
					<div className="row">
						<div className="col-md-12">
							{detailView}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Investor Details  ----------*/

var InvestorsDetails = React.createClass({
	render: function () {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div className="page-header">
						<div className="pull-right">
							<button type="button" className="btn btn-link btn-xs" onClick={this.props.mainViewChange.bind(null, 'LIST')}>Back to Investor Account List</button>
						</div>
						<h2>Investors Details</h2>
					</div>
					<div className="row">
						<div className="col-md-12">
							
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of View Details Components  ======*/

/*==================================================
=            Account Details Components            =
==================================================*/

/*----------  Account Name Component  ----------*/

var AccountNameComponent = React.createClass({
	getInitialState: function () {
		return {
			accountName: this.props.account.name,
			editMode: false,
			status: undefined
		};
	},
	_onChangeEditMode: function (value) {
		this.setState({editMode: value});
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_updateAccountName: function (e) {
		e.preventDefault();
		var self = this;
		
		var postData = {
			id : this.props.account.id,
			accountName: this.state.accountName.trim()
		};

		if(postData.accountName === this.props.account.name)
		{
			this.setState({
				accountName: this.props.account.name,
				editMode: false,
				status: undefined
			});
		}
		else
		{
			this.setState({
				status: 'updating',
				editMode: false
			});
			$.ajax({
				url: '/api/investor/updateAccountName',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.getAccountDetails(0, this.props.account.id);
					this.props.getAllAccounts(0);
					this.setState({
						status: response.status
					});
					setTimeout( function() {
						self.setState({
							status: undefined,
							accountName: self.props.account.name
						});
					}, 3000);
				}.bind(this),
				error: function (xhr, status, error) {
					this.setState({status: status});
				}.bind(this)
			});
			
		}

	},
	render: function () {
		var componentContent;
		var componentButton;
		if(this.state.editMode) 
		{
			componentContent = 	<td>
									<form className="form-inline" onSubmit={this._updateAccountName}>
										<div className="form-group">
											<input
												type="text"
												className="form-control"
												value={this.state.accountName}
												onChange={this._handleChange.bind(null, 'accountName')}/>
											<button type="submit" className="hide">Hide</button>
										</div>
									</form>
								</td>;

			componentButton = 	<td className="text-right">
									<button type="button" className="btn btn-primary" onClick={this._updateAccountName} disabled={this.state.accountName === this.props.account.name}>Confirm</button>
									<button type="button" className="btn btn-link btn-xs" onClick={this._onChangeEditMode.bind(null, false)}>Cancel</button>
								</td>;
		}
		else
		{
			componentContent = <td>{this.state.accountName}</td>;
			switch(this.state.status) {
				case 'updating':
					componentButton = <td className="text-right"><i className="fa fa-circle-o-notch fa-fw fa-spin fa-xs"></i> <small>Updating</small></td>;
					break;
				case 'success':
					componentButton = <td className="text-right"><i className="fa fa-check-circle fa-fw fa-xs green-bg"></i> <small>Account Updated.</small></td>;
					break;
				case 'error':
					componentButton = <td className="text-right"><i className="fa fa-exclamation-triangle fa-fw fa-xs orange-bg"></i> <small>Unable to update.</small><button className="button" className="btn btn-link btn-xs" onClick={this._updateAccountName}>Retry</button></td>;
					break;
				default:
					componentButton = <td className="text-right"><button className="btn btn-link btn-xs" onClick={this._onChangeEditMode.bind(null, true)}>Edit</button></td>;
					break;

			}
		}
		return (
			<tr>
				<td className="table-title-col"> Account Name</td>
				{componentContent}
				{componentButton}
			</tr>
		);
	}
});

/*----------  Account Type Component  ----------*/

var AccountTypeComponent = React.createClass({
	getInitialState: function () {
		return {
			accountType: this.props.account.type,
			editMode: false,
			status: undefined
		};
	},
	_onChangeEditMode: function (value) {
		this.setState({editMode: value});
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_updateAccountType: function (e) {
		e.preventDefault();
		var self = this;
		
		var postData = {
			id : this.props.account.id,
			accountType: this.state.accountType
		};

		if(postData.accountType === this.props.account.type)
		{
			this.setState({
				editMode: false,
				status: undefined
			});
		}
		else
		{
			this.setState({
				status: 'updating',
				editMode: false
			});
			$.ajax({
				url: '/api/investor/updateAccountType',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.getAccountDetails(0, this.props.account.id);
					this.props.getAllAccounts(0);
					this.setState({
						status: response.status
					});
					setTimeout( function() {
						self.setState({
							status: undefined,
							accountType: self.props.account.type
						});
					}, 3000);
				}.bind(this),
				error: function (xhr, status, error) {
					this.setState({status: status});
				}.bind(this)
			});
			
		}

	},
	render: function () {
		var componentContent;
		var componentButton;
		if(this.state.editMode) 
		{
			componentContent = 	<td>
									<form className="form-inline" onSubmit={this._updateAccountType}>
										<div className="form-group">
											<select
												className="form-control"
												value={this.state.accountType}
												onChange={this._handleChange.bind(null, 'accountType')}>
												<option value="individual">Individual Account</option>
												<option value="joint">Joint Account</option>
											</select>
											<button type="submit" className="hide">Hide</button>
										</div>
									</form>
								</td>;

			componentButton = 	<td className="text-right">
									<button type="button" className="btn btn-primary" onClick={this._updateAccountType} disabled={this.state.accountType === this.props.account.type}>Confirm</button>
									<button type="button" className="btn btn-link btn-xs" onClick={this._onChangeEditMode.bind(null, false)}>Cancel</button>
								</td>;
		}
		else
		{
			componentContent = <td>{this.state.accountType === 'joint' ? "Joint Account" : "Individual Account"}</td>;
			switch(this.state.status) {
				case 'updating':
					componentButton = <td className="text-right"><i className="fa fa-circle-o-notch fa-fw fa-spin fa-xs"></i> <small>Updating</small></td>;
					break;
				case 'success':
					componentButton = <td className="text-right"><i className="fa fa-check-circle fa-fw fa-xs green-bg"></i> <small>Account Updated.</small></td>;
					break;
				case 'error':
					componentButton = <td className="text-right"><i className="fa fa-exclamation-triangle fa-fw fa-xs orange-bg"></i> <small>Unable to update.</small><button className="button" className="btn btn-link btn-xs" onClick={this._updateAccountType}>Retry</button></td>;
					break;
				default:
					componentButton = <td className="text-right"><button className="btn btn-link btn-xs" onClick={this._onChangeEditMode.bind(null, true)}>Edit</button></td>;
					break;

			}
		}
		return (
			<tr>
				<td className="table-title-col"> Account Type</td>
				{componentContent}
				{componentButton}
			</tr>
		);
	}
});

/*----------  Username Component  ----------*/

var UsernameComponent = React.createClass({
	getInitialState: function () {
		return {
			username: this.props.user.username,
			editMode: false,
			status: undefined
		};
	},
	_onChangeEditMode: function (value) {
		this.setState({editMode: value});
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_updateUsername: function (e) {
		e.preventDefault();
		var self = this;
		
		var postData = {
			id : this.props.account.id,
			username: this.state.username.trim()
		};

		if(postData.username === this.props.user.username)
		{
			this.setState({
				username: this.props.user.username,
				editMode: false,
				status: undefined
			});
		}
		else
		{
			this.setState({
				status: 'updating',
				editMode: false
			});
			$.ajax({
				url: '/api/investor/updateUsername',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.getAccountDetails(0, this.props.account.id);
					this.props.getAllAccounts(0);
					this.setState({
						status: response.status
					});
					setTimeout( function() {
						self.setState({
							status: undefined,
							username: self.props.user.username
						});
					}, 3000);
				}.bind(this),
				error: function (xhr, status, error) {
					this.setState({status: status});
				}.bind(this)
			});
			
		}

	},
	render: function () {
		var componentContent;
		var componentButton;
		if(this.state.editMode) 
		{
			componentContent = 	<td>
									<form onSubmit={this._updateUsername}>
										<div className="form-group">
											<input
												type="text"
												className="form-control"
												value={this.state.username}
												onChange={this._handleChange.bind(null, 'username')}/>
											<button type="submit" className="hide">Hide</button>
										</div>
									</form>
								</td>;

			componentButton = 	<td className="text-right">
									<button type="button" className="btn btn-primary" onClick={this._updateUsername} disabled={this.state.username === this.props.user.username}>Confirm</button>
									<button type="button" className="btn btn-link btn-xs" onClick={this._onChangeEditMode.bind(null, false)}>Cancel</button>
								</td>;
		}
		else
		{
			componentContent = <td>{this.state.username}</td>;
			switch(this.state.status) {
				case 'updating':
					componentButton = <td className="text-right"><i className="fa fa-circle-o-notch fa-fw fa-spin fa-xs"></i> <small>Updating</small></td>;
					break;
				case 'success':
					componentButton = <td className="text-right"><i className="fa fa-check-circle fa-fw fa-xs green-bg"></i> <small>Account Updated.</small></td>;
					break;
				case 'error':
					componentButton = <td className="text-right"><i className="fa fa-exclamation-triangle fa-fw fa-xs orange-bg"></i> <small>Unable to update.</small><button className="button" className="btn btn-link btn-xs" onClick={this._updateUsername}>Retry</button></td>;
					break;
				default:
					componentButton = <td className="text-right"><button className="btn btn-link btn-xs" onClick={this._onChangeEditMode.bind(null, true)}>Change Username</button></td>;
					break;

			}
		}
		return (
			<tr>
				<td className="table-title-col"> Username</td>
				{componentContent}
				{componentButton}
			</tr>
		);
	}
});

/*----------  Password Component  ----------*/

var PasswordComponent = React.createClass({
	getInitialState: function () {
		return {
			password: '',
			confirmPassword: '',
			editMode: false,
			status: undefined,
			password_changed_at: this.props.user.password_changed_at === null ? null : moment(this.props.user.password_changed_at).fromNow()
		};
	},
	_onChangeEditMode: function (value) {
		this.setState({editMode: value});
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_updatePassword: function (e) {
		e.preventDefault();
		
		if(this.state.password.trim() === '' && this.state.confirmPassword.trim() === '')
		{
			this.setState({
				password: '',
				confirmPassword: '',
				editMode: false,
				status: undefined
			});
		}
		else
		{
			var self = this;
			var postData = {
				id : this.props.account.id,
				password: this.state.password,
				confirmPassword: this.state.confirmPassword
			};

			this.setState({
				status: 'updating',
				editMode: false
			});

			$.ajax({
				url: '/api/investor/updatePassword',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.getAccountDetails(0, this.props.account.id);
					this.props.getAllAccounts(0);
					this.setState({
						status: response.status,
						password: '',
						confirmPassword: ''
					});
					setTimeout( function() {
						self.setState({
							status: undefined,
							password_changed_at: moment(self.props.user.password_changed_at).fromNow()
						});
					}, 3000);
				}.bind(this),
				error: function (xhr, status, error) {
					this.setState({status: status});
				}.bind(this)
			});
		}

	},
	render: function () {
		var componentContent;
		var componentButton;
		if(this.state.editMode) 
		{
			componentContent = 	<td>
									<form onSubmit={this._updatePassword}>
										<div className="form-group">
											<input
												type="password"
												className="form-control"
												value={this.state.password}
												placeholder="Type your Password"
												onChange={this._handleChange.bind(null, 'password')}/>
										</div>
										<div className="form-group">
											<input
												type="password"
												className="form-control"
												value={this.state.confirmPassword}
												placeholder="Re-type your Password"
												onChange={this._handleChange.bind(null, 'confirmPassword')}/>
										</div>
										<button type="submit" className="hide">Hide</button>
									</form>
								</td>;

			componentButton = 	<td className="text-right">
									<button type="button" className="btn btn-primary" onClick={this._updatePassword} disabled={this.state.password === '' || this.state.confirmPassword === ''}>Confirm</button>
									<button type="button" className="btn btn-link btn-xs" onClick={this._onChangeEditMode.bind(null, false)}>Cancel</button>
								</td>;
		}
		else
		{
			componentContent = <td>{user.password_changed_at === null ? 'Password not set.' : this.state.password_changed_at}</td>;
			switch(this.state.status) {
				case 'updating':
					componentButton = <td className="text-right"><i className="fa fa-circle-o-notch fa-fw fa-spin fa-xs"></i> <small>Updating</small></td>;
					break;
				case 'success':
					componentButton = <td className="text-right"><i className="fa fa-check-circle fa-fw fa-xs green-bg"></i> <small>Account Updated.</small></td>;
					break;
				case 'error':
					componentButton = <td className="text-right"><i className="fa fa-exclamation-triangle fa-fw fa-xs orange-bg"></i> <small>Unable to update.</small><button className="button" className="btn btn-link btn-xs" onClick={this._updatePassword}>Retry</button></td>;
					break;
				default:
					componentButton = <td className="text-right"><button className="btn btn-link btn-xs" onClick={this._onChangeEditMode.bind(null, true)}>Change Password</button></td>;
					break;

			}
		}
		return (
			<tr>
				<td className="table-title-col">Password</td>
				{componentContent}
				{componentButton}
			</tr>
		);
	}
});

/*----------  User Active Component  ----------*/

var UserActiveComponent = React.createClass({
	getInitialState: function () {
		return {
			status: undefined,
			isActive: this.props.user.is_active
		};
	},
	_changeUserActive: function () {
		this.setState({
			status: 'updating'
		});

		$.ajax({
			url: '/api/investor/updateUserActive',
			type: 'POST',
			data: {id : this.props.account.id},
			success: function (response) {
				var self = this;
				this.props.getAccountDetails(0, this.props.account.id);
				this.props.getAllAccounts(0);
				this.setState({
					status: response.status,
					isActive: this.props.user.is_active
				});
				setTimeout( function () {
					self.setState({
						status: undefined,
						isActive: self.props.user.is_active
					});
				}, 3000);
			}.bind(this),
			error: function (xhr, status, error) {
				this.setState({status: undefined});
			}.bind(this)
		});

	},
	render: function () {
		var componentContent;
		
		componentContent = this.state.isActive ? <td className="green-bg">Active</td> : <td className="red-bg">Inactive</td>;
		switch(this.state.status) {
			case 'updating':
				componentButton = <td className="text-right"><i className="fa fa-circle-o-notch fa-fw fa-spin fa-xs"></i> <small>{!(this.state.isActive) ? "Activating" : "Deactivating"}</small></td>;
				break;
			case 'success':
				componentButton = <td className="text-right"><i className="fa fa-check-circle fa-fw fa-xs green-bg"></i> <small>{this.state.isActive ? "Account Deactivated" : "Account Activated"}</small></td>;
				break;
			case 'error':
				componentButton = <td className="text-right"><i className="fa fa-exclamation-triangle fa-fw fa-xs orange-bg"></i> <small>Unable to update.</small><button className="button" className="btn btn-link btn-xs" >Retry</button></td>;
				break;
			default:
				componentButton = <td className="text-right"><button className="btn btn-link btn-xs" onClick={this._changeUserActive}>{this.state.isActive ? "Deactivate Account" : "Activate Account"}</button></td>;
				break;

		}
		return (
			<tr>
				<td className="table-title-col">Status</td>
				{componentContent}
				{componentButton}
			</tr>
		);
	}
});


/*=====  End of Account Details Components  ======*/


/*========================================
=            Modal Components            =
========================================*/

/*----------  Message Modal  ----------*/

var InvestMessageContainerModal = React.createClass({
	render: function () {
		var modalMessageComponent;
		var modalView = this.props.modalView;
		switch(modalView.type) {
			case 'WAITING-MODAL':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												{modalView.title}	
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

			case 'SUCCESS-MODAL':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> {modalView.message}
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

/*----------  Form Modal  ----------*/

var InvestFormContainerModal = React.createClass({
	render: function () {
		console.log(this.props.modalForm);
		var modalForm = this.props.modalForm;
		var modalFormComponent;
		switch(modalForm.type) {
			case 'ADD-TRANSACTION':
				modalFormComponent = <AddTransactionFormModal 
										accountId={this.props.accountId}
										getAllAccounts={this.props.getAllAccounts}
										getAccountDetails={this.props.getAccountDetails}
										modalFormChange={this.props.modalFormChange}
										modalViewChange={this.props.modalViewChange}/>;
				break;

			case 'EDIT-TRANSACTION':
				modalFormComponent = <EditTransactionFormModal 
										accountId={this.props.accountId}
										transactionId={this.props.modalForm.transactionId}
										getAllAccounts={this.props.getAllAccounts}
										getAccountDetails={this.props.getAccountDetails}
										modalFormChange={this.props.modalFormChange}
										modalViewChange={this.props.modalViewChange}/>;
				break;				

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

var AddTransactionFormModal = React.createClass({
	getInitialState: function () {
		return {
			transactionDate: '',
			transactionTypes: [],
			transactionType: '',
			amount: "0.00",
			notes: ''
		};
	},
	componentWillMount: function () {
		this._getTransactionTypes();
	},
	componentDidMount: function () {
		var self = this;
		$("#datepicker-transactionDate").datepicker({
			autoclose: true
		}).on('changeDate', function (e) {
			self.setState({transactionDate: moment(e.date).format('MM/DD/YYYY')});
		});
	},
	_getTransactionTypes: function () {
		$.ajax({
			url: '/api/transaction/getTransactionTypes',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (types) {
				this.setState({
					transactionTypes: types,
					transactionType: types[0].code
				});

			}.bind(this),
			error: function (xhr, status, error) {
				this._getTransactionTypes();
			}.bind(this)
		});
	},
	_saveTransaction: function (e) {
		e.preventDefault();

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating Transaction'
		});
		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.accountId,
			transactionDate: this.state.transactionDate,
			transactionType: this.state.transactionType,
			amount: accounting.unformat(this.state.amount),
			notes: this.state.notes.trim()
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		this.setState({
			notes: postData.notes
		});

		$.ajax({
			url: '/api/transaction/saveTransaction',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.modalViewChange({
					type: 'SUCCESS-MODAL',
					message: response.message
				});

				this.setState({
					transactionDate: '',
					transactionType: '',
					amount: "0.00",
					notes: ''
				});

				this.props.modalFormChange(undefined);
				this.props.getAccountDetails(0, this.props.accountId);
				this.props.getAllAccounts(0);
				$("#InvestFormContainerModal").modal('hide');
				$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (xhr, status, error) {
				$("#InvestMessageContainerModal").modal('hide');
				if(xhr.status === 422)
				{
					$.each(xhr.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});	
				}
			}.bind(this)
		});
	},
	_amountBlurred: function () {
		this.setState({amount: accounting.formatNumber(this.state.amount, 2)});
	},
	_amountFocused: function () {
		this.setState({amount: accounting.unformat(this.state.amount)});
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	render: function () {
		console.log(this.state.transactionDate);
		var transactionTypes;
		if(this.state.transactionTypes.length > 0)
		{
			transactionTypes = this.state.transactionTypes.map( function (type, index) {
				return <option key={index} value={type.code}>{type.description}</option>;
			});
		}
		else
		{
			transactionTypes = <option>Loading Data...</option>;
		}
		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="panel panel-default">
						<div className="panel-heading">
							Add New Transactions
							<button type="button" data-dismiss="modal" className="close">&times;</button> 
						</div>
						<div className="panel-body">
							<div className="row">
								<div className="col-md-12">
									<form onSubmit={this._saveTransaction}>
										<div className="form-group" id="fg-transactionDate">
											<label className="control-label" htmlFor="input-transactionDate">Transaction Date</label>
											<div className="input-group date" id="datepicker-transactionDate">
												<input
													type="text"
													className="form-control"
													id="input-transactionDate"
													name="transactionDate"
													value={this.state.transactionDate}
													onBlur={this._dateBlurred}
													onChange={this._handleChange.bind(null, 'transactionDate')}/>
												<span className="input-group-addon">
													<span className="glyphicon glyphicon-calendar"></span>
												</span>
											</div>
										</div>
										<div className="form-group" id="fg-transactionType">
											<label className="control-label" htmlFor="input-transactionType">Transaction Type</label>
											<select
												className="form-control" 
												id="input-transactionType"
												value={this.state.transactionType}
												disabled={!(this.state.transactionTypes.length > 0)}
												onChange={this._handleChange.bind(null, 'transactionType')}>
												{transactionTypes}
											</select>
										</div>
										<div className="form-group" id="fg-amount">
											<label className="control-label" htmlFor="input-amount">Amount</label>
											<input 
												type="text"
												className="form-control text-right"
												value={this.state.amount}
												id="input-amount"
												onBlur={this._amountBlurred}
												onFocus={this._amountFocused}
												onChange={this._handleChange.bind(null, 'amount')}/>
										</div>
										<div className="form-group">
											<label>Notes/Reason <small>(optional)</small></label>
											<textarea
												rows="5"
												className="form-control"
												value={this.state.notes}
												onChange={this._handleChange.bind(null, 'notes')}/>
										</div>
										<div className="form-group">
											<div className="pull-right">
												<button type="submit" className="btn btn-primary">Save Transaction</button>
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

var EditTransactionFormModal = React.createClass({
	getInitialState: function () {
		return {
			transaction: undefined,
			transactionDate: '',
			transactionTypes: [],
			transactionType: '',
			amount: "0.00",
			notes: ''
		};
	},
	componentWillMount: function () {
		this._getTransactionDetails(0);
		this._getTransactionTypes();
	},
	componentDidMount: function () {
		var self = this;
		$("#datepicker-transactionDate").datepicker({
			autoclose: true
		}).on('changeDate', function (e) {
			self.setState({transactionDate: moment(e.date).format('MM/DD/YYYY')});
		});
	},
	_getTransactionDetails: function (counter) {
		$.ajax({
			url: '/api/transaction/getTransactionDetails',
			type: 'POST',
			data: {id: this.props.transactionId},
			success: function (transaction) {
				this.setState({
					transaction: transaction,
					transactionDate: moment(transaction.transactionDate).format('MM/DD/YYYY'),
					transactionType: transaction.transaction_type.code,
					amount: accounting.formatNumber(transaction.amount, 2),
					notes: transaction.notes
				});
			}.bind(this),
			error: function (xhr, status, error) {
				if(counter < 3)
				{
					this.setState({transaction: 'retrying'});
					this._getTransactionDetails(counter + 1, id);
				}
				else 
				{
					this.setState({transaction: status});
				}
			}.bind(this)
		});	
	},
	_getTransactionTypes: function () {
		$.ajax({
			url: '/api/transaction/getTransactionTypes',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (types) {
				this.setState({
					transactionTypes: types,
					transactionType: types[0].code
				});

			}.bind(this),
			error: function (xhr, status, error) {
				this._getTransactionTypes();
			}.bind(this)
		});
	},
	_updateTransaction: function (e) {
		e.preventDefault();

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating Transaction'
		});

		$("#InvestMessageContainerModal").modal();
		$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			id: this.props.transactionId,
			transactionDate: this.state.transactionDate,
			transactionType: this.state.transactionType,
			amount: accounting.unformat(this.state.amount),
			notes: this.state.notes === null ? null : this.state.notes.trim() 
		};

		if(postData.transactionDate !== this.state.transaction.transactionDate
			|| postData.transactionType !== this.state.transaction.transaction_type.code
			|| postData.amount !== this.state.transaction.amount
			|| postData.notes !== this.state.transaction.notes)
		{
			$.each(postData, function (key, value) {
				$("#fg-" + key).removeClass('has-error');
				$("#input-" + key).popover('destroy');
			});

			this.setState({
				notes: postData.notes
			});

			$.ajax({
				url: '/api/transaction/updateTransaction',
				type: 'POST',
				data: postData,
				success: function (response) {
					this.props.modalViewChange({
						type: 'SUCCESS-MODAL',
						message: response.message
					});

					this.setState({
						transactionDate: '',
						transactionType: '',
						amount: "0.00",
						notes: ''
					});

					this.props.modalFormChange(undefined);
					this.props.getAccountDetails(0, this.props.accountId);
					this.props.getAllAccounts(0);
					$("#InvestFormContainerModal").modal('hide');
					$("#InvestMessageContainerModal").data('bs.modal').options.keyboard = true;
					$("#InvestMessageContainerModal").data('bs.modal').options.backdrop = true;
				}.bind(this),
				error: function (xhr, status, error) {
					$("#InvestMessageContainerModal").modal('hide');
					if(xhr.status === 422)
					{
						$.each(xhr.responseJSON, function (key, value) {
							$("#fg-" + key).addClass('has-error');
							$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
						});	
					}
					else
					{
						
					}
				}.bind(this)
			});	
		}
		else
		{
			this.props.modalFormChange(undefined);
			$("#InvestFormContainerModal").modal('hide');
		}
	},
	_amountBlurred: function () {
		this.setState({amount: accounting.formatNumber(this.state.amount, 2)});
	},
	_amountFocused: function () {
		this.setState({amount: accounting.unformat(this.state.amount)});
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	render: function () {
		var transactionTypes;
		if(this.state.transactionTypes.length > 0)
		{
			transactionTypes = this.state.transactionTypes.map( function (type, index) {
				return <option key={index} value={type.code}>{type.description}</option>;
			});
		}
		else
		{
			transactionTypes = <option>Loading Data...</option>;
		}

		var transactionView = <div className="panel panel-default">
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

		if(this.state.transaction !== undefined)
		{
			transactionView = 	<div className="row">
									<div className="col-md-12">
										<form onSubmit={this._updateTransaction}>
											<div className="form-group" id="fg-transactionDate">
												<label className="control-label" htmlFor="input-transactionDate">Transaction Date</label>
												<div className="input-group date" id="datepicker-transactionDate">
													<input
														type="text"
														className="form-control"
														id="input-transactionDate"
														name="transactionDate"
														value={this.state.transactionDate}
														onBlur={this._dateBlurred}
														onChange={this._handleChange.bind(null, 'transactionDate')}/>
													<span className="input-group-addon">
														<span className="glyphicon glyphicon-calendar"></span>
													</span>
												</div>
											</div>
											<div className="form-group" id="fg-transactionType">
												<label className="control-label" htmlFor="input-transactionType">Transaction Type</label>
												<select
													className="form-control" 
													id="input-transactionType"
													value={this.state.transactionType}
													disabled={!(this.state.transactionTypes.length > 0)}
													onChange={this._handleChange.bind(null, 'transactionType')}>
													{transactionTypes}
												</select>
											</div>
											<div className="form-group" id="fg-amount">
												<label className="control-label" htmlFor="input-amount">Amount</label>
												<input 
													type="text"
													className="form-control text-right"
													value={this.state.amount}
													id="input-amount"
													onBlur={this._amountBlurred}
													onFocus={this._amountFocused}
													onChange={this._handleChange.bind(null, 'amount')}/>
											</div>
											<div className="form-group">
												<label>Notes/Reason <small>(optional)</small></label>
												<textarea
													rows="5"
													className="form-control"
													value={this.state.notes}
													onChange={this._handleChange.bind(null, 'notes')}/>
											</div>
											<div className="form-group">
												<div className="pull-right">
													<button type="submit" className="btn btn-primary">Save Transaction</button>
												</div>
											</div>
										</form>
									</div>
								</div>;
		}
		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="panel panel-default">
						<div className="panel-heading">
							Edit Transaction Details
							<button type="button" data-dismiss="modal" className="close">&times;</button> 
						</div>
						<div className="panel-body">
							{transactionView}
						</div>
					</div>
				</div> 
			</div>
		);
	}
});

/*=====  End of Form Modal Components  ======*/

var InvestMain = React.createClass({
	getInitialState: function () {
		return {
			mainView: 'LIST',
			modalView: {
				type: undefined
			},
			modalForm: {
				type: undefined
			},
			accounts: undefined,
			accountId: undefined,
			account: undefined
		};
	},
	componentWillMount: function () {
		this._getAllccounts(0);
		this.timer = setInterval(this._getAllccounts, 120000);
	},
	_getAllccounts: function (counter) {
		$.ajax({
			url: '/api/investor/getAllAccounts',
			type: 'POST',
			dataType: 'json',
			success: function (accounts) {
				this.setState({accounts: accounts});
			}.bind(this),
			error: function (xhr, status, error) {
				if(counter < 3)
				{
					this.setState({accounts: 'retrying'});
					this._getAllccounts(counter + 1);
				}
				else 
				{
					this.setState({accounts: status});
				}
			}.bind(this)
		});
	},
	_getAccountDetails: function (counter, id) {
		$.ajax({
			url: '/api/investor/getAccountDetails',
			type: 'POST',
			data: {id: id},
			success: function (account) {
				this.setState({account: account});
			}.bind(this),
			error: function (xhr, status, error) {
				if(counter < 3)
				{
					this.setState({account: 'retrying'});
					this._getAccountDetails(counter + 1, id);
				}
				else 
				{
					this.setState({account: status});
				}
			}.bind(this)
		});
	},
	_onRetryGetAllAccounts: function () {
		this.setState({accounts: undefined});
		this._getAllccounts(0);
	},
	_onRetryGetAccountDetails: function () {
		this.setState({account: undefined});
		this._getAccountDetails(0, this.state.accountId);
	},
	_onMainViewChange: function (mainView) {
		if(mainView != 'LIST')
		{
			this.setState({
				account: undefined,
				accountId: undefined
			});
			clearInterval(this.timer);
		}
		else
			this.timer = setInterval(this._getAllccounts, 120000);
		this.setState({mainView: mainView});
	},
	_onModalViewChange: function (modalView) {
		this.setState({modalView: modalView});
	},

	_onModalFormChange: function (modalForm, id) {
		var self = this;
		this.setState({modalForm: {type: undefined}});
		console.log(this.state.modalForm);
		setTimeout(function () {
			self.setState({
				modalForm: {
					type: modalForm,
					transactionId: id
				}
			});
		}, 500);
		console.log(this.state.modalForm);

	},
	_onViewAccountDetails: function (accountId) {
		this._onMainViewChange('VIEW-ACCOUNT');
		this.setState({accountId: accountId});
		this._getAccountDetails(0, accountId);
	},
	render: function () {
		// console.log(this.state.modalForm);
		var mainView;
		switch(this.state.mainView) {
			case 'LIST':
				mainView = <InvestorTableListView 
								accounts={this.state.accounts}
								viewAccountDetails={this._onViewAccountDetails}
								retryGetAllAccounts={this._onRetryGetAllAccounts}
								mainViewChange={this._onMainViewChange}/>;
				break;

			case 'CREATE-ACCOUNT':
				mainView = <CreateInvestorAccount
								accountsChange={this._onRetryGetAllAccounts}
								mainViewChange={this._onMainViewChange}
								modalViewChange={this._onModalViewChange}/>;
				break;

			case 'VIEW-ACCOUNT':
				mainView = <ViewInvestorAccount 
								account={this.state.account}
								getAllAccounts={this._getAllccounts}
								getAccountDetails={this._getAccountDetails}
								retryGetAccountDetails={this._onRetryGetAccountDetails}
								modalFormChange={this._onModalFormChange}
								modalViewChange={this._onModalViewChange}
								mainViewChange={this._onMainViewChange}/>;
				break;
		}
		return (
			<div className="row">
				{ mainView }
				<InvestFormContainerModal 
					accountId={this.state.accountId}
					modalForm={this.state.modalForm}
					getAllAccounts={this._getAllccounts}
					getAccountDetails={this._getAccountDetails}
					modalFormChange={this._onModalFormChange}
					modalViewChange={this._onModalViewChange}/>
				<InvestMessageContainerModal
					modalView={this.state.modalView}/>
			</div>
		);
	}
});

if(typeof $("#invest-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<InvestMain />,
	document.getElementById('invest-app-node'));
}