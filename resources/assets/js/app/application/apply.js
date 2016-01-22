/*======================================
=            Apply Messages            =
======================================*/

var ApplyMessageContainerModal = React.createClass({
	handleClick: function(e) {
		//console.log(e);
		this.props.buttonClick(e);
	},
	render: function () {
		var modalMessageComponent;
		//console.log(this.props.dialogView);
		switch(this.props.dialogView) {
			case 'VALIDATING': 
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Validating Data
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
			
			case 'SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Saving your Application
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

			case 'SAVED':
				modalMessageComponent = <div className="panel panel-default">
										   	<div className="panel-heading">
										    	Hurray! Your Application has been saved.
										   	</div>
										   	<div className="panel-body">
										   		<p>Thank you for your interest in <strong>Social Enterprise Development Partnerships, Inc.</strong> We appreciate you taking time to fill out our form. To learn more about SEDPI. Please visit our website at <a href="www.sedpi.com">www.sedpi.com</a>.</p>
										   		<p>We hope that you become member soon.</p>
											   	<div className="pull-right">
											   		<button className="btn btn-default" data-dismiss="modal">Close</button>
											   	</div>
										   	</div>
										</div>;
				break;

			case 'NON-MEMBER-DIALOG':
				modalMessageComponent =	<div className="panel panel-default">
										   	<div className="panel-heading">
										    	Finish Application?
										   	</div>
										   	<div className="panel-body">
										   		<div className="form-group">
											   		<p>{"Do you want to finish your application? By clicking continue, the system will save your application as non member. Which means, your application will not process and we will take note that you are interested to become a member. But don't worry, you can anytime if you have decide to be a member."}</p>
											   	</div>
											   	<div className="form-group">
													<div className="pull-right">
													   	<div className="btn-group">
														   	<button className="btn btn-default" data-dismiss="modal">Wait, I change my mind.</button>
														   	<button className="btn btn-primary" onClick={this.handleClick.bind(null, 'SAVE-NON-MEMBER')}>Continue</button>
													   	</div>
												    </div>
											   	</div>
										    </div>
										</div>;		
				break;

			case 'TRAINEE-DIALOG':
				modalMessageComponent =	<div className="panel panel-default">
										   	<div className="panel-heading">
										    	Submit Application?
										   	</div>
										   	<div className="panel-body">
										   		<div className="form-group">
											   		<p>{"Do you want to submit your application?"}</p>
											   	</div>
											   	<div className="form-group">
													<div className="pull-right">
													   	<div className="btn-group">
														   	<button className="btn btn-default" data-dismiss="modal">Wait, I change my mind.</button>
														   	<button className="btn btn-primary" onClick={this.handleClick.bind(null, 'SAVE-TRAINEE')}>Continue</button>
													   	</div>
												    </div>
											   	</div>
										    </div>
										</div>;
				break;
		}
		return (
			<div className="modal fade" id="ApplyMessageContainerModal" role="dialog">
				<div className="modal-dialog" role="document">
					{ modalMessageComponent }
				</div>
			</div>
		);
	}
});

/*=====  End of Apply Messages  ======*/

/*===================================
=            Apply Views            =
===================================*/

