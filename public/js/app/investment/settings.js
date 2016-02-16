/*=====================================
=            Settings View            =
=====================================*/

var UserSettingsComponent = React.createClass({
	displayName: 'UserSettingsComponent',

	getInitialState: function () {
		return {
			userRoles: undefined,
			users: undefined,
			userSettingsView: undefined
		};
	},
	componentWillMount: function () {
		this._getAllUserRoles(0);
		this._getAllAdminUsers(0);
	},
	_getAllUserRoles: function (counter) {
		$.ajax({
			url: '/api/settings/users/getAllUserRoles',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (userRoles) {
				this.setState({ userRoles: userRoles });
			}.bind(this),
			error: function (xhr, status, error) {
				if (counter < 3) {
					this.setState({ userRoles: 'retrying' });
					this._getAllUserRoles(counter + 1);
				} else {
					this.setState({ userRoles: status });
				}
			}.bind(this)
		});
	},
	_getAllAdminUsers: function (counter) {
		$.ajax({
			url: '/api/settings/users/getAllAdminUsers',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (users) {
				this.setState({ users: users });
			}.bind(this),
			error: function (xhr, status, error) {
				if (counter < 3) {
					this.setState({ users: 'retrying' });
					this._getAllUserRoles(counter + 1);
				} else {
					this.setState({ users: status });
				}
			}.bind(this)
		});
	},
	_onUserSettingsViewChange: function (action, id) {
		this.setState({
			userSettingsView: action,
			id: id
		});
	},
	render: function () {
		var userSettingsView;
		if (this.state.userSettingsView === undefined) {
			userSettingsView = React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(UsersComponents, {
					users: this.state.users,
					userSettingsViewChange: this._onUserSettingsViewChange }),
				React.createElement(EditUserRolesComponent, { userRoles: this.state.userRoles })
			);
		} else if (this.state.userSettingsView === 'ADD-USER') {
			userSettingsView = React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(AddUserComponents, {
					userSettingsViewChange: this._onUserSettingsViewChange,
					modalViewChange: this.props.modalViewChange })
			);
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'div',
							{ className: 'page-header' },
							React.createElement(
								'h2',
								null,
								'User Settings'
							)
						),
						React.createElement(
							'div',
							{ className: 'row' },
							userSettingsView
						)
					)
				)
			)
		);
	}
});

var EmailSettingsComponent = React.createClass({
	displayName: 'EmailSettingsComponent',

	getInitialState: function () {
		return {
			emails: undefined,
			emailSettingsView: undefined
		};
	},
	componentWillMount: function () {
		this._getEmailAccounts(0);
	},
	_getEmailAccounts: function (counter) {
		$.ajax({
			url: '/api/settings/emails/getEmailAccounts',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (emails) {
				this.setState({ emails: emails });
			}.bind(this),
			error: function (xhr, status, error) {
				if (counter < 3) {
					this.setState({ emails: 'retrying' });
					this._getEmailAccounts(counter + 1);
				} else {
					this.setState({ emails: status });
				}
			}.bind(this)
		});
	},
	render: function () {
		var emailSettingsView;
		if (this.state.emailSettingsView === undefined) {
			emailSettingsView = React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(OutgoingEmailsComponent, { emails: this.state.emails })
			);
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'div',
							{ className: 'page-header' },
							React.createElement(
								'h2',
								null,
								'Email Settings'
							)
						),
						React.createElement(
							'div',
							{ className: 'row' },
							emailSettingsView
						)
					)
				)
			)
		);
	}
});

/*=====  End of Settings View  ======*/

/*=================================================
=            Email Settings Components            =
=================================================*/

var OutgoingEmailsComponent = React.createClass({
	displayName: 'OutgoingEmailsComponent',

	render: function () {
		var emailView;
		if (this.props.emails === undefined) {
			emailView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
								' Loading Data...'
							)
						)
					)
				)
			);
		} else if (this.props.emails === 'retrying') {
			emailView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
								' Retying to load users. Please wait.'
							)
						)
					)
				)
			);
		} else if (this.props.emails == 'error') {
			emailView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-exclamation-triangle fa-fw' }),
								' ',
								"Unable to load users.",
								' ',
								React.createElement(
									'button',
									{ className: 'btn btn-link btn-xs' },
									'Retry'
								)
							)
						)
					)
				)
			);
		} else {
			var emailList = this.props.emails.map(function (email, index) {
				return React.createElement(
					'tr',
					{ key: index, className: 'text-center' },
					React.createElement(
						'td',
						null,
						index + 1
					),
					React.createElement(
						'td',
						null,
						email.name
					),
					React.createElement(
						'td',
						null,
						email.username
					),
					React.createElement(
						'td',
						null,
						email.port
					),
					React.createElement(
						'td',
						null,
						email.driver
					),
					React.createElement(
						'td',
						null,
						email.encryption_type
					)
				);
			});
			emailView = React.createElement(
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
							'Email Account Name'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Email Address'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Port'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Type'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Encryption'
						),
						React.createElement('th', null)
					)
				),
				React.createElement(
					'tbody',
					null,
					emailList
				)
			);
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						'Email Accounts',
						React.createElement('div', { className: 'pull-right' })
					),
					React.createElement(
						'div',
						{ className: 'panel-body' },
						emailView
					)
				)
			)
		);
	}
});

