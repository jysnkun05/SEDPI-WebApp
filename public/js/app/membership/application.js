/*==========================================
=            Applicant Messages            =
==========================================*/

var ApplicantMessageContainerModal = React.createClass({
	displayName: 'ApplicantMessageContainerModal',

	render: function () {
		var modalMessageComponent;
		switch (this.props.modalMessage) {
			case 'SHOW-CHANGE-STATUS':
				modalMessageComponent = React.createElement(ApplicantMessageChangeStatus, {
					applicantChange: this.props.applicantChange,
					applicant: this.props.applicant });
				break;

			case 'SHOW-ACCEPT-APPLICATION':
				modalMessageComponent = React.createElement(ApplicantMessageSaveMember, {
					applicantChange: this.props.applicantChange,
					applicant: this.props.applicant });
				break;
		}
		return React.createElement(
			'div',
			{ className: 'modal fade', id: 'ApplicantMessageContainerModal', role: 'dialog' },
			modalMessageComponent
		);
	}
});

/*----------  Applicant Message Change Status  ----------*/

var ApplicantMessageChangeStatus = React.createClass({
	displayName: 'ApplicantMessageChangeStatus',

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
				id: postData.id,
				statusSelected: postData.statusSelected,
				remarks: this.state.remarks
			},
			success: function (response) {
				$("#btn-change-status-submit").prop('disabled', false);
				$("#btn-change-status-submit").html('Confirm');
				if (response.status === 'success') {
					this.setState({ changeStatusView: 'success' });
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
			id: this.props.applicant.id,
			statusSelected: this.state.statusSelected
		};

		if (this.props.applicant.application_status_id.id !== this.state.statusSelected) this.saveApplicationStatus(postData);
	},
	render: function () {
		var statusOptions;
		var view;
		if (this.state.statuses !== undefined) {
			statusOptions = this.state.statuses.map(function (status, index) {
				return React.createElement(
					'option',
					{ key: index, value: status.id },
					status.name
				);
			}.bind(this));
		}
		switch (this.state.changeStatusView) {
			case 'success':
				view = React.createElement(
					'div',
					{ className: 'panel-custom-success' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'div',
							{ className: 'row' },
							React.createElement(
								'div',
								{ className: 'col-md-12' },
								React.createElement('i', { className: 'fa fa-check-circle fa-lg fa-fw' }),
								' Application Status Updated.',
								React.createElement(
									'div',
									{ className: 'pull-right' },
									React.createElement(
										'button',
										{ className: 'close', 'data-dismiss': 'modal' },
										'×'
									)
								)
							)
						)
					)
				);
				break;

			default:
				view = React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						'Edit Application Status'
					),
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'form',
							{ onSubmit: this.handleSubmit },
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'label',
									null,
									'Application Status'
								),
								React.createElement(
									'select',
									{
										className: 'form-control',
										value: this.state.statusSelected,
										onChange: this.handleChange.bind(null, 'statusSelected') },
									statusOptions
								)
							),
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'label',
									null,
									'Remarks'
								),
								React.createElement('textarea', {
									value: this.state.remarks,
									onChange: this.handleChange.bind(null, 'remarks'),
									className: 'form-control textarea-disabled-resize' })
							),
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'div',
									{ className: 'pull-right' },
									React.createElement(
										'div',
										{ className: 'btn-group' },
										React.createElement(
											'button',
											{ type: 'button', className: 'btn btn-default', 'data-dismiss': 'modal' },
											'Cancel'
										),
										React.createElement(
											'button',
											{ type: 'submit', className: 'btn btn-primary', id: 'btn-change-status-submit' },
											'Confirm'
										)
									)
								)
							)
						)
					)
				);
				break;
		}
		return React.createElement(
			'div',
			{ className: 'modal-dialog', role: 'document' },
			view
		);
	}
});

/*----------  Applicant Message Save Member  ----------*/