var ApplyLandingView = React.createClass({
	getInitialState: function () {	
		var applicantData = this.props.applicantData;
		return {
			firstName: applicantData === undefined ? '' : applicantData.firstName,
			middleName: applicantData === undefined ? '' : applicantData.middleName,
			lastName: applicantData === undefined ? '' : applicantData.lastName,
			email: applicantData === undefined ? '' : applicantData.email,
			tryCounter: 0
		};
	},
	validateApplicantInfo: function (afterValidation) {
		this.props.modalChange('VALIDATING');
		var postData = {
			firstName: this.state.firstName.trim(),
			middleName: this.state.middleName.trim(),
			lastName: this.state.lastName.trim(),
			email: this.state.email.trim()
		};

		this.setState({
			firstName: postData.firstName,
			middleName: postData.middleName,
			lastName: postData.lastName,
			email: postData.email
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validateApplicantInfo',
			type: 'post',
			data: {
				firstName: postData.firstName,
				lastName: postData.lastName,
				email: postData.email
			},
			success: function (response) {
				//console.log(response);
				if(response.status === 'failed')
				{
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});	
					$("#ApplyMessageContainerModal").modal('hide');
				}
				if(response.status === 'success')
				{
					this.props.dataChange(postData, 'applicantData');
					if(afterValidation === 'SAVE')
					{
						this.props.modalChange('NON-MEMBER-DIALOG');
					}
					else if(afterValidation === 'NEXT')
					{
						$("#ApplyMessageContainerModal").modal('hide');
						this.props.mainViewChange('SURVEY');
					}
				}
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
		this.validateApplicantInfo('NEXT');
	},
	handleClick: function (e) {
		this.validateApplicantInfo('SAVE');
	},
	render: function () {
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>SEDPI Membership Application</h1>
						</div>
						<div className="row">
							<div className="col-md-7">
								<form onSubmit={this.handleSubmit}>
									<div className="form-group has-feedback" id="fg-firstName">
										<label className="control-label" htmlFor="input-firstName">First Name *</label>
										<input 
											type="text"
											id="input-firstName"
											className="form-control"
											value={this.state.firstName}
											onChange={this.handleChange.bind(null, 'firstName')}/>
									</div>
									<div className="form-group has-feedback" id="fg-middleName">
										<label>Middle Name</label>
										<input 
											type="text"
											id="input-middleName"
											className="form-control"
											value={this.state.middleName}
											onChange={this.handleChange.bind(null, 'middleName')}/>
									</div>
									<div className="form-group has-feedback" id="fg-lastName">
										<label className="control-label" htmlFor="input-lastName">Last Name *</label>
										<input 
											type="text"
											id="input-lastName"
											className="form-control"
											value={this.state.lastName}
											onChange={this.handleChange.bind(null, 'lastName')}/>
									</div>
									<div className="form-group has-feedback" id="fg-email">
										<label className="control-label" htmlFor="input-email">Email Address *</label>
										<input 
											type="text"
											id="input-email"
											className="form-control"
											value={this.state.email}
											onChange={this.handleChange.bind(null, 'email')}/>
									</div>
									<div className="form-group">
										<div className="pull-right">
											<div className="btn-group">
												<button type="button" id="btn-nonmember-application" className="btn btn-default" onClick={this.handleClick.bind(null, 'validateApplication')}>Not Now</button>
												<button type="submit" id="btn-member-application" className="btn btn-primary">I want to be a member</button>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div className="col-md-5">
								<div className="panel panel-default">
									<div className="panel-body">
										<h3>SEDPI Membership Benefits</h3>
										<ul>
											<li>Receive information on financial literacy and social entrepreneurship.</li>
											<li>Allowed to invest and/or participate in SEDPI investments.</li>
											<li>Receive updates on investment opportunities and updates on the performance of SEDPI investments.</li>
											<li>Receive information on SEDPI training events.</li>
										</ul>
										<h3>SEDPI Membership Requirements</h3>
										<ul>
											<li>Membership fee worth Php 100.00.</li>
											<li>Annual membership fee worth Php 50.00.</li>
											<li>Commit to implement learning from trainings attended.</li>
										</ul>
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

/*----------  Apply Survey View  ----------*/

var ApplySurveyView = React.createClass({
	getInitialState: function () {
		var surveyData = this.props.surveyData;
		return {
			haveAttended : surveyData === undefined ? undefined : surveyData.haveAttended ,
			willAttend : surveyData === undefined ? undefined : surveyData.willAttend,
			trainingType : surveyData === undefined ? undefined : surveyData.trainingType,
			willInvest : surveyData === undefined ? undefined : surveyData.willInvest
		};
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var postData = {
			haveAttended: this.state.haveAttended,
			willAttend: this.state.willAttend,
			trainingType: this.state.trainingType,
			willInvest: this.state.willInvest
		};

		if(this.state.willAttend === 'No' || this.state.willInvest === 'No')
		{
			this.props.modalChange('NON-MEMBER-DIALOG');
		}
		else if(this.state.willAttend === 'Yes')
		{
			this.props.dataChange(postData, 'surveyData');
			this.props.mainViewChange('PERSONAL');
		}
		else if(this.state.willInvest === 'Yes')
		{
			this.props.dataChange(postData, 'surveyData');
			this.props.mainViewChange('TOC');
		}
	},
	handleChange: function (name, e) {
		if(name === 'haveAttended')
		{
			this.setState({
				willAttend: undefined,
				trainingType: undefined,
				willInvest: undefined
			});
		}
		if(name === 'willAttend')
		{
			this.setState({trainingType: undefined});
		}
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	render: function () {
		var radioHaveAttended = <div className="form-group">
											<div className="row">
												<div className="col-md-10 col-md-offset-1">
													<label><span className="glyphicon glyphicon-menu-right"></span> Have you attended SEDPI Financial Literacy Training?</label>
												</div>
											</div>
											<div className="row">
												<div className="col-md-10 col-md-offset-2">
													<input 
														type="radio"
														name="haveAttended"
														value="Yes"
														checked={this.state.haveAttended === 'Yes'}
														onChange={this.handleChange.bind(null, 'haveAttended')}/> Yes, I have attended a SEDPI Financial Literacy Training.
												</div>
												<div className="col-md-10 col-md-offset-2">
													<input 
														type="radio"
														name="haveAttended"
														value="No"
														checked={this.state.haveAttended === 'No'}
														onChange={this.handleChange.bind(null, 'haveAttended')}/> {"No, I haven't attended a SEDPI Financial Literacy Training."}
												</div>
											</div>
										</div>;

		var radioWillAttend = 	<div className="form-group">
											<div className="row">
												<div className="col-md-10 col-md-offset-1">
													<label><span className="glyphicon glyphicon-menu-right"></span> Do you want to attend a SEDPI Financial Literacy Training?</label>
												</div>
											</div>
											<div className="row">
												<div className="col-md-10 col-md-offset-2">
													<input 
														type="radio"
														name="willAttend"
														value="Yes"
														checked={this.state.willAttend === 'Yes'}
														onChange={this.handleChange.bind(null, 'willAttend')}/> Yes, I would love to.
												</div>
												<div className="col-md-10 col-md-offset-2">
													<input 
														type="radio"
														name="willAttend"
														value="No"
														checked={this.state.willAttend=== 'No'}
														onChange={this.handleChange.bind(null, 'willAttend')}/> {"No, I don't want to attend for now."}
												</div>
											</div>		
										</div>;

		var radioTrainingType = <div className="form-group">
											<div className="row">
												<div className="col-md-10 col-md-offset-1">
													<label><span className="glyphicon glyphicon-menu-right"></span> What SEDPI Financial Literacy Training do you want to attend?</label>
												</div>
											</div>
											<div className="row">
												<div className="col-md-10 col-md-offset-2">
													<input 
														type="radio"
														name="trainingType"
														value="Live"
														checked={this.state.trainingType === 'Live'}
														onChange={this.handleChange.bind(null, 'trainingType')}/> Live Financial Literacy Training.
												</div>
												<div className="col-md-10 col-md-offset-2">
													<input 
														type="radio"
														name="trainingType"
														value="Online"
														checked={this.state.trainingType === 'Online'}
														onChange={this.handleChange.bind(null, 'trainingType')}/> Online Financial Literacy Training.
												</div>
											</div>
										</div>;

		var radioWillInvest = 	<div className="form-group">
											<div className="row">
												<div className="col-md-10 col-md-offset-1">
													<label><span className="glyphicon glyphicon-menu-right"></span> Do you want to invest in SEDPI?</label>
												</div>
											</div>
											<div className="row">
												<div className="col-md-10 col-md-offset-2">
													<input 
														type="radio"
														name="willInvest"
														value="Yes"
														checked={this.state.willInvest === 'Yes'}
														onChange={this.handleChange.bind(null, 'willInvest')}/> Yes, I want to invest in SEDPI.
												</div>
												<div className="col-md-10 col-md-offset-2">
													<input 
														type="radio"
														name="willInvest"
														value="No"
														checked={this.state.willInvest === 'No'}
														onChange={this.handleChange.bind(null, 'willInvest')}/> {"No, I don't want to invest for now."}
												</div>
											</div>
										</div>;
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>SEDPI Membership Application</h1>
						</div>
						<div className="row">
							<div className="col-md-10 col-md-offset-1">
								<div className="panel panel-default">
									<div className="panel-body">
										<div className="row">
											<div className="col-md-12">
												<form onSubmit={this.handleSubmit}>
													<div className="form-group">
														<h2>Things we would to know from you</h2>
													</div>
													<div className="row">
														{ radioHaveAttended }
														{ this.state.haveAttended === 'No' ? radioWillAttend : '' }
														{ this.state.haveAttended === 'Yes' ? radioWillInvest : '' }
														{ this.state.willAttend === 'Yes' ? radioTrainingType : '' }
													</div>
													<div className="form-group">
														<div className="pull-right">
															<div className="btn-group">
																<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'APPLICANT')}>Back</button>
																<button 
																	type="submit" 
																	className="btn btn-primary"
																	disabled={this.state.willInvest === undefined && this.state.willAttend !== 'No' && this.state.trainingType === undefined}>{this.state.willAttend === 'No' || this.state.willInvest === 'No' ? 'Finish' : 'Continue'}</button>
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
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Apply TOC View  ----------*/

var ApplyTOCView = React.createClass({
	getInitialState: function () {
		return {
			tocChecked: this.props.tocData === undefined ? false : this.props.tocData.tocChecked 
		};
	},
	handleChange: function (e) {
		if(e === 'tocChecked')
		{
			if($("input[name=isTOCAccepted]").is(':checked'))
				this.setState({tocChecked: true});
			else
				this.setState({tocChecked: false});
		}
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.dataChange({tocChecked: this.state.tocChecked}, 'tocData');
		this.props.mainViewChange('PERSONAL');
	},
	render: function () {
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>SEDPI Membership Application</h1>
						</div>
						<div className="row">
							<div className="col-md-10 col-md-offset-1">
								<form onSubmit={this.handleSubmit}>
									<h2>SEDPI Preferred Shares Dividend Rates</h2>
									<p>The dividend rate for SEDPI Preferred Shares as follows:</p>
									<div className="col-md-12">
										<table className="table table-condensed table-striped table-bordered">
											<thead>
												<tr>
													<th className="text-center">Investment(in pesos)</th>
													<th className="text-center">Dividend Rates</th>
												</tr>
											</thead>
											<tbody>
												<tr className="text-center">
													<td>Php 5,000 to Php 50,000</td>
													<td>3% per Annum</td>
												</tr>
												<tr className="text-center">
													<td>Php 50,001 to Php 250,000</td>
													<td>4% per Annum</td>
												</tr>
												<tr className="text-center">
													<td>Php 250,001 to Php 500,000</td>
													<td>5% per Annum</td>
												</tr>
												<tr className="text-center">
													<td>Php 500,001 ~ </td>
													<td>6% per Annum</td>
												</tr>
											</tbody>
										</table>
										<p className="text-justify">There is a <strong>pre-termination rate of 3%</strong> if the investment is withdrawn before <strong>one (1) year</strong>. The dividends are variable - they could go lower or higher each year and only SEDPI can dictate what the dividend rate is for a specific year.</p>
										<p className="text-justify">As preferred stockholder, you do not have the right to vote and be voted upon in SEDPI. You take the risk and full responsibility in investing in SEDPI. All remittance fees and charges are to your account and SEDPI shall not bear any cost of remittance to your investment.</p>
										<div className="form-group">
											<input 
												type="checkbox"
												checked = {this.state.tocChecked}
												name="isTOCAccepted"
												onChange={this.handleChange.bind(null, 'tocChecked')}/> I have read and accept the Terms and Conditions.
										</div>
									</div>
									<div className="form-group">
										<div className="pull-right">
											<div className="btn-group">
												<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'SURVEY')}>Back</button>
												<button type="submit" className="btn btn-primary" disabled={!(this.state.tocChecked)}>Continue</button>
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

/*----------  Apply Personal View  ----------*/

var ApplyPersonalView = React.createClass({
	getInitialState: function () {
		var applicantData = this.props.applicantData;
		var personalData = this.props.personalData;
		return {
			firstName: personalData === undefined ? applicantData.firstName : personalData.firstName,
			middleName: personalData === undefined ? applicantData.middleName : personalData.middleName,
			lastName: personalData === undefined ? applicantData.lastName : personalData.lastName,
			sex: personalData === undefined ? '' : personalData.sex,
			birthDate: personalData === undefined ? '' : personalData.birthDate,
			birthPlace: personalData === undefined ? '' : personalData.birthPlace,
			civilStatus: personalData === undefined ? '' : personalData.civilStatus,
			otherCivilStatus: personalData === undefined ? '' : personalData.otherCivilStatus,
			spouseName: personalData === undefined ? '' : personalData.spouseName,
			nationality: personalData === undefined ? '' : personalData.nationality,
			occupation: personalData === undefined ? '' : personalData.occupation,
			sssGsis: personalData === undefined ? '' : personalData.sssGsis,
			tin: personalData === undefined ? '' : personalData.tin,
			annualIncome: personalData === undefined ? '' : personalData.annualIncome
		};
	},
	componentDidMount: function () {
		var that = this;
		$("#datetimepicker-birth-date").datetimepicker({
		    format: "MM/DD/YYYY",
		    maxDate: moment(),
		    useCurrent: false,

		}).on('dp.change', function(event) {
			that.setState({
				birthDate: moment(event.date).format('MM/DD/YYYY')
			});
			console.log('%cinput state changed: birthDate' + ' : ' + that.state.birthDate, 'color: aqua');
		});
	},
	validatePersonalInfo: function () {
		this.props.modalChange('VALIDATING');
		var postData = {
			firstName: this.state.firstName.trim(),
			middleName: this.state.middleName.trim(),
			lastName: this.state.lastName.trim(),
			sex: this.state.sex,
			birthDate: this.state.birthDate,
			birthPlace: this.state.birthPlace.trim(),
			civilStatus: this.state.civilStatus,
			otherCivilStatus:  this.state.otherCivilStatus.trim(),
			spouseName: this.state.spouseName.trim(),
			nationality: this.state.nationality.trim(),
			occupation: this.state.occupation.trim(),
			sssGsis: this.state.sssGsis.trim(),
			tin: this.state.tin.trim(),
			annualIncome: this.state.annualIncome
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validatePersonalInfo',
			type: 'POST',
			data: {
				firstName: postData.firstName,
				lastName: postData.lastName,
				sex: postData.sex,
				birthDate: postData.birthDate,
				civilStatus: postData.civilStatus,
				otherCivilStatus: postData.otherCivilStatus,
				annualIncome: postData.annualIncome
			},
			success: function (response) {
				console.log(response.status);
				$("#ApplyMessageContainerModal").modal('hide');
				if(response.status === 'failed')
				{
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});
				}
				else if(response.status === 'success')
				{
					this.props.dataChange(postData, 'personalData');
					this.props.dataChange({
						firstName: postData.firstName,
						middleName: postData.middleName,
						lastName: postData.lastName,
						email: this.props.applicantData.email
					}, 'applicantData');
					this.props.mainViewChange('CONTACT');
				}
			}.bind(this)
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
		console.log(e.target.value);
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.validatePersonalInfo();
	},
	render: function () {
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>SEDPI Membership Application</h1>
						</div>
						<div className="row">
							<div className="col-md-3">
								<ul className="nav nav-pills nav-stacked">
									<li className="active"><a>Personal Information</a></li>
									<li><a>Contact Information</a></li>
									{this.props.surveyData.willInvest === 'Yes' ? 
										<li><a>Investment Information</a></li> : null}
									{this.props.surveyData.willInvest === 'Yes' ? 
										<li><a>Beneficiary Information</a></li> : null}
								</ul>
							</div>
							<div className="col-md-9">
								<div className="panel panel-default">
									<div className="panel-heading">
										Personal Information
										<div className="pull-right">
											<p className="text-right"><i>1 of {this.props.surveyData.willAttend === 'Yes' ? '2' : '4'}</i></p>
										</div>	
									</div>
									<div className="panel-body">
										<div className="row">
											<div className="col-md-12">
												<form onSubmit={this.handleSubmit}>
													<div className="form-group">
														<label>Member Name</label>
														<div className="row">
															<div className="col-md-4">
																<div className="form-group has-feedback" id="fg-firstName">
																	<input
																		type="text"
																		id="input-firstName"
																		className="form-control"
																		placeholder="First Name *"
																		value={this.state.firstName}
																		onChange={this.handleChange.bind(null, 'firstName')}/>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group has-feedback">
																	<input
																		type="text"
																		className="form-control"
																		placeholder="Middle Name"
																		value={this.state.middleName}
																		onChange={this.handleChange.bind(null, 'middleName')}/>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group has-feedback" id="fg-lastName">
																	<input
																		type="text"
																		id="input-lastName"
																		className="form-control"
																		placeholder="Last Name *"
																		value={this.state.lastName}
																		onChange={this.handleChange.bind(null, 'lastName')}/>
																</div>
															</div>
														</div>
														<div className="row">
															<div className="col-md-4">
																<div className="form-group has-feedback" id="fg-sex">
																	<label className="control-label" htmlFor="input-sex">Sex *</label>
																	<select
																		className="form-control"
																		id="input-sex"
																		value={this.state.sex}
																		onChange={this.handleChange.bind(null, 'sex')}>
																		<option value="" disabled={true}>Please choose...</option>
																		<option value="male">Male</option>
																		<option value="female">Female</option>
																	</select>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group has-feedback" id="fg-birthDate">
																	<label className="control-label" htmlFor="input-birthDate">Birth Date *</label>
																	<div className="input-group date" id="datetimepicker-birth-date">
																		<input 
																			type="text" 
																			id="input-birthDate"
																			className="form-control" 
																			size="16"
																			placeholder="mm/dd/yyyy"
																			value={this.state.birthDate}
																			onChange={this.handleChange.bind(null, 'birthDate')}/>
																		<span className="input-group-addon">
																			<span className="glyphicon glyphicon-calendar"></span>
																		</span>
																	</div>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group">
																	<label>Birth Place</label>
																	<input 
																		type="text"
																		className="form-control"
																		value={this.state.birthPlace}
																		onChange={this.handleChange.bind(null, 'birthPlace')}/>
																</div>
															</div>
														</div>
														<div className="row">
															<div className="col-md-4">
																<div className="form-group has-feedback" id="fg-civilStatus">
																	<label className="control-label" htmlFor="input-civilStatus">Civil Status *</label>
																	<select
																		className="form-control"
																		id="input-civilStatus"
																		value={this.state.civilStatus}
																		onChange={this.handleChange.bind(null, 'civilStatus')}>
																		<option value="" disabled={true}>Please choose...</option>
																		<option value="single">Single</option>
																		<option value="married">Married</option>
																		<option value="annulled">Annulled</option>
																		<option value="divorced">Divorced</option>
																		<option value="widowed">Widowed</option>
																		<option value="others">Others</option>
																	</select>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group has-feedback" id="fg-otherCivilStatus">
																	<label className="control-label" htmlFor="input-otherCivilStatus">If Others,</label>
																	<input
																		type="text"
																		id="input-otherCivilStatus"
																		className="form-control"
																		placeholder="Please specify..."
																		value={this.state.civilStatus === 'others' ? this.state.otherCivilStatus : ''}
																		disabled={this.state.civilStatus !== 'others'}
																		onChange={this.handleChange.bind(null, 'otherCivilStatus')}/>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group">
																	<label>Spouse Name</label>
																	<input
																		type="text"
																		className="form-control"
																		value={this.state.civilStatus === 'married' ? this.state.spouseName : ''}
																		disabled={this.state.civilStatus !== 'married'}
																		onChange={this.handleChange.bind(null, 'spouseName')}/>
																</div>
															</div>
														</div>
														<div className="row">
															<div className="col-md-4">
																<div className="form-group">
																	<label>Nationality</label>
																	<input
																		type="text"
																		className="form-control"
																		value={this.state.nationality}
																		onChange={this.handleChange.bind(null, 'nationality')}/>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group">
																	<label>Occupation</label>
																	<input
																		type="text"
																		className="form-control"
																		value={this.state.occupation}
																		onChange={this.handleChange.bind(null, 'occupation')}/>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group">
																	<label>TIN</label>
																	<input
																		type="text"
																		className="form-control"
																		value={this.state.tin}
																		onChange={this.handleChange.bind(null, 'tin')}/>
																</div>
															</div>
														</div>
														<div className="row">
															<div className="col-md-4">
																<div className="form-group">
																	<label>SSS/GSIS</label>
																	<input
																		type="text"
																		className="form-control"
																		value={this.state.sssGsis}
																		onChange={this.handleChange.bind(null, 'sssGsis')}/>
																</div>
															</div>
															<div className="col-md-4">
																<div className="form-group has-feedback" id="fg-annualIncome">
																	<label className="control-label" htmlFor="input-annualIncome">Annual Income *</label>
																	<select
																		className="form-control"
																		id="input-annualIncome"
																		value={this.state.annualIncome}
																		onChange={this.handleChange.bind(null, 'annualIncome')}>
																		<option value="" disabled={true}>Please choose...</option>
																		<option value="1">Over Php 5 million</option>
																		<option value="2">Php 1 Million to Php 5 Million</option>
																		<option value="3">Php 500,000 to Php 1 Million</option>
																		<option value="4">Php 300,000 to Php 500,000</option>
																		<option value="5">Below Php 300,000</option>
																	</select>
																</div>
															</div>
														</div>
													</div>
													<div className="form-group">
														<div className="pull-right">
															<div className="btn-group">
																<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'SURVEY')}>Back</button>
																<button type="submit" className="btn btn-primary">Next</button>
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
					</div>
				</div>
			</div>	
		);
	}
});

/*----------  Apply Contact View  ----------*/

var ApplyContactView = React.createClass({
	getInitialState: function () {
		var applicantData = this.props.applicantData;
		var contactData = this.props.contactData;
		return {
			countries: undefined,
			sameChecked: contactData === undefined ? false : contactData.sameChecked,  
			presentAddress: contactData === undefined ? '' : contactData.presentAddress,
			presentCountry: contactData === undefined ? '' : contactData.presentCountry,
			permanentAddress: contactData === undefined ? '' : contactData.permanentAddress,
			permanentCountry: contactData === undefined ? '' : contactData.permanentCountry,
			mailingAddress: contactData === undefined ? '' : contactData.mailingAddress,
			mobile: contactData === undefined ? '' : contactData.mobile,
			email: contactData === undefined ? applicantData.email : contactData.email
		};
	},
	componentWillMount: function () {
		this.getCountryOptions();
	},
	getCountryOptions: function () {
		$.ajax({
			url: '/api/utilities/getCountryList',
			type: 'POST',
			cache: false,
			dataType: 'json',
			success: function (countries) {
				this.setState({countries: countries});
			}.bind(this)
		});
	},
	validateContactInfo: function () {
		var postData = {
			presentAddress: this.state.presentAddress.trim(),
			presentCountry: this.state.presentCountry,
			permanentAddress: this.state.sameChecked ? this.state.presentAddress.trim() : this.state.permanentAddress.trim(),
			permanentCountry: this.state.sameChecked ? this.state.presentCountry : this.state.permanentCountry,
			mailingAddress: this.state.sameChecked ? 'present' : this.state.mailingAddress,
			mobile: this.state.mobile.trim(),
			email: this.state.email.trim(),
			sameChecked: this.state.sameChecked
		};

		this.setState({
			presentAddress: postData.presentAddress,
			permanentAddress: postData.permanentAddress,
			mobile: postData.mobile,
			email: postData.email
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validateContactInfo',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if(response.status === 'failed')
				{
					$("#ApplyMessageContainerModal").modal('hide');
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});
				}
				else if(response.status === 'success')
				{
					this.props.dataChange(postData, 'contactData');
					this.props.dataChange({
						firstName: postData.firstName,
						middleName: postData.middleName,
						lastName: postData.lastName,
						email: this.props.applicantData.email
					}, 'applicantData');
					if(this.props.surveyData.willAttend === 'Yes')
					{
						this.props.modalChange('TRAINEE-DIALOG');
					}
					else if( this.props.surveyData.willInvest === 'Yes')
					{
						this.props.mainViewChange('INVESTMENT');
						$("#ApplyMessageContainerModal").modal('hide');
					}
				}
			}.bind(this)
		});
	},
	handleClick: function (event) {
		if(event === 'sameChecked')
		{
			if($("input[name=isSameAsPresentAddress]").is(':checked'))
				this.setState({sameChecked: true});
			else
				this.setState({sameChecked: false});
		}
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
		
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.modalChange('VALIDATING');
		this.validateContactInfo();
	},
	render: function () {
		var countryOptions;
		if(this.state.countries !== undefined)
		{
			var counter = 0;
			countryOptions = $.map(this.state.countries, function (country, index) {
				return <option key={++counter} value={index}>{country}</option>;
			}.bind(this));
		}
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>SEDPI Membership Application</h1>
						</div>
						<div className="row">
							<div className="col-md-3">
								<ul className="nav nav-pills nav-stacked">
									<li className="done"><a>Personal Information <i className="fa fa-check-circle fa-fw"></i></a></li>
									<li className="active"><a>Contact Information</a></li>
									{this.props.surveyData.willInvest === 'Yes' ? 
										<li><a>Investment Information</a></li> : null}
									{this.props.surveyData.willInvest === 'Yes' ? 
										<li><a>Beneficiary Information</a></li> : null}
								</ul>
							</div>
							<div className="col-md-9">
								<div className="panel panel-default">
									<div className="panel-heading">
										Contact Information
										<div className="pull-right">
											<p className="text-right"><i>1 of {this.props.surveyData.willAttend === 'Yes' ? '2' : '4'}</i></p>
										</div>	
									</div>
									<div className="panel-body">
										<div className="row">
											<div className="col-md-12">
												<form onSubmit={this.handleSubmit}>
													<div className="row">
														<div className="col-md-8">
															<div className="form-group has-feedback" id="fg-presentAddress">
																<label className="control-label" htmlFor="input-presentAddress">Present Address *</label>
																<input 
																	type="text"
																	id="input-presentAddress"
																	className="form-control"
																	value={this.state.presentAddress}
																	onChange={this.handleChange.bind(null, 'presentAddress')}/>
															</div>
														</div>
														<div className="col-md-4">
															<div className="form-group has-feedback" id="fg-presentCountry">
																<label className="control-label" htmlFor="input-presentCountry">Present Country *</label>
																<select
																	id="input-presentCountry"
																	className="form-control"
																	value={this.state.presentCountry}
																	onChange={this.handleChange.bind(null, 'presentCountry')}>
																	<option value="" disabled={true}>Please select...</option>
																	{ countryOptions }
																</select>
															</div>
														</div>
														<div className="col-md-12">
															<div className="form-group">
																<input
																	type="checkbox" 
																	name="isSameAsPresentAddress"
																	onClick={this.handleClick.bind(null, 'sameChecked')}/> Same as Present Address
															</div>
														</div>
														<div className="col-md-8">
															<div className="form-group has-feedback" id="fg-permanentAddress">
																<label className="control-label" htmlFor="input-permanentAddress">Permanent Address *</label>
																<input 
																	type="text"
																	id="input-permanentAddress"
																	className="form-control"
																	value={this.state.sameChecked ? this.state.presentAddress : this.state.permanentAddress}
																	disabled={this.state.sameChecked}
																	onChange={this.handleChange.bind(null, 'permanentAddress')}/>
															</div>
														</div>
														<div className="col-md-4">
															<div className="form-group has-feedback" id="fg-permanentCountry">
																<label className="control-label" htmlFor="input-permanentCountry">Permanent Country *</label>
																<select
																	className="form-control"
																	id="input-permanentCountry"
																	value={this.state.sameChecked ? this.state.presentCountry : this.state.permanentCountry}
																	disabled={this.state.sameChecked}
																	onChange={this.handleChange.bind(null, 'permanentCountry')}>
																	<option value="" disabled={true}>Please select...</option>
																	{ countryOptions }
																</select>
															</div>
														</div>
														<div className="col-md-4">
															<div className="form-group has-feedback" id="fg-mailingAddress">
																<label className="control-label" htmlFor="input-mailingAddress">Mailing Address *</label>
																<select
																	className="form-control"
																	id="input-mailingAddress"
																	value={this.state.sameChecked ? 'present' : this.state.mailingAddress}
																	disabled={this.state.sameChecked}
																	onChange={this.handleChange.bind(null, 'mailingAddress')}>
																	<option value="" disabled={true}>Please select...</option>
																	<option value="present">Present Address</option>
																	<option value="permanent">Permanent Address</option>
																</select>
															</div>
														</div>
														<div className="col-md-4">
															<div className="form-group has-feedback" id="fg-mobile">
																<label className="control-label" htmlFor="input-mobile">Mobile *</label>
																<input
																	type="text"
																	id="input-mobile"
																	className="form-control"
																	value={this.state.mobile}
																	placeholder="+639XXXXXXXXX"
																	onChange={this.handleChange.bind(null, 'mobile')}/>
															</div>
														</div>
														<div className="col-md-4">
															<div className="form-group has-feedback" id="fg-email">
																<label className="control-label" htmlFor="input-email">Email Address *</label>
																<input
																	type="text"
																	id="input-email"
																	className="form-control"
																	value={this.state.email}
																	onChange={this.handleChange.bind(null, 'email')}/>
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-md-12">
															<div className="form-group">
																<div className="pull-right">
																	<div className="btn-group">
																		<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'PERSONAL')}>Back</button>
																		<button type="submit" className="btn btn-primary">{this.props.surveyData.willInvest === 'Yes' ? "Next": "Submit"}</button>
																	</div>
																</div>
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
					</div>
				</div>
			</div>
		);
	}
});