/*=====  End of Email Settings Components  ======*/

/*================================================
=            User Settings Components            =
================================================*/

var UsersComponents = React.createClass({
	displayName: 'UsersComponents',

	render: function () {
		var userView;
		if (this.props.users === undefined) {
			userView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
								' Loading Data...'
							)
						)
					)
				)
			);
		} else if (this.props.users === 'retrying') {
			userView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
								' Retying to load users. Please wait.'
							)
						)
					)
				)
			);
		} else if (this.props.users == 'error') {
			userView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-exclamation-triangle fa-fw' }),
								' ',
								"Unable to load users.",
								' ',
								React.createElement(
									'button',
									{ className: 'btn btn-link btn-xs' },
									'Retry'
								)
							)
						)
					)
				)
			);
		} else {
			var userList = this.props.users.map(function (user, index) {
				return React.createElement(
					'tr',
					{ key: index, className: 'text-center' },
					React.createElement(
						'td',
						null,
						index + 1
					),
					React.createElement(
						'td',
						null,
						user.username
					),
					React.createElement(
						'td',
						null,
						user.user_role.name
					),
					React.createElement(
						'td',
						null,
						user.is_active ? "Active" : "Inactive"
					),
					React.createElement(
						'td',
						{ className: 'text-center' },
						React.createElement(
							'div',
							{ className: 'btn-group text-right' },
							React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-link btn-xs' },
								'Set as Active'
							),
							user.is_editable ? React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-link btn-xs' },
								'Edit'
							) : null,
							user.is_deletable ? React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-link btn-xs' },
								'Delete'
							) : null
						)
					)
				);
			});
			userView = React.createElement(
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
							'Username'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Role'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Status'
						),
						React.createElement('th', null)
					)
				),
				React.createElement(
					'tbody',
					null,
					userList
				)
			);
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						'Users',
						React.createElement(
							'div',
							{ className: 'pull-right' },
							React.createElement(
								'button',
								{ className: 'btn btn-primary btn-xs', onClick: this.props.userSettingsViewChange.bind(null, 'ADD-USER') },
								'Add New User'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'panel-body' },
						userView
					)
				)
			)
		);
	}
});