var ApplicantMessageSaveMember = React.createClass({
	displayName: 'ApplicantMessageSaveMember',

	getInitialState: function () {
		return {
			saveMemberView: undefined
		};
	},
	saveApplicantAsMember: function (id) {
		this.setState({ saveMemberView: 'GENERATING' });
		$("#ApplicantMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#ApplicantMessageContainerModal").data('bs.modal').options.backdrop = 'static';
		$.ajax({
			url: '/api/applicants/saveApplicantAsMember',
			type: 'POST',
			dataType: 'json',
			data: {
				id: id
			},
			success: function (response) {
				$("#ApplicantMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#ApplicantMessageContainerModal").data('bs.modal').options.backdrop = true;
				this.setState({ saveMemberView: 'GENERATED' });
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
		switch (this.state.saveMemberView) {
			case 'GENERATING':
				view = React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						'Accept Member'
					),
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'div',
							{ className: 'row' },
							React.createElement(
								'div',
								{ className: 'col-md-12' },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'p',
										{ className: 'text-center' },
										React.createElement('i', { className: 'fa fa-circle-o-notch fa-2x fa-spin' })
									),
									React.createElement(
										'p',
										{ className: 'text-center' },
										'Generating Member... Please wait.'
									)
								)
							)
						)
					)
				);
				break;

			case 'GENERATED':
				view = React.createElement(
					'div',
					{ className: 'panel-custom-success' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'div',
							{ className: 'row' },
							React.createElement(
								'div',
								{ className: 'col-md-12' },
								React.createElement('i', { className: 'fa fa-check-circle fa-lg fa-fw' }),
								' Applicant has been registered.',
								React.createElement(
									'div',
									{ className: 'pull-right' },
									React.createElement(
										'button',
										{ className: 'close', 'data-dismiss': 'modal' },
										'×'
									)
								)
							)
						)
					)
				);
				break;

			default:
				view = React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						'Accept Member'
					),
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'form',
							{ onSubmit: this.handleSubmit },
							React.createElement(
								'div',
								{ className: 'row' },
								React.createElement(
									'div',
									{ className: 'col-md-12' },
									React.createElement(
										'div',
										{ className: 'form-group' },
										React.createElement(
											'p',
											null,
											React.createElement('i', { className: 'fa fa-question-circle fa-lg fa-fw' }),
											' Do you want to continue?'
										),
										React.createElement(
											'p',
											null,
											'Note: Once the applicant is accepted, the applicant information will be accessed as read-only. This action is irreversible.'
										)
									),
									React.createElement(
										'div',
										{ className: 'form-group' },
										React.createElement(
											'div',
											{ className: 'pull-right' },
											React.createElement(
												'div',
												{ className: 'btn-group' },
												React.createElement(
													'button',
													{ type: 'button', className: 'btn btn-default', 'data-dismiss': 'modal' },
													'Cancel'
												),
												React.createElement(
													'button',
													{ type: 'submit', className: 'btn btn-primary', id: 'btn-save-member-submit' },
													'Continue'
												)
											)
										)
									)
								)
							)
						)
					)
				);
				break;
		}
		return React.createElement(
			'div',
			{ className: 'modal-dialog', role: 'document' },
			view
		);
	}
});

/*=====  End of Applicant Messages  ======*/

/*======================================
=            Applicant View            =
======================================*/