/*----------  Apply Investment View  ----------*/

var ApplyInvestmentView = React.createClass({
	getInitialState: function () {
		var investmentData = this.props.investmentData;
		return {
			amountInvested: investmentData === undefined ? '' : investmentData.amountInvested,
			investmentDate: investmentData === undefined ? moment().format('MM/DD/YYYY') : moment(investmentData.investmentDate).format('MM/DD/YYYY'),
			sourceOfFunds: '',
			fundSalary: false,
			fundRetirement: false,
			fundBusiness: false,
			fundInvestment: false,
			fundOthers: false
		};
	},
	componentDidMount: function () {
		var that = this;
		$("#datetimepicker-investment-date").datetimepicker({
		    format: "MM/DD/YYYY",
		    minDate: moment(),
		    useCurrent: true,

		}).on('dp.change', function(event) {
			that.setState({
				investmentDate: moment(event.date).format('MM/DD/YYYY')
			});
			console.log('%cinput state changed: investmentDate' + ' : ' + that.state.investmentDate, 'color: aqua');
		});
	},
	validateInvestmentInfo: function () {
		var sourceOfFunds = [];
		if(this.state.fundSalary)
			sourceOfFunds.push('Salary');
		if(this.state.fundRetirement)
			sourceOfFunds.push('Retirement');
		if(this.state.fundBusiness)
			sourceOfFunds.push('Business');
		if(this.state.fundInvestment)
			sourceOfFunds.push('Investment');
		if(this.state.fundOthers)
			sourceOfFunds.push('Others');

		var postData = {
			amountInvested: this.state.amountInvested.trim(),
			investmentDate: this.state.investmentDate.trim(),
			sourceOfFunds: sourceOfFunds.toString()
		};

		this.setState({
			amountInvested: postData.amountInvested,
			investmentDate: this.state.investmentDate
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validateInvestmentInfo',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				$("#ApplyMessageContainerModal").modal('hide');
				if(response.status === 'failed')
				{
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});
				}
				else if (response.status === 'success')
				{
					this.props.dataChange(postData, 'investmentData');
					this.props.mainViewChange('BENEFICIARY');
				}
			}.bind(this)
		});
	},
	handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	sourceOfFundsChange: function (e) {
		switch(e) {
			case 'fundSalary':
				if($("input[name=fundSalary]").is(':checked'))
					this.setState({fundSalary: true});
				else
					this.setState({fundSalary: false});
				break;

			case 'fundRetirement':
				if($("input[name=fundRetirement]").is(':checked'))
					this.setState({fundRetirement: true});
				else
					this.setState({fundRetirement: false});
				break;

			case 'fundBusiness':
				if($("input[name=fundBusiness]").is(':checked'))
					this.setState({fundBusiness: true});
				else
					this.setState({fundBusiness: false});
				break;

			case 'fundInvestment':
				if($("input[name=fundInvestment]").is(':checked'))
					this.setState({fundInvestment: true});
				else
					this.setState({fundInvestment: false});
				break;
			
			case 'fundOthers':
				if($("input[name=fundOthers]").is(':checked'))
					this.setState({fundOthers: true});
				else
					this.setState({fundOthers: false});
				break;
		}
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.modalChange('VALIDATING');
		this.validateInvestmentInfo();
	},
	render: function () {
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>SEDPI Membership Application</h1>
						</div>
						<div className="row">
							<div className="col-md-3">
								<ul className="nav nav-pills nav-stacked">
									<li className="done"><a>Personal Information <i className="fa fa-check-circle fa-fw"></i></a></li>
									<li className="done"><a>Contact Information <i className="fa fa-check-circle fa-fw"></i></a></li>
									<li className="active"><a>Investment Information</a></li>
									<li><a>Beneficiary Information</a></li>
								</ul>
							</div>
							<div className="col-md-9">
								<div className="panel panel-default">
									<div className="panel-heading">
										Investment Information
										<div className="pull-right">
											<p className="text-right"><i>1 of {this.props.surveyData.willAttend === 'Yes' ? '2' : '4'}</i></p>
										</div>	
									</div>
									<div className="panel-body">
										<form onSubmit={this.handleSubmit}>
											<div className="row">
												<div className="col-md-6">
													<div className="form-group has-feedback" id="fg-amountInvested">
														<label className="control-label" htmlFor="input-amountInvested">Amount to be Invested *</label>
														<input
															type="text"
															id="input-amountInvested"
															className="form-control"
															placeholder="0.00"
															value={this.state.amountInvested}
															onChange={this.handleChange.bind(null, 'amountInvested')}/>
													</div>
													<div className="form-group has-feedback" id="fg-investmentDate">
														<label className="control-label" htmlFor="input-investmentDate">When do you intended to Invest *</label>
														<div className="input-group date" id="datetimepicker-investment-date">
															<input 
																type="text" 
																id="input-investmentDate"
																className="form-control" 
																size="16"
																value={this.state.investmentDate}
																onChange={this.handleChange.bind(null, 'investmentDate')}
																placeholder="mm/dd/yyyy"/>
															<span className="input-group-addon">
																<span className="glyphicon glyphicon-calendar"></span>
															</span>
														</div>
													</div>
												</div>
												<div className="col-md-6">
													<div className="form-group has-feedback" id="fg-sourceOfFunds">
														<label className="control-label" htmlFor="input-sourceOfFunds">Source of Funds * <small>(multiple answers)</small></label>
														<div className="panel panel-default" id="input-sourceOfFunds">
															<div className="panel-body">
																<div className="form-group">
																	<input 
																		type="checkbox"
																		name="fundSalary"
																		checked={this.state.fundSalary}
																		onChange={this.sourceOfFundsChange.bind(null, 'fundSalary')}/> Salary
																</div>
																<div className="form-group">
																	<input 
																		type="checkbox"
																		name="fundRetirement"
																		checked={this.state.fundRetirement}
																		onChange={this.sourceOfFundsChange.bind(null, 'fundRetirement')}/> Retirement
																</div>
																<div className="form-group">
																	<input 
																		type="checkbox"
																		name="fundBusiness"
																		checked={this.state.fundBusiness}
																		onChange={this.sourceOfFundsChange.bind(null, 'fundBusiness')}/> Business
																</div>
																<div className="form-group">
																	<input 
																		type="checkbox"
																		name="fundInvestment"
																		checked={this.state.fundInvestment}
																		onChange={this.sourceOfFundsChange.bind(null, 'fundInvestment')}/> Investment
																</div>
																<div className="form-group">
																	<input 
																		type="checkbox"
																		name="fundOthers"
																		checked={this.state.fundOthers}
																		onChange={this.sourceOfFundsChange.bind(null, 'fundOthers')}/> Others
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-12">
													<div className="form-group">
														<div className="pull-right">
															<div className="btn-group">
																<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'CONTACT')}>Back</button>
																<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'BENEFICIARY')}>Skip</button>
																<button type="submit" className="btn btn-primary">Next</button>
															</div>
														</div>
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
			</div>
		);
	}
});