var AddUserComponents = React.createClass({
	displayName: 'AddUserComponents',

	getInitialState: function () {
		return {
			roles: [],
			username: '',
			displayname: '',
			email: '',
			role_id: '',
			password: '',
			confirmpassword: ''
		};
	},
	componentWillMount: function () {
		this._getAdminRoleOptions();
	},
	_getAdminRoleOptions: function () {
		$.ajax({
			url: '/api/settings/users/getAdminRoleOptions',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function (roles) {
				this.setState({
					roles: roles,
					role_id: roles[0].id
				});
			}.bind(this),
			error: function (xhr, status, error) {
				this._getAdminRoleOptions();
			}.bind(this)
		});
	},
	_handleChange: function (name, e) {
		var change = {};
		change[name] = e.target.value;
		this.setState(change);
	},
	_saveAdminUser: function (e) {
		e.preventDefault();
		// console.log('hello');

		var postData = {
			username: this.state.username.trim(),
			displayname: this.state.displayname.trim(),
			email: this.state.email.trim(),
			role_id: this.state.role_id,
			password: this.state.password,
			confirmpassword: this.state.confirmpassword
		};

		this.props.modalViewChange({
			type: 'WAITING-MODAL',
			title: 'Validating User'
		});

		$("#SettingsMessageContainerModal").modal();
		$("#SettingsMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#SettingsMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		this.setState({
			username: postData.username,
			displayname: postData.displayname,
			email: postData.email
		});

		$.ajax({
			url: '/api/settings/users/saveAdminUser',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.modalViewChange({
					type: 'SUCCESS-MODAL',
					message: response.message
				});

				this.props.userSettingsViewChange(undefined);
				$("#SettingsMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#SettingsMessageContainerModal").data('bs.modal').options.backdrop = true;
			}.bind(this),
			error: function (xhr, status, error) {
				$("#SettingsMessageContainerModal").modal('hide');
				if (xhr.status === 422) {
					$.each(xhr.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				}
			}.bind(this)
		});
	},
	render: function () {
		var rolesOptions;
		if (this.state.roles.length > 0) {
			rolesOptions = this.state.roles.map(function (role, index) {
				return React.createElement(
					'option',
					{ key: index, value: role.id },
					role.name
				);
			});
		} else {
			roles = React.createElement(
				'option',
				null,
				'Loading Data...'
			);
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(
					'form',
					{ onSubmit: this._saveAdminUser },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-link btn-xs', onClick: this.props.userSettingsViewChange.bind(null, undefined) },
								React.createElement('i', { className: 'fa fa-chevron-left' })
							),
							'Create New Users',
							React.createElement(
								'div',
								{ className: 'pull-right' },
								React.createElement(
									'button',
									{ type: 'submit', className: 'btn btn-primary btn-xs' },
									'Save User'
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'panel-body' },
							React.createElement(
								'div',
								{ className: 'form-group', id: 'fg-username' },
								React.createElement(
									'label',
									{ className: 'control-label', htmlFor: 'input-username' },
									'Username *'
								),
								React.createElement('input', {
									type: 'text',
									className: 'form-control',
									id: 'input-username',
									value: this.state.username,
									onChange: this._handleChange.bind(null, 'username') })
							),
							React.createElement(
								'div',
								{ className: 'form-group', id: 'fg-displayname' },
								React.createElement(
									'label',
									{ className: 'control-label', htmlFor: 'input-displayname' },
									'Display Name'
								),
								React.createElement('input', {
									type: 'text',
									className: 'form-control',
									id: 'input-displayname',
									value: this.state.displayname,
									onChange: this._handleChange.bind(null, 'displayname') })
							),
							React.createElement(
								'div',
								{ className: 'form-group', id: 'fg-email' },
								React.createElement(
									'label',
									{ className: 'control-label', htmlFor: 'input-email' },
									'Email Address *'
								),
								React.createElement('input', {
									type: 'text',
									className: 'form-control',
									id: 'input-email',
									value: this.state.email,
									onChange: this._handleChange.bind(null, 'email') })
							),
							React.createElement(
								'div',
								{ className: 'form-group', id: 'fg-role_id' },
								React.createElement(
									'label',
									{ className: 'control-label', htmlFor: 'input-role_id' },
									'Role *'
								),
								React.createElement(
									'select',
									{
										className: 'form-control',
										id: 'input-role_id',
										value: this.state.role_id,
										onChange: this._handleChange.bind(null, 'role_id') },
									rolesOptions
								)
							),
							React.createElement(
								'div',
								{ className: 'form-group', id: 'fg-password' },
								React.createElement(
									'label',
									{ className: 'control-label', htmlFor: 'input-password' },
									'Password *'
								),
								React.createElement('input', {
									type: 'password',
									className: 'form-control',
									id: 'input-password',
									value: this.state.password,
									onChange: this._handleChange.bind(null, 'password') })
							),
							React.createElement(
								'div',
								{ className: 'form-group', id: 'fg-confirmpassword' },
								React.createElement(
									'label',
									{ className: 'control-label', htmlFor: 'input-confirmpassword' },
									'Confirm Password *'
								),
								React.createElement('input', {
									type: 'password',
									className: 'form-control',
									id: 'input-confirmpassword',
									value: this.state.confirmpassword,
									onChange: this._handleChange.bind(null, 'confirmpassword') })
							)
						)
					)
				)
			)
		);
	}
});

/*----------  User Roles  ----------*/

var UserRolesComponent = React.createClass({
	displayName: 'UserRolesComponent',

	render: function () {
		var userRoleView;
		if (this.props.userRoles === undefined) {
			userRoleView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
								' Loading Data...'
							)
						)
					)
				)
			);
		} else if (this.props.userRoles === 'retrying') {
			userRoleView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' }),
								' Retying to load user roles. Please wait.'
							)
						)
					)
				)
			);
		} else if (this.props.userRoles == 'error') {
			userRoleView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
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
								{ className: 'text-center' },
								React.createElement('i', { className: 'fa fa-exclamation-triangle fa-fw' }),
								' ',
								"Unable to load user roles.",
								' ',
								React.createElement(
									'button',
									{ className: 'btn btn-link btn-xs' },
									'Retry'
								)
							)
						)
					)
				)
			);
		} else {
			var UserRoleList = this.props.userRoles.map(function (userRole, index) {
				return React.createElement(
					'tr',
					{ key: index, className: 'text-center' },
					React.createElement(
						'td',
						null,
						index + 1
					),
					React.createElement(
						'td',
						null,
						userRole.name
					),
					React.createElement(
						'td',
						null,
						userRole.is_active ? "Active" : "Inactive"
					),
					React.createElement(
						'td',
						{ className: 'text-center' },
						React.createElement(
							'div',
							{ className: 'btn-group text-right' },
							React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-link btn-xs' },
								'Set as Active'
							),
							userRole.is_default ? null : React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-link btn-xs' },
								'Edit'
							),
							userRole.is_default ? null : React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-link btn-xs' },
								'Delete'
							)
						)
					)
				);
			});
			userRoleView = React.createElement(
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
							'Roles'
						),
						React.createElement(
							'th',
							{ className: 'text-center' },
							'Status'
						),
						React.createElement('th', null)
					)
				),
				React.createElement(
					'tbody',
					null,
					UserRoleList
				)
			);
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						'User Roles',
						React.createElement(
							'div',
							{ className: 'pull-right' },
							React.createElement(
								'button',
								{ className: 'btn btn-primary btn-xs' },
								'Add New Role'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'panel-body' },
						userRoleView
					)
				)
			)
		);
	}
});