var ApplicantTableView = React.createClass({
	displayName: 'ApplicantTableView',

	handleClick: function (applicant) {
		this.props.rowClick(applicant.id);
	},
	render: function () {
		var rows;
		if (this.props.applicants === undefined) {
			rows = React.createElement(
				'tr',
				{ className: 'text-center' },
				React.createElement(
					'td',
					{ colSpan: '6' },
					React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
					' Retrieving Applicants...'
				)
			);
		} else {
			if (this.props.applicants.length > 0) {
				rows = this.props.applicants.map(function (applicant, index) {
					applicant.fullName = applicant.middleName !== null ? applicant.firstName + ' ' + applicant.middleName + ' ' + applicant.lastName : applicant.firstName + ' ' + applicant.lastName;
					applicant.dateApplied = moment.tz(applicant.created_at, moment.tz.guess()).format('MMM DD, YYYY hh:mm:ss A');
					applicant.status = applicant.application_status_id;
					applicant.location = applicant.presentCountry !== null ? applicant.presentCountry : 'Not Available';
					applicant.applicantType = applicant.applicant_type_id;
					return React.createElement(
						'tr',
						{ key: index, className: 'text-center clickable-row', onClick: this.handleClick.bind(null, applicant) },
						React.createElement(
							'td',
							null,
							index + 1
						),
						React.createElement(
							'td',
							null,
							applicant.fullName
						),
						React.createElement(
							'td',
							null,
							applicant.location
						),
						React.createElement(
							'td',
							null,
							applicant.dateApplied
						),
						React.createElement(
							'td',
							null,
							applicant.applicantType
						),
						React.createElement(
							'td',
							null,
							applicant.status
						)
					);
				}.bind(this));
			} else {
				rows = React.createElement(
					'tr',
					{ className: 'text-center' },
					React.createElement(
						'td',
						{ colSpan: '6' },
						React.createElement('i', { className: 'fa fa-info-circle fa-fw' }),
						' No Applicant Found.'
					)
				);
			}
		}
		return React.createElement(
			'div',
			{ className: 'col-md-10 col-md-offset-1' },
			React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-heading' },
					'Member Applicants'
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'div',
						{ className: 'row' },
						React.createElement(
							'div',
							{ className: 'col-md-12' },
							React.createElement(
								'table',
								{ className: 'table table-bordered table-striped table-condensed' },
								React.createElement(
									'thead',
									null,
									React.createElement(
										'tr',
										null,
										React.createElement(
											'th',
											{ className: 'text-center' },
											'#'
										),
										React.createElement(
											'th',
											{ className: 'text-center' },
											'Applicant Name'
										),
										React.createElement(
											'th',
											{ className: 'text-center' },
											'Location'
										),
										React.createElement(
											'th',
											{ className: 'text-center' },
											'Date Applied'
										),
										React.createElement(
											'th',
											{ className: 'text-center' },
											'Membership Type'
										),
										React.createElement(
											'th',
											{ className: 'text-center' },
											'Status'
										)
									)
								),
								React.createElement(
									'tbody',
									null,
									rows
								)
							)
						)
					)
				)
			)
		);
	}
});

/*----------  Applicant Detail VIew  ----------*/