/*----------  Apply Beneficiary View  ----------*/

var ApplyBeneficiaryView = React.createClass({
	getInitialState: function () {
		return {
			b1Name: '',
			b1BirthDate: '',
			b1Address: '',
			b1Relationship: '',
			b2Name: '',
			b2BirthDate: '',
			b2Address: '',
			b2Relationship: ''
		};
	},
	componentDidMount: function () {
		var that = this;
		$("#datetimepicker-b1BirthDate").datetimepicker({
		    format: "MM/DD/YYYY",
		    maxDate: moment(),
		    useCurrent: false,

		}).on('dp.change', function(event) {
			that.setState({
				b1BirthDate: moment(event.date).format('MM/DD/YYYY')
			});
			console.log('%cinput state changed: birthDate' + ' : ' + that.state.b1BirthDate, 'color: aqua');
		});

		$("#datetimepicker-b2BirthDate").datetimepicker({
		    format: "MM/DD/YYYY",
		    maxDate: moment(),
		    useCurrent: false,

		}).on('dp.change', function(event) {
			that.setState({
				b2BirthDate: moment(event.date).format('MM/DD/YYYY')
			});
			console.log('%cinput state changed: birthDate' + ' : ' + that.state.b2BirthDate, 'color: aqua');
		});
	},
	validateBeneficiaryInfo: function () {
		var postData = {
			b1Name: this.state.b1Name.trim(),
			b1BirthDate: this.state.b1BirthDate.trim(),
			b1Address: this.state.b1Address.trim(),
			b1Relationship: this.state.b1Relationship.trim(),
			b2Name: this.state.b2Name.trim(),
			b2BirthDate: this.state.b2BirthDate.trim(),
			b2Address: this.state.b2Address.trim(),
			b2Relationship: this.state.b2Relationship.trim()
		};

		this.setState({
			b1Name: postData.b1Name,
			b1BirthDate: postData.b1BirthDate,
			b1Address: postData.b1Address,
			b1Relationship: postData.b1Relationship,
			b2Name: postData.b2Name.trim(),
			b2BirthDate: postData.b2BirthDate,
			b2Address: postData.b2Address,
			b2Relationship: postData.b2Relationship
		});

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		$.ajax({
			url: '/api/application/validateBeneficiaryInfo',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				$("#ApplyMessageContainerModal").modal('hide');
				if(response.status === 'failed')
				{
					$.each(response.errors, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({trigger: 'hover', content: value, placement: 'top'});
					});
				}
				else if(response.status === 'success')
				{
					this.props.dataChange(postData, 'beneficiaryData');
					this.props.mainViewChange('INSTRUCTION');
				}
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
		this.props.modalChange('VALIDATING');
		this.validateBeneficiaryInfo();
	},
	render: function () {
		return (
			<div className="col-md-10 col-md-offset-1">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>SEDPI Membership Application</h1>
						</div>
						<div className="row">
							<div className="col-md-3">
								<ul className="nav nav-pills nav-stacked">
									<li className="done"><a>Personal Information <i className="fa fa-check-circle fa-fw"></i></a></li>
									<li className="done"><a>Contact Information <i className="fa fa-check-circle fa-fw"></i></a></li>
									<li className="done"><a>Investment Information <i className="fa fa-check-circle fa-fw"></i></a></li>
									<li className="active"><a>Beneficiary Information</a></li>
								</ul>
							</div>
							<div className="col-md-9">
								<div className="panel panel-default">
									<div className="panel-heading">
										Beneficiary Information
										<div className="pull-right">
											<p className="text-right"><i>1 of {this.props.surveyData.willAttend === 'Yes' ? '2' : '4'}</i></p>
										</div>	
									</div>
									<div className="panel-body">
										<form onSubmit={this.handleSubmit}>
											<div className="row">
												<div className="col-md-6">
													<div className="form-group">
														<h4>Beneficiary 1</h4>
													</div>
													<div className="form-group">
														<label>Complete Name</label>
														<input
															type="text"
															className="form-control"
															value={this.state.b1Name}
															onChange={this.handleChange.bind(null, 'b1Name')}/>
													</div>
													<div className="form-group has-feedback" id="fg-b1BirthDate">
														<label className="control-label" htmlFor="input-b1BirthDate">Birth Date</label>
														<div className="input-group date" id="datetimepicker-b1BirthDate">
															<input 
																type="text" 
																id="input-b1BirthDate"
																className="form-control" 
																size="16"
																value={this.state.b1BirthDate}
																onChange={this.handleChange.bind(null, 'b1BirthDate')}
																placeholder="mm/dd/yyyy"/>
															<span className="input-group-addon">
																<span className="glyphicon glyphicon-calendar"></span>
															</span>
														</div>
													</div>
													<div className="form-group has-feedback" id="fg-b1Address">
														<label className="control-label" htmlFor="input-b1Address">Address</label>
														<input
															type="text"
															id="input-b1Address"
															className="form-control"
															value={this.state.b1Address}
															onChange={this.handleChange.bind(null, 'b1Address')}/>
													</div>
													<div className="form-group has-feedback" id="fg-b1Relationship">
														<label className="control-label" htmlFor="input-b1Relationship">Relationship</label>
														<input
															type="text"
															className="form-control"
															id="input-b1Relationship"
															value={this.state.b1Relationship}
															onChange={this.handleChange.bind(null, 'b1Relationship')}/>
													</div>
												</div>
												<div className="col-md-6">
													<div className="form-group">
														<h4>Beneficiary 2</h4>
													</div>
													<div className="form-group">
														<label>Complete Name</label>
														<input
															type="text"
															className="form-control"
															value={this.state.b2Name}
															onChange={this.handleChange.bind(null, 'b2Name')}/>
													</div>
													<div className="form-group has-feedback" id="fg-b2BirthDate">
														<label className="control-label" htmlFor="input-b2BirthDate">Birth Date</label>
														<div className="input-group date" id="datetimepicker-b2BirthDate">
															<input 
																type="text" 
																id="input-b2BirthDate"
																className="form-control" 
																size="16"
																value={this.state.b2BirthDate}
																onChange={this.handleChange.bind(null, 'b2BirthDate')}
																placeholder="mm/dd/yyyy"/>
															<span className="input-group-addon">
																<span className="glyphicon glyphicon-calendar"></span>
															</span>
														</div>
													</div>
													<div className="form-group has-feedback" id="fg-b2Address">
														<label className="control-label" htmlFor="input-b2Address">Address</label>
														<input
															type="text"
															id="input-b1Address"
															className="form-control"
															value={this.state.b2Address}
															onChange={this.handleChange.bind(null, 'b2Address')}/>
													</div>
													<div className="form-group has-feedback" id="fg-b2Relationship">
														<label className="control-label" htmlFor="input-b2Relationship">Relationship</label>
														<input
															type="text"
															className="form-control"
															id="input-b2Relationship"
															value={this.state.b2Relationship}
															onChange={this.handleChange.bind(null, 'b2Relationship')}/>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-12">
													<div className="form-group">
														<div className="pull-right">
															<div className="btn-group">
																<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'INVESTMENT')}>Back</button>
																<button type="button" className="btn btn-default" onClick={this.props.mainViewChange.bind(null, 'INSTRUCTION')}>Skip</button>
																<button type="submit" className="btn btn-primary">Next</button>
															</div>
														</div>
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
			</div>
		);
	}
});