var EditUserRolesComponent = React.createClass({
	displayName: 'EditUserRolesComponent',

	render: function () {
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-12' },
				React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						React.createElement(
							'button',
							{ className: 'btn btn-link btn-xs' },
							React.createElement('i', { className: 'fa fa-chevron-left' }),
							' '
						),
						'User Roles',
						React.createElement(
							'div',
							{ className: 'pull-right' },
							React.createElement(
								'button',
								{ className: 'btn btn-primary btn-xs' },
								'Save Role'
							)
						)
					),
					React.createElement('div', { className: 'panel-body' })
				)
			)
		);
	}
});

/*=====  End of User Settings Components  ======*/

/*========================================
=            Modal Components            =
========================================*/

/*----------  Message Modal  ----------*/

var SettingsMessageContainerModal = React.createClass({
	displayName: 'SettingsMessageContainerModal',

	render: function () {
		var modalMessageComponent;
		var modalView = this.props.modalView;
		switch (modalView.type) {
			case 'WAITING-MODAL':
				modalMessageComponent = React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						modalView.title
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
										'Please wait a moment.'
									)
								)
							)
						)
					)
				);
				break;

			case 'SUCCESS-MODAL':
				modalMessageComponent = React.createElement(
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
								React.createElement('i', { className: 'fa fa-check-circle fa-fw' }),
								' ',
								modalView.message,
								React.createElement(
									'button',
									{ className: 'close', 'data-dismiss': 'modal' },
									'×'
								)
							)
						)
					)
				);
				break;
		}
		return React.createElement(
			'div',
			{ className: 'modal fade', id: 'SettingsMessageContainerModal', role: 'dialog' },
			React.createElement(
				'div',
				{ className: 'modal-dialog', role: 'document' },
				modalMessageComponent
			)
		);
	}
});

/*=====  End of Modal Components  ======*/

/*=====================================
=            Settings Main            =
=====================================*/

var SettingsMain = React.createClass({
	displayName: 'SettingsMain',

	getInitialState: function () {
		return {
			modalView: {
				type: undefined
			},
			mainView: 'EMAIL-SETTINGS'
		};
	},
	_onModalViewChange: function (modalView) {
		this.setState({ modalView: modalView });
	},
	render: function () {
		var mainView;
		switch (this.state.mainView) {
			case 'USER-SETTINGS':
				mainView = React.createElement(UserSettingsComponent, {
					modalViewChange: this._onModalViewChange });
				break;

			case 'EMAIL-SETTINGS':
				mainView = React.createElement(EmailSettingsComponent, null);
				break;
		}
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-10 col-md-offset-1' },
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'div',
						{ className: 'col-md-3' },
						React.createElement(
							'div',
							{ className: 'panel panel-default' },
							React.createElement(
								'div',
								{ className: 'panel-body' },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'div',
										{ className: 'list-group' },
										React.createElement(
											'button',
											{
												type: 'button',
												className: 'list-group-item btn-xs active' },
											React.createElement('i', { className: 'fa fa-chevron-right fa-fw' }),
											' User Settings'
										),
										React.createElement(
											'button',
											{
												type: 'button',
												disabled: 'true',
												className: 'list-group-item btn-xs' },
											React.createElement('i', { className: 'fa fa-chevron-right fa-fw' }),
											' Email Settings'
										)
									)
								)
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'col-md-9' },
						mainView,
						React.createElement(SettingsMessageContainerModal, {
							modalView: this.state.modalView })
					)
				)
			)
		);
	}
});

/*=====  End of Settings Main  ======*/

if (typeof $("#settings-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(SettingsMain, null), document.getElementById('settings-app-node'));
}