var ApplicantDetailView = React.createClass({
	displayName: 'ApplicantDetailView',

	getInitialState: function () {
		return {
			detailView: 'applicantInfo'
		};
	},
	handleClick: function (e) {
		console.log(e);
		switch (e) {
			case 'showApplicantInformation':
				if (this.state.detailView !== 'applicantInfo') this.setState({ detailView: 'applicantInfo' });
				break;

			case 'showContactInformation':
				if (this.state.detailView !== 'contactInfo') this.setState({ detailView: 'contactInfo' });
				break;

			case 'showInvestmentInformation':
				if (this.state.detailView !== 'investInfo') this.setState({ detailView: 'investInfo' });
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
		if (this.props.applicant !== undefined) {
			switch (this.props.applicant.applicant_type_id.name) {
				case 'Investor':
					navigations = React.createElement(
						'ul',
						{ className: 'nav nav-tabs' },
						React.createElement(
							'li',
							{ role: 'presentation', className: this.state.detailView === 'applicantInfo' ? 'active' : 'clickable-row' },
							React.createElement(
								'a',
								{ onClick: this.handleClick.bind(null, 'showApplicantInformation') },
								'Applicant Information'
							)
						),
						React.createElement(
							'li',
							{ role: 'presentation', className: this.state.detailView === 'contactInfo' ? 'active' : 'clickable-row' },
							React.createElement(
								'a',
								{ onClick: this.handleClick.bind(null, 'showContactInformation') },
								'Contact Information'
							)
						),
						React.createElement(
							'li',
							{ role: 'presentation', className: this.state.detailView === 'investInfo' ? 'active' : 'clickable-row' },
							React.createElement(
								'a',
								{ onClick: this.handleClick.bind(null, 'showInvestmentInformation') },
								'Investment and Beneficiary Information'
							)
						)
					);
					break;

				default:
					navigations = React.createElement(
						'ul',
						{ className: 'nav nav-tabs' },
						React.createElement(
							'li',
							{ role: 'presentation', className: this.state.detailView === 'applicantInfo' ? 'active' : 'clickable-row' },
							React.createElement(
								'a',
								{ onClick: this.handleClick.bind(null, 'showApplicantInformation') },
								'Applicant Information'
							)
						),
						React.createElement(
							'li',
							{ role: 'presentation', className: this.state.detailView === 'contactInfo' ? 'active' : 'clickable-row' },
							React.createElement(
								'a',
								{ onClick: this.handleClick.bind(null, 'showContactInformation') },
								'Contact Information'
							)
						)
					);
					break;

			}

			if (this.props.applicant.application_status_id.description !== 'Already Member') {
				var applicationStatus = this.props.applicant.application_status_id;
				actions = React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'button',
						{ className: 'btn btn-default btn-block', onClick: this.handleClick.bind(null, 'showChangeStatusModal') },
						'Change Application Status'
					),
					applicationStatus.name === 'User Approved' || applicationStatus.name === 'System Approved' ? React.createElement(
						'button',
						{ className: 'btn btn-default btn-block', onClick: this.handleClick.bind(null, 'showSaveMemberModal') },
						'Accept Application'
					) : null
				);
			} else {
				actions = React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'div',
						{ className: 'row' },
						React.createElement(
							'div',
							{ className: 'col-md-12 text-center' },
							React.createElement('i', { className: 'fa fa-info-circle fa-fw' }),
							' No Actions Available.'
						)
					)
				);
			}
		} else {
			actions = React.createElement(
				'div',
				{ className: 'panel-body' },
				React.createElement(
					'p',
					{ className: 'text-center' },
					React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' })
				)
			);

			navigations = React.createElement(
				'ul',
				{ className: 'nav nav-tabs' },
				React.createElement(
					'li',
					{ role: 'presentation', className: this.state.detailView === 'applicantInfo' ? 'active' : '' },
					React.createElement(
						'a',
						null,
						'Applicant Information'
					)
				)
			);
		}
		var view;
		switch (this.state.detailView) {
			case 'applicantInfo':
				view = React.createElement(ApplicantInfoPanel, { applicant: this.props.applicant });
				break;

			case 'contactInfo':
				view = React.createElement(ContactInfoPanel, { applicant: this.props.applicant });
				break;

			case 'investInfo':
				view = React.createElement(
					'div',
					null,
					React.createElement(InvestmentInfoPanel, { applicant: this.props.applicant }),
					React.createElement(BeneficiaryInfoPanel, { applicant: this.props.applicant })
				);
		}
		return React.createElement(
			'div',
			{ className: 'col-md-8 col-md-offset-2' },
			React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-heading' },
					'Applicant Details',
					React.createElement(
						'div',
						{ className: 'pull-right' },
						React.createElement(
							'a',
							{ className: 'clickable-row', onClick: this.handleClick.bind(null, 'backToTableView') },
							'Back to List'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'div',
						{ className: 'row' },
						React.createElement(
							'div',
							{ className: 'col-md-12' },
							React.createElement(
								'div',
								{ className: 'form-group' },
								navigations
							),
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'div',
									{ className: 'row' },
									React.createElement(
										'div',
										{ className: 'col-md-8' },
										view
									),
									React.createElement(
										'div',
										{ className: 'col-md-4' },
										React.createElement(
											'div',
											{ className: 'panel panel-default' },
											actions
										)
									)
								)
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Applicant View  ======*/

/*============================================
=            Applicant View Panel            =
============================================*/

var ApplicantInfoPanel = React.createClass({
	displayName: 'ApplicantInfoPanel',

	render: function () {
		var view;
		if (this.props.applicant === undefined) {
			view = React.createElement(
				'p',
				{ className: 'text-center' },
				React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
				' Retrieving Data.'
			);
		} else {
			var applicant = this.props.applicant;
			applicant.fullName = applicant.middleName !== null ? applicant.firstName + ' ' + applicant.middleName + ' ' + applicant.lastName : applicant.firstName + ' ' + applicant.lastName;
			applicant.location = applicant.presentCountry === null ? 'Not Available' : applicant.presentCountry;
			applicant.dateApplied = moment.tz(applicant.created_at, moment.tz.guess()).format('MMM DD, YYYY hh:mm:ss A');
			applicant.applicantType = applicant.applicant_type_id.name;
			applicant.status = applicant.application_status_id.name;
			view = React.createElement(
				'table',
				{ className: 'table table-condensed table-striped table-bordered' },
				React.createElement(
					'tbody',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Member Name'
						),
						React.createElement(
							'td',
							null,
							applicant.fullName
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Location'
						),
						React.createElement(
							'td',
							null,
							applicant.location
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Date Applied'
						),
						React.createElement(
							'td',
							null,
							applicant.dateApplied
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Member Type'
						),
						React.createElement(
							'td',
							null,
							applicant.applicantType
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Status'
						),
						React.createElement(
							'td',
							null,
							applicant.status
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Remarks'
						),
						React.createElement(
							'td',
							null,
							applicant.remarks
						)
					)
				)
			);
		}
		return React.createElement(
			'div',
			{ className: 'panel panel-default' },
			React.createElement(
				'div',
				{ className: 'panel-heading' },
				'Applicant Information'
			),
			React.createElement(
				'div',
				{ className: 'panel-body' },
				view
			)
		);
	}
});

/*----------  Contact Info Panel  ----------*/

var ContactInfoPanel = React.createClass({
	displayName: 'ContactInfoPanel',

	render: function () {
		var view;
		if (this.props.applicant === undefined) {
			view = React.createElement(
				'p',
				{ className: 'text-center' },
				React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
				' Retrieving Data.'
			);
		} else {
			var applicant = this.props.applicant;
			applicant.presentAddress = applicant.presentAddress === '' ? undefined : applicant.presentAddress;
			applicant.presentCountry = applicant.presentCountry === 'Not Available' ? undefined : applicant.presentCountry;
			applicant.permanentAddress = applicant.permanentAddress === '' ? undefined : applicant.permanentAddress;
			applicant.permanentCountry = applicant.permanentCountry === 'Not Available' ? undefined : applicant.permanentCountry;
			applicant.mailingAddress = applicant.mailingAddress === '' ? undefined : applicant.mailingAddress;
			applicant.mobile = applicant.mobile === '' ? undefined : applicant.mobile;

			view = React.createElement(
				'table',
				{ className: 'table table-condensed table-striped table-bordered' },
				React.createElement(
					'tbody',
					null,
					applicant.presentAddress !== null ? React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Present Address'
						),
						React.createElement(
							'td',
							null,
							applicant.presentAddress
						)
					) : null,
					applicant.presentCountry !== null ? React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Present Country'
						),
						React.createElement(
							'td',
							null,
							applicant.presentCountry
						)
					) : null,
					applicant.permanentAddress !== null ? React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Permanent Address'
						),
						React.createElement(
							'td',
							null,
							applicant.permanentAddress
						)
					) : null,
					applicant.permanentCountry !== null ? React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Permanent Country'
						),
						React.createElement(
							'td',
							null,
							applicant.permanentCountry
						)
					) : null,
					applicant.mailingAddress !== null ? React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Mailing Address'
						),
						React.createElement(
							'td',
							null,
							applicant.mailingAddress === 'present' ? 'Present Address' : 'Permanent Address'
						)
					) : null,
					applicant.mobile !== null ? React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Mobile'
						),
						React.createElement(
							'td',
							null,
							applicant.mobile
						)
					) : null,
					applicant.email !== null ? React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ className: 'table-title-col' },
							'Email Address'
						),
						React.createElement(
							'td',
							null,
							applicant.email
						)
					) : null
				)
			);
		}
		return React.createElement(
			'div',
			{ className: 'panel panel-default' },
			React.createElement(
				'div',
				{ className: 'panel-heading' },
				'Contact Information'
			),
			React.createElement(
				'div',
				{ className: 'panel-body' },
				view
			)
		);
	}
});