/*----------  Apply Instruction View  ----------*/

var ApplyInstructionView = React.createClass({
	render: function () {
		var view;
		if(this.props.applicationSent)
		{
			view = 	<div className="text-center">
						Your Application has been Saved.
					</div>;
		}
		else
		{
			view = 	<div className="text-center">
						<div className="form-group">
							<div className="btn-group">
								<button type="button" className="btn btn-primary btn-lg" onClick={this.props.buttonClick.bind(null, 'SAVE-INVESTOR')}>Submit my Application</button>
							</div>
						</div>
						<div className="form-group">
							<a className="clickable-row"><h5>Reset Application</h5></a>
						</div>
					</div>;
		}
		return (
			<div className="col-md-8 col-md-offset-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<div className="page-header">
							<h1>SEDPI Membership Application</h1>
						</div>
						<div className="row">
							<div className="col-md-10 col-md-offset-1">
								<h2>{"We're almost done. Just one more step."}</h2>
								<p className="text-justify">After you submit your application, you may remit your deposit to SDFI through any means available to you such as bank transfers, money transfer operators such as Western Union, wire transfers and many others. The table below shows the information you need to be able to remit your investment.</p>
								<div className="col-md-10 col-md-offset-1">
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
								</div>
								<div className="col-md-12">
									<p className="text-justify">Kindly email us the remittance receipt at <a href="mailto:info@sedpi.com" target="_top">info@sedpi.com</a> so we can verify and validate this with our bank account. Keep the remittance receipt as proof of record for your security and protection.</p>
									<p className="text-justify">Once we receive your remittance, we will send you a scanned copy of your official receipt and stock certificate, which will serve as proof of your investment. Kindly inform us if you want us to send a hard copy of said documents. If delivery address is within the Philippines, SDFI will shoulder the courier costs. If delivery address is outside the Philippines, we will deduct the courier costs from your investment. You may also choose to allow us to safe keep your documents, which you may get from us when you go home to the Philippines.</p>
								</div>
								<div className="col-md-12">
									{ view }
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Apply Views  ======*/

/*==================================
=            Apply Main            =
==================================*/

var ApplyMain = React.createClass({
	getInitialState: function () {
		return {
			mainView: undefined,
			dialogView: undefined,
			applicantData: undefined,
			surveyData: undefined,
			tocData: undefined,
			personalData: undefined,
			contactData: undefined,
			investmentData: undefined,
			beneficiaryData: undefined,
			applicationSent: false
		};
	},
	saveNonMember: function () {
		this.onModalChange('SAVING');
		$.ajax({
			url: '/api/application/saveNonMember',
			type: 'POST',
			data: this.state.applicantData,
			success: function (response) {
				console.log(response);
				if(response.status === 'success')
				{
					//$("#ApplyMessageContainerModal").modal('hide');
					this.onModalChange('SAVED');
				}
			}.bind(this)
		});
	},
	saveTraineeMember: function () {
		this.onModalChange('SAVING');
		
		var postData = {};
		var surveyData = this.state.surveyData;
		var personalData = this.state.personalData;
		var contactData = this.state.contactData;
		
		for (var propName in surveyData) { postData[propName] = surveyData[propName]; }
		for (var propName in personalData) { postData[propName] = personalData[propName]; }
		for (var propName in contactData) { postData[propName] = contactData[propName]; }

		console.log(postData);

		$.ajax({
			url: '/api/application/saveTraineeMember',
			type: 'POST',
			data: postData,
			success: function (response) {
				console.log(response.status);
				if(response.status === 'success')
				{
					this.onModalChange('SAVED');
				}
			}.bind(this)
		});
	},
	saveInvestorMember: function () {
		this.onModalChange('SAVING');

		var postData = {};
		var surveyData = this.state.surveyData;
		var personalData = this.state.personalData;
		var contactData = this.state.contactData;
		var investmentData = this.state.investmentData;
		var beneficiaryData = this.state.beneficiaryData;

		for (var propName in surveyData) { postData[propName] = surveyData[propName]; }
		for (var propName in personalData) { postData[propName] = personalData[propName]; }
		for (var propName in contactData) { postData[propName] = contactData[propName]; }
		for (var propName in investmentData) { postData[propName] = investmentData[propName]; }
		for (var propName in beneficiaryData) { postData[propName] = beneficiaryData[propName]; }

		console.log(postData);

		$.ajax({
			url: '/api/application/saveInvestorMember',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.onModalChange('INVESTOR-SAVED');
				this.setState({
					applicantData: undefined,
					surveyData: undefined,
					tocData: undefined,
					personalData: undefined,
					contactData: undefined,
					investmentData: undefined,
					beneficiaryData: undefined,
					applicationSent: true
				});

			}.bind(this)
		});

	},
	onMainViewChange: function (mainViewKeyword) {
		switch(mainViewKeyword) {
			case 'APPLICANT':
				this.setState({mainView: undefined});
				break;

			case 'SURVEY':
				this.setState({mainView: 'SURVEY'});
				break;

			case 'TOC':
				this.setState({mainView: 'TOC'});
				break;

			case 'PERSONAL':
				this.setState({mainView: 'PERSONAL'});
				break;

			case 'CONTACT':
				this.setState({mainView: 'CONTACT'});
				break;

			case 'INVESTMENT':
				this.setState({mainView: 'INVESTMENT'});
				break;

			case 'BENEFICIARY':
				this.setState({mainView: 'BENEFICIARY'});
				break;

			case 'INSTRUCTION':
				this.setState({mainView: 'INSTRUCTION'});
				break;
		}
	},
	onModalChange: function (modalKeyword) {
		console.log(modalKeyword);
		console.log($("#ApplyMessageContainerModal").data('bs.modal'));
		switch (modalKeyword) {
			case 'VALIDATING':
				this.setState({dialogView: 'VALIDATING'});
				$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = false;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = 'static';
				break;
			
			case 'NON-MEMBER-DIALOG':
				this.setState({dialogView : 'NON-MEMBER-DIALOG'});
				$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = true;
				break;

			case 'SAVING':
				this.setState({dialogView: 'SAVING'});
				$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = false;
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = 'static';
				break;

			case 'SAVED':
				this.setState({dialogView: 'SAVED'});
				$("#ApplyMessageContainerModal").modal().
					on('hidden.bs.modal', function (e) {
						window.location.reload();
					});
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = true;
				break;	

			case 'TRAINEE-DIALOG':
				this.setState({dialogView : 'TRAINEE-DIALOG'});
				//$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = true;
				break;

			case 'INVESTOR-SAVED':
				this.setState({dialogView : 'SAVED'});
				$("#ApplyMessageContainerModal").modal();
				$("#ApplyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplyMessageContainerModal").data('bs.modal').options.backdrop = true;
				break;

		}
	},
	onDataChange: function (postData, type) {
		switch(type) {
			case 'applicantData':
				this.setState({ applicantData : postData });
				break;

			case 'surveyData':
				this.setState({ surveyData : postData });
				break;

			case 'tocData':
				this.setState({tocData: postData});
				break;

			case 'personalData':
				this.setState({ personalData : postData });
				break;

			case 'contactData':
				this.setState({	contactData : postData});
				break;

			case 'investmentData':
				this.setState({ investmentData : postData });
				break;

			case 'beneficiaryData':
				this.setState({ beneficiaryData : postData });
				break;
		}
	},
	onHandleClick: function (buttonKeyword) {
		console.log(buttonKeyword);
		switch (buttonKeyword) {
			case 'SAVE-NON-MEMBER':
				//this.onModalChange('NON-MEMBER-SAVING');
				this.saveNonMember();
				break;

			case 'SAVE-TRAINEE':
				this.saveTraineeMember();
				break;

			case 'SAVE-INVESTOR':
				this.saveInvestorMember();
				break;
		}
	},
	render: function () {
		var view;
		switch(this.state.mainView) {
			case 'SURVEY':
				view =	<ApplySurveyView 
							surveyData={this.state.surveyData}
							modalChange={this.onModalChange}
							dataChange={this.onDataChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'TOC':
				view =	<ApplyTOCView
							tocData={this.state.tocData}
							dataChange={this.onDataChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'PERSONAL':
				view = 	<ApplyPersonalView 
							surveyData={this.state.surveyData}
							personalData={this.state.personalData}
							applicantData={this.state.applicantData}
							modalChange={this.onModalChange}
							dataChange={this.onDataChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'CONTACT': 
				view = 	<ApplyContactView 
							surveyData={this.state.surveyData}
							contactData={this.state.contactData}
							applicantData={this.state.applicantData}
							modalChange={this.onModalChange}
							dataChange={this.onDataChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'INVESTMENT':
				view =	<ApplyInvestmentView 
							surveyData={this.state.surveyData}
							investmentData={this.state.investmentData}
							modalChange={this.onModalChange}
							dataChange={this.onDataChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'BENEFICIARY':
				view = 	<ApplyBeneficiaryView
							surveyData={this.state.surveyData}
							beneficiaryData={this.state.beneficiaryData}
							modalChange={this.onModalChange}
							dataChange={this.onDataChange}
							mainViewChange={this.onMainViewChange}/>;
				break;

			case 'INSTRUCTION':
				view = 	<ApplyInstructionView
							applicationSent={this.state.applicationSent}
							modalChange={this.onModalChange}
							buttonClick={this.onHandleClick}
							mainViewChange={this.onMainViewChange}/>;
				break;

			default:
				view = 	<ApplyLandingView 
							applicantData = {this.state.applicantData}
							modalChange={this.onModalChange}
							dataChange={this.onDataChange}
							mainViewChange={this.onMainViewChange}/>;
				break;
		}
		return (
			<div className="row">
				{ view }
				<ApplyMessageContainerModal 
					dialogView={this.state.dialogView}
					buttonClick={this.onHandleClick}/>
			</div>
		);
	}
});

/*=====  End of Apply Main  ======*/
	
if(typeof $("#apply-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<ApplyMain />,
	document.getElementById('apply-app-node'));
}