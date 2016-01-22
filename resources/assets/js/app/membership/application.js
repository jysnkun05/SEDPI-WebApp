/*==========================================
=            Applicant Messages            =
==========================================*/

var ApplicantMessageContainerModal = React.createClass({
	render: function () {
		var modalMessageComponent;
		switch(this.props.modalMessage) {
			case 'SHOW-CHANGE-STATUS':
				modalMessageComponent = <ApplicantMessageChangeStatus 
											applicantChange={this.props.applicantChange}
											applicant={this.props.applicant}/>;
				break;

			case 'SHOW-ACCEPT-APPLICATION':
				modalMessageComponent = <ApplicantMessageSaveMember 
											applicantChange={this.props.applicantChange}
											applicant={this.props.applicant}/>;
				break;
		}
		return (
			<div className="modal fade" id="ApplicantMessageContainerModal" role="dialog">
		    	{ modalMessageComponent }
			</div>
		);
	}
});

/*----------  Applicant Message Change Status  ----------*/

var ApplicantMessageChangeStatus = React.createClass({
	getInitialState: function () {
		return {
			changeStatusView: undefined,
			statuses: undefined,
			remarks: this.props.applicant.remarks,
			statusSelected: this.props.applicant.application_status_id.id
		};
	},
	componentWillMount: function () {
		this.loadApplicationStatus();
	},
	loadApplicationStatus: function () {
		$.ajax({
			url: '/api/applicants/getApplicationStatus',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (statuses) {
				this.setState({ statuses: statuses });
			}.bind(this)
		});
	},
	saveApplicationStatus: function (postData) {
		$("#btn-change-status-submit").prop('disabled', true);
		$("#btn-change-status-submit").html('<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Saving...');
		$.ajax({
			url: '/api/applicants/updateApplicationStatus',
			type: 'POST',
			dataType: 'json',
			data: {
				id : postData.id,
				statusSelected: postData.statusSelected,
				remarks: this.state.remarks 
			},
			success: function (response) {
				$("#btn-change-status-submit").prop('disabled', false);
				$("#btn-change-status-submit").html('Confirm');
				if(response.status === 'success')
				{
					this.setState({changeStatusView: 'success'});
					this.props.applicantChange();
				}
			}.bind(this),
			error: function () {
				$("#btn-change-status-submit").prop('disabled', false);
				$("#btn-change-status-submit").html('Confirm');
			}
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
			id : this.props.applicant.id,
			statusSelected: this.state.statusSelected
		};

		if(this.props.applicant.application_status_id.id !== this.state.statusSelected)
			this.saveApplicationStatus(postData);
	},
	render: function () {
		var statusOptions;
		var view;
		if(this.state.statuses !== undefined) {
			statusOptions = this.state.statuses.map( function (status, index) {
				return <option key={index} value={status.id}>{status.name}</option>;
			}.bind(this));
		}
		switch(this.state.changeStatusView) {
			case 'success':
				view = 	<div className="panel-custom-success">
							<div className="panel-body">
								<div className="row">
									<div className="col-md-12">
										<i className="fa fa-check-circle fa-lg fa-fw"></i> Application Status Updated.
										<div className="pull-right">
											<button className="close" data-dismiss="modal">&times;</button>
										</div>
									</div>
								</div>
							</div>
						</div>;
				break;

			default:
				view = 	<div className="panel panel-default">
						   	<div className="panel-heading">
						    	Edit Application Status
						   	</div>
						   	<div className="panel-body">
						   		<form onSubmit={this.handleSubmit}>
							   		<div className="form-group">
								   		<label>Application Status</label>
								   		<select
								   			className="form-control"
								   			value={this.state.statusSelected}
								   			onChange={this.handleChange.bind(null, 'statusSelected')}>
								   			{ statusOptions }
								   		</select>
							   		</div>
							   		<div className="form-group">
							   			<label>Remarks</label>
							   			<textarea
							   				value={this.state.remarks}
							   				onChange={this.handleChange.bind(null, 'remarks')}
							   				className="form-control textarea-disabled-resize"></textarea>
							   		</div>
							   		<div className="form-group">
									   	<div className="pull-right">
									   		<div className="btn-group">
										   		<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
										   		<button type="submit" className="btn btn-primary" id="btn-change-status-submit">Confirm</button>
									   		</div>
									   	</div>
							   		</div>
						   		</form>
						   	</div>
						</div>;
				break;
		}
		return (
			<div className="modal-dialog" role="document">
				{ view }
			</div>
		);
	}
});

/*----------  Applicant Message Save Member  ----------*/

var ApplicantMessageSaveMember = React.createClass({
	getInitialState: function () {
		return {
			saveMemberView: undefined
		};
	},
	saveApplicantAsMember: function (id) {
		this.setState({ saveMemberView : 'GENERATING' });
		$("#ApplicantMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#ApplicantMessageContainerModal").data('bs.modal').options.backdrop = 'static';	
		$.ajax({
			url: '/api/applicants/saveApplicantAsMember',
			type: 'POST',
			dataType: 'json',
			data: {
				id : id
			},
			success: function (response) {
				$("#ApplicantMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplicantMessageContainerModal").data('bs.modal').options.backdrop = true;
				this.setState({	saveMemberView : 'GENERATED' });
				this.props.applicantChange();
			}.bind(this)
		});
	},
	handleSubmit: function (e) {
		e.preventDefault();
		console.log(this.props.applicant.id);
		this.saveApplicantAsMember(this.props.applicant.id);
	},
	render: function () {
		var view;
		switch(this.state.saveMemberView) {
			case 'GENERATING':
				view = 	<div className="panel panel-default">
							<div className="panel-heading">
								Accept Member
							</div>
							<div className="panel-body">
								<div className="row">
									<div className="col-md-12">
										<div className="form-group">
											<p className="text-center"><i className="fa fa-circle-o-notch fa-2x fa-spin"></i></p>
											<p className="text-center">Generating Member... Please wait.</p>
										</div>
									</div>
								</div>
							</div>
						</div>;
				break;

			case 'GENERATED':
				view = 	<div className="panel-custom-success">
							<div className="panel-body">
								<div className="row">
									<div className="col-md-12">
										<i className="fa fa-check-circle fa-lg fa-fw"></i> Applicant has been registered.
										<div className="pull-right">
											<button className="close" data-dismiss="modal">&times;</button>
										</div>
									</div>
								</div>
							</div>
						</div>;	
				break;

			default:
				view = 	<div className="panel panel-default">
							<div className="panel-heading">
								Accept Member
							</div>
							<div className="panel-body">
								<form onSubmit={this.handleSubmit}>
									<div className="row">
										<div className="col-md-12">
											<div className="form-group">
												<p><i className="fa fa-question-circle fa-lg fa-fw"></i> Do you want to continue?</p>
												<p>Note: Once the applicant is accepted, the applicant information will be accessed as read-only. This action is irreversible.</p>
											</div>
											<div className="form-group">
											   	<div className="pull-right">
											   		<div className="btn-group">
												   		<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
												   		<button type="submit" className="btn btn-primary" id="btn-save-member-submit">Continue</button>
											   		</div>
											   	</div>
									   		</div>
										</div>
									</div>
								</form>
							</div>
						</div>;
				break;
		}
		return (
			<div className="modal-dialog" role="document">
				{ view }
			</div>
		);
	}
});


/*=====  End of Applicant Messages  ======*/

/*======================================
=            Applicant View            =
======================================*/

var ApplicantTableView = React.createClass({
	handleClick: function (applicant) {
		this.props.rowClick(applicant.id);
	},
	render: function () {
		var rows;
		if(this.props.applicants === undefined)
		{
			rows =	<tr className="text-center">
						<td colSpan="6"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retrieving Applicants...</td>
					</tr>;
		}
		else
		{
			if(this.props.applicants.length > 0)
			{
				rows = this.props.applicants.map( function (applicant, index) {
					applicant.fullName = applicant.middleName !== null ? applicant.firstName + ' ' + applicant.middleName + ' ' + applicant.lastName : applicant.firstName + ' ' +  applicant.lastName ;
					applicant.dateApplied = moment.tz(applicant.created_at, moment.tz.guess()).format('MMM DD, YYYY hh:mm:ss A');
					applicant.status = applicant.application_status_id;
					applicant.location = applicant.presentCountry !==  null ? applicant.presentCountry : 'Not Available';
					applicant.applicantType = applicant.applicant_type_id;
					return <tr key={index} className="text-center clickable-row" onClick={this.handleClick.bind(null, applicant)}>
								<td>{index + 1}</td>
								<td>{applicant.fullName}</td>
								<td>{applicant.location}</td>
								<td>{applicant.dateApplied}</td>
								<td>{applicant.applicantType}</td>
								<td>{applicant.status}</td>
							</tr>;	
				}.bind(this));
			}
			else
			{
				rows = 	<tr className="text-center">
							<td colSpan="6"><i className="fa fa-info-circle fa-fw"></i> No Applicant Found.</td>
						</tr>;
			}
		}
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-heading">
						Member Applicants
					</div>
					<div className="panel-body">
						<div className="row">
							<div className="col-md-12">
								<table className="table table-bordered table-striped table-condensed">
									<thead>
										<tr>
											<th className="text-center">#</th>
											<th className="text-center">Applicant Name</th>
											<th className="text-center">Location</th>
											<th className="text-center">Date Applied</th>
											<th className="text-center">Membership Type</th>
											<th className="text-center">Status</th>
										</tr>
									</thead>
									<tbody>
										{ rows }
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

/*----------  Applicant Detail VIew  ----------*/

var ApplicantDetailView = React.createClass({
	getInitialState: function () {
		return {
			detailView: 'applicantInfo'
		};
	},
	handleClick: function (e) {
		console.log(e);
		switch(e) {
			case 'showApplicantInformation':
				if (this.state.detailView !== 'applicantInfo')
					this.setState({ detailView : 'applicantInfo' });
				break;

			case 'showContactInformation':
				if (this.state.detailView !== 'contactInfo')
					this.setState({ detailView : 'contactInfo' });
				break;

			case 'showInvestmentInformation':
				if(this.state.detailView !== 'investInfo')
					this.setState({ detailView : 'investInfo' });
				break;

			case 'backToTableView':
				this.props.viewChange('TABLE');
				break;

			case 'showChangeStatusModal':
				this.props.modalChange('SHOW-CHANGE-STATUS');
				break;

			case 'showSaveMemberModal':
				this.props.modalChange('SHOW-ACCEPT-APPLICATION');
				break;

		}
	},
	render: function () {
		var navigations;
		var actions;
		if(this.props.applicant !== undefined)
		{
			switch(this.props.applicant.applicant_type_id.name) {
				case 'Investor':
					navigations =	<ul className="nav nav-tabs">
										<li role="presentation" className={this.state.detailView === 'applicantInfo' ? 'active' : 'clickable-row'}><a onClick={this.handleClick.bind(null, 'showApplicantInformation')}>Applicant Information</a></li>
										<li role="presentation" className={this.state.detailView === 'contactInfo' ? 'active' : 'clickable-row'}><a onClick={this.handleClick.bind(null, 'showContactInformation')}>Contact Information</a></li> 
										<li role="presentation" className={this.state.detailView === 'investInfo' ? 'active' : 'clickable-row'}><a onClick={this.handleClick.bind(null, 'showInvestmentInformation')}>Investment and Beneficiary Information</a></li>
									</ul>;
					break;

				default:
					navigations = 	<ul className="nav nav-tabs">
										<li role="presentation" className={this.state.detailView === 'applicantInfo' ? 'active' : 'clickable-row'}><a onClick={this.handleClick.bind(null, 'showApplicantInformation')}>Applicant Information</a></li>
										<li role="presentation" className={this.state.detailView === 'contactInfo' ? 'active' : 'clickable-row'}><a onClick={this.handleClick.bind(null, 'showContactInformation')}>Contact Information</a></li>
									</ul>;
					break;

			}

			if(this.props.applicant.application_status_id.description !== 'Already Member')
			{
				var applicationStatus = this.props.applicant.application_status_id;
				actions = 	<div className="panel-body">
								<button className="btn btn-default btn-block" onClick={this.handleClick.bind(null, 'showChangeStatusModal')}>Change Application Status</button>
								{ applicationStatus.name === 'User Approved' || applicationStatus.name === 'System Approved' ?
									<button className="btn btn-default btn-block" onClick={this.handleClick.bind(null, 'showSaveMemberModal')}>Accept Application</button> : null }
							</div>;
			}
			else
			{
				actions = 	<div className="panel-body">
								<div className="row">
									<div className="col-md-12 text-center">
										<i className="fa fa-info-circle fa-fw"></i> No Actions Available.
									</div>
								</div>
							</div>;
			}
		}
		else
		{
			actions = 	<div className="panel-body">
							<p className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></p>
						</div>;

			navigations = 	<ul className="nav nav-tabs">
								<li role="presentation" className={this.state.detailView === 'applicantInfo' ? 'active' : ''}><a>Applicant Information</a></li>
							</ul>;
		}
		var view;
		switch (this.state.detailView) {
			case 'applicantInfo':
				view = 	<ApplicantInfoPanel applicant={this.props.applicant}/>;
				break;

			case 'contactInfo':
				view =	<ContactInfoPanel applicant={this.props.applicant}/>;
				break;

			case 'investInfo':
				view = 	<div>
							<InvestmentInfoPanel applicant={this.props.applicant}/>
							<BeneficiaryInfoPanel applicant={this.props.applicant}/>
						</div>;
		}
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-heading">
						Applicant Details
						<div className="pull-right">
							<a className="clickable-row" onClick={this.handleClick.bind(null, 'backToTableView')}>Back to List</a>
						</div>
					</div>
					<div className="panel-body">
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
									{ navigations }				
								</div>
								<div className="form-group">
									<div className="row">
										<div className="col-md-8">
											{ view }
										</div>
										<div className="col-md-4">
											<div className="panel panel-default">		
												{ actions }
											</div>
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

/*=====  End of Applicant View  ======*/

/*============================================
=            Applicant View Panel            =
============================================*/

var ApplicantInfoPanel = React.createClass({
	render: function () {
		var view;
		if(this.props.applicant === undefined) {
			view = 	<p className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retrieving Data.</p>;
		}
		else
		{ 
			var applicant = this.props.applicant;
			applicant.fullName = applicant.middleName !== null ? applicant.firstName + ' ' + applicant.middleName + ' ' + applicant.lastName : applicant.firstName + ' ' + applicant.lastName;
			applicant.location = applicant.presentCountry === null ? 'Not Available' : applicant.presentCountry;
			applicant.dateApplied = moment.tz(applicant.created_at, moment.tz.guess()).format('MMM DD, YYYY hh:mm:ss A');
			applicant.applicantType = applicant.applicant_type_id.name;
			applicant.status = applicant.application_status_id.name;
			view =	<table className="table table-condensed table-striped table-bordered">
						<tbody>
							<tr>
								<td className="table-title-col">Member Name</td>
								<td>{ applicant.fullName }</td>
							</tr>
							<tr>
								<td className="table-title-col">Location</td>
								<td>{ applicant.location }</td>
							</tr>
							<tr>
								<td className="table-title-col">Date Applied</td>
								<td>{ applicant.dateApplied }</td>
							</tr>
							<tr>
								<td className="table-title-col">Member Type</td>
								<td>{ applicant.applicantType }</td>
							</tr>
							<tr>
								<td className="table-title-col">Status</td>
								<td>{ applicant.status }</td>
							</tr>
							<tr>
								<td className="table-title-col">Remarks</td>
								<td>{ applicant.remarks }</td>
							</tr>
 						</tbody>
					</table>;
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Applicant Information
				</div>
				<div className="panel-body">
					{ view }
				</div>
			</div>
		);
	}
});

/*----------  Contact Info Panel  ----------*/

var ContactInfoPanel = React.createClass({
	render: function () {
		var view;
		if(this.props.applicant === undefined) {
			view = 	<p className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retrieving Data.</p>;
		}
		else
		{ 
			var applicant = this.props.applicant;
			applicant.presentAddress = applicant.presentAddress === '' ? undefined : applicant.presentAddress;
			applicant.presentCountry = applicant.presentCountry === 'Not Available' ? undefined : applicant.presentCountry;
			applicant.permanentAddress = applicant.permanentAddress === '' ? undefined : applicant.permanentAddress;
			applicant.permanentCountry = applicant.permanentCountry === 'Not Available' ? undefined : applicant.permanentCountry;
			applicant.mailingAddress = applicant.mailingAddress === '' ? undefined : applicant.mailingAddress;
			applicant.mobile = applicant.mobile === '' ? undefined : applicant.mobile;

			view =	<table className="table table-condensed table-striped table-bordered">
						<tbody>
							{ applicant.presentAddress !== null ? 
								<tr>
									<td className="table-title-col">Present Address</td>
									<td>{ applicant.presentAddress }</td>
								</tr> : null }
							{ applicant.presentCountry !== null ? 
								<tr>
									<td className="table-title-col">Present Country</td>
									<td>{ applicant.presentCountry }</td>
								</tr> : null }
							{ applicant.permanentAddress !== null ? 
								<tr>
									<td className="table-title-col">Permanent Address</td>
									<td>{ applicant.permanentAddress }</td>
								</tr> : null }
							{ applicant.permanentCountry !== null ? 
								<tr>
									<td className="table-title-col">Permanent Country</td>
									<td>{ applicant.permanentCountry }</td>
								</tr> : null }
							{ applicant.mailingAddress !== null ? 
								<tr>
									<td className="table-title-col">Mailing Address</td>
									<td>{ applicant.mailingAddress === 'present' ? 'Present Address' : 'Permanent Address' }</td>
								</tr> : null }
							{ applicant.mobile !== null ? 
								<tr>
									<td className="table-title-col">Mobile</td>
									<td>{ applicant.mobile }</td>
								</tr> : null }
							{ applicant.email !== null ? 
								<tr>
									<td className="table-title-col">Email Address</td>
									<td>{ applicant.email }</td>
								</tr> : null }
 						</tbody>
					</table>;
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Contact Information
				</div>
				<div className="panel-body">
				{ view }
				</div>
			</div>
		);
	}
});

/*----------  Investment Info Panel  ----------*/

var InvestmentInfoPanel = React.createClass({
	render: function () {
		var view;
		if(this.props.applicant === undefined) {
			view = 	<p className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retrieving Data.</p>;
		}
		else
		{ 
			var investment = this.props.applicant;
			investment.investmentDate = moment.tz(investment.investmentDate, moment.tz.guess()).format('MMM DD, YYYY');
			if(investment.amountInvested !== null && investment.sourceOfFunds !== null)
			{
				view =	<table className="table table-condensed table-striped table-bordered">
							<tbody>
								<tr>
									<td className="table-title-col">Invested Amount</td>
									<td>{ "Php " + investment.amountInvested }</td>
								</tr>
								<tr>
									<td className="table-title-col">Date intended to invest</td>
									<td>{ investment.investmentDate }</td>
								</tr> 
								<tr>
									<td className="table-title-col">Source of Funds</td>
									<td>{ investment.sourceOfFunds }</td>
								</tr>
	 						</tbody>
						</table>;
				
			}
			else
			{
				view =	<div className="panel-default">
							<div className="panel-body">
								<p className="text-center"><i className="fa fa-info-circle"></i> No Information Available.</p>
							</div>
						</div>;
			}			
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Investment Information
				</div>
				<div className="panel-body">
					{ view }
				</div>
			</div>
		);
	}
});

/*----------  Beneficiary Info Panel  ----------*/

var BeneficiaryInfoPanel = React.createClass({
	render: function () {
		var view;
		if(this.props.applicant === undefined) {
			view = 	<p className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retrieving Data.</p>;
		}
		else
		{ 
			var beneficiary = this.props.applicant;
			//investment.investmentDate = moment.tz(investment.investmentDate, moment.tz.guess()).format('MMM DD, YYYY hh:mm:ss A');
			if(beneficiary.b1Name !== null || beneficiary.b2Name !== null)
			{
				beneficiary.b1BirthDate = moment.tz(beneficiary.b1BirthDate, moment.tz.guess()).format('MMM DD, YYYY');
				beneficiary.b2BirthDate = moment.tz(beneficiary.b2BirthDate, moment.tz.guess()).format('MMM DD, YYYY');
				view =	<div className="row">
							{ beneficiary.b1Name !== null ?
								<div className="col-md-12">
									<div className="form-group">
										<label>Beneficiary 1</label>
									</div>
									<div className="form-group">
										<table className="table table-condensed table-striped table-bordered">
											<tbody>
												<tr>
													<td className="table-title-col">Name</td>
													<td>{ beneficiary.b1Name }</td>
												</tr>
												<tr>
													<td className="table-title-col">Address</td>
													<td>{ beneficiary.b1Address }</td>
												</tr> 
												<tr>
													<td className="table-title-col">Birth Date</td>
													<td>{ beneficiary.b1BirthDate }</td>
												</tr>
												<tr>
													<td className="table-title-col">Relationship</td>
													<td>{ beneficiary.b1Relationship }</td>
												</tr>
					 						</tbody>
										</table> 
									</div>
								</div> : null }					
							{ beneficiary.b2Name !== null ?
								<div className="col-md-12">
									<div className="form-group">
										<label>Beneficiary 2</label>
									</div>
									<div className="form-group">
										<table className="table table-condensed table-striped table-bordered">
											<tbody>
												<tr>
													<td className="table-title-col">Name</td>
													<td>{ beneficiary.b2Name }</td>
												</tr>
												<tr>
													<td className="table-title-col">Address</td>
													<td>{ beneficiary.b2Address }</td>
												</tr> 
												<tr>
													<td className="table-title-col">Birth Date</td>
													<td>{ beneficiary.b2BirthDate }</td>
												</tr>
												<tr>
													<td className="table-title-col">Relationship</td>
													<td>{ beneficiary.b2Relationship }</td>
												</tr>
					 						</tbody>
										</table> 
									</div>			
								</div> : null }
						</div>;
				}
			else
			{
				view =	<div className="panel-default">
							<div className="panel-body">
								<p className="text-center"><i className="fa fa-info-circle"></i> No Information Available.</p>
							</div>
						</div>;
			}
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Beneficiary Information
				</div>
				<div className="panel-body">
					{ view }
				</div>
			</div>
		);
	}
});

/*=====  End of Applicant View Panel  ======*/

/*======================================
=            Applicant Main            =
======================================*/

var ApplicantMain = React.createClass({
	getInitialState: function () {
		return {
			applicants: undefined,
			applicantView: undefined,
			applicantId: undefined,
			modalMessage: undefined
		};
	},
	componentWillMount: function () {
		this.loadApplicants();
	},
	loadApplicants: function () {
		$.ajax({
			url: '/api/applicants/getApplicants',
			type: 'POST',
			dataType: 'json',
			success: function (applicants) {
				this.setState({
					applicants: applicants
				});
			}.bind(this),
			error: function () {
				//this.loadApplicants();
			}.bind(this)
		});
	},
	loadApplicant: function (id) {
		$.ajax({
			url: '/api/applicants/getApplicant',
			type: 'POST',
			data: {
				id : id
			},
			dataType: 'json',
			cache: false,
			success: function (applicant) {
				this.setState({applicant: applicant});
			}.bind(this),
			error: function () {
			
			}.bind(this)
		});
	},
	onRowClick: function (id) {
		this.loadApplicant(id);
		this.setState({
			applicantView: 'DETAILS',
			applicantId: id
		});
	},
	onViewChange: function(keyword) {
		console.log(keyword);
		switch(keyword) {
			case 'TABLE':
				this.setState({
					applicantView: undefined,
					applicantId: undefined,
					applicant: undefined,
					applicants: undefined
				});
				this.loadApplicants();
				break;
		}
	},
	onModalChange: function (modal) {
		var self = this;
		this.setState({
			modalMessage: modal,
		});
		$("#ApplicantMessageContainerModal").modal()
			.on('hidden.bs.modal', function (e) {
				self.setState({
					modalMessage: undefined
				});	
			});;
	},
	onApplicantChange: function () {
		console.log('onApplicantChange');
		this.loadApplicant(this.state.applicantId);
	},
	render: function () {
		var view;
		switch(this.state.applicantView) {
			case 'DETAILS':
				view = <ApplicantDetailView 
							applicant={this.state.applicant}
							viewChange={this.onViewChange}
							modalChange={this.onModalChange}/>;
				break;
			default:
				view = 	<ApplicantTableView 
							applicants={this.state.applicants}
							rowClick={this.onRowClick}/>;
				break;
		}
		return (
			<div className="row">
				{ view } 				
				<ApplicantMessageContainerModal 
					applicantChange={this.onApplicantChange}
					applicant={this.state.applicant}
					modalMessage={this.state.modalMessage}/>
			</div>
		);
	}
});

/*=====  End of Applicant Main  ======*/


if(typeof $("#application-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<ApplicantMain />,
	document.getElementById('application-app-node'));
}