/*----------  Investment Info Panel  ----------*/

var InvestmentInfoPanel = React.createClass({
	displayName: 'InvestmentInfoPanel',

	render: function () {
		var view;
		if (this.props.applicant === undefined) {
			view = React.createElement(
				'p',
				{ className: 'text-center' },
				React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
				' Retrieving Data.'
			);
		} else {
			var investment = this.props.applicant;
			investment.investmentDate = moment.tz(investment.investmentDate, moment.tz.guess()).format('MMM DD, YYYY');
			if (investment.amountInvested !== null && investment.sourceOfFunds !== null) {
				view = React.createElement(
					'table',
					{ className: 'table table-condensed table-striped table-bordered' },
					React.createElement(
						'tbody',
						null,
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ className: 'table-title-col' },
								'Invested Amount'
							),
							React.createElement(
								'td',
								null,
								"Php " + investment.amountInvested
							)
						),
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ className: 'table-title-col' },
								'Date intended to invest'
							),
							React.createElement(
								'td',
								null,
								investment.investmentDate
							)
						),
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ className: 'table-title-col' },
								'Source of Funds'
							),
							React.createElement(
								'td',
								null,
								investment.sourceOfFunds
							)
						)
					)
				);
			} else {
				view = React.createElement(
					'div',
					{ className: 'panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'p',
							{ className: 'text-center' },
							React.createElement('i', { className: 'fa fa-info-circle' }),
							' No Information Available.'
						)
					)
				);
			}
		}
		return React.createElement(
			'div',
			{ className: 'panel panel-default' },
			React.createElement(
				'div',
				{ className: 'panel-heading' },
				'Investment Information'
			),
			React.createElement(
				'div',
				{ className: 'panel-body' },
				view
			)
		);
	}
});

/*----------  Beneficiary Info Panel  ----------*/

var BeneficiaryInfoPanel = React.createClass({
	displayName: 'BeneficiaryInfoPanel',

	render: function () {
		var view;
		if (this.props.applicant === undefined) {
			view = React.createElement(
				'p',
				{ className: 'text-center' },
				React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
				' Retrieving Data.'
			);
		} else {
			var beneficiary = this.props.applicant;
			//investment.investmentDate = moment.tz(investment.investmentDate, moment.tz.guess()).format('MMM DD, YYYY hh:mm:ss A');
			if (beneficiary.b1Name !== null || beneficiary.b2Name !== null) {
				beneficiary.b1BirthDate = moment.tz(beneficiary.b1BirthDate, moment.tz.guess()).format('MMM DD, YYYY');
				beneficiary.b2BirthDate = moment.tz(beneficiary.b2BirthDate, moment.tz.guess()).format('MMM DD, YYYY');
				view = React.createElement(
					'div',
					{ className: 'row' },
					beneficiary.b1Name !== null ? React.createElement(
						'div',
						{ className: 'col-md-12' },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'label',
								null,
								'Beneficiary 1'
							)
						),
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'table',
								{ className: 'table table-condensed table-striped table-bordered' },
								React.createElement(
									'tbody',
									null,
									React.createElement(
										'tr',
										null,
										React.createElement(
											'td',
											{ className: 'table-title-col' },
											'Name'
										),
										React.createElement(
											'td',
											null,
											beneficiary.b1Name
										)
									),
									React.createElement(
										'tr',
										null,
										React.createElement(
											'td',
											{ className: 'table-title-col' },
											'Address'
										),
										React.createElement(
											'td',
											null,
											beneficiary.b1Address
										)
									),
									React.createElement(
										'tr',
										null,
										React.createElement(
											'td',
											{ className: 'table-title-col' },
											'Birth Date'
										),
										React.createElement(
											'td',
											null,
											beneficiary.b1BirthDate
										)
									),
									React.createElement(
										'tr',
										null,
										React.createElement(
											'td',
											{ className: 'table-title-col' },
											'Relationship'
										),
										React.createElement(
											'td',
											null,
											beneficiary.b1Relationship
										)
									)
								)
							)
						)
					) : null,
					beneficiary.b2Name !== null ? React.createElement(
						'div',
						{ className: 'col-md-12' },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'label',
								null,
								'Beneficiary 2'
							)
						),
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'table',
								{ className: 'table table-condensed table-striped table-bordered' },
								React.createElement(
									'tbody',
									null,
									React.createElement(
										'tr',
										null,
										React.createElement(
											'td',
											{ className: 'table-title-col' },
											'Name'
										),
										React.createElement(
											'td',
											null,
											beneficiary.b2Name
										)
									),
									React.createElement(
										'tr',
										null,
										React.createElement(
											'td',
											{ className: 'table-title-col' },
											'Address'
										),
										React.createElement(
											'td',
											null,
											beneficiary.b2Address
										)
									),
									React.createElement(
										'tr',
										null,
										React.createElement(
											'td',
											{ className: 'table-title-col' },
											'Birth Date'
										),
										React.createElement(
											'td',
											null,
											beneficiary.b2BirthDate
										)
									),
									React.createElement(
										'tr',
										null,
										React.createElement(
											'td',
											{ className: 'table-title-col' },
											'Relationship'
										),
										React.createElement(
											'td',
											null,
											beneficiary.b2Relationship
										)
									)
								)
							)
						)
					) : null
				);
			} else {
				view = React.createElement(
					'div',
					{ className: 'panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'p',
							{ className: 'text-center' },
							React.createElement('i', { className: 'fa fa-info-circle' }),
							' No Information Available.'
						)
					)
				);
			}
		}
		return React.createElement(
			'div',
			{ className: 'panel panel-default' },
			React.createElement(
				'div',
				{ className: 'panel-heading' },
				'Beneficiary Information'
			),
			React.createElement(
				'div',
				{ className: 'panel-body' },
				view
			)
		);
	}
});

/*=====  End of Applicant View Panel  ======*/

/*======================================
=            Applicant Main            =
======================================*/

var ApplicantMain = React.createClass({
	displayName: 'ApplicantMain',

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
				id: id
			},
			dataType: 'json',
			cache: false,
			success: function (applicant) {
				this.setState({ applicant: applicant });
			}.bind(this),
			error: function () {}.bind(this)
		});
	},
	onRowClick: function (id) {
		this.loadApplicant(id);
		this.setState({
			applicantView: 'DETAILS',
			applicantId: id
		});
	},
	onViewChange: function (keyword) {
		console.log(keyword);
		switch (keyword) {
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
			modalMessage: modal
		});
		$("#ApplicantMessageContainerModal").modal().on('hidden.bs.modal', function (e) {
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
		switch (this.state.applicantView) {
			case 'DETAILS':
				view = React.createElement(ApplicantDetailView, {
					applicant: this.state.applicant,
					viewChange: this.onViewChange,
					modalChange: this.onModalChange });
				break;
			default:
				view = React.createElement(ApplicantTableView, {
					applicants: this.state.applicants,
					rowClick: this.onRowClick });
				break;
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			view,
			React.createElement(ApplicantMessageContainerModal, {
				applicantChange: this.onApplicantChange,
				applicant: this.state.applicant,
				modalMessage: this.state.modalMessage })
		);
	}
});

/*=====  End of Applicant Main  ======*/

if (typeof $("#application-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(ApplicantMain, null), document.getElementById('application-app-node'));
}