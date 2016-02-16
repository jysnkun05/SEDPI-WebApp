/*=====================================
=            Settings View            =
=====================================*/

var UserSettingsComponent = React.createClass({
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
				this.setState({userRoles: userRoles});
			}.bind(this),
			error: function (xhr, status, error) {
				if(counter < 3)
				{
					this.setState({userRoles: 'retrying'});
					this._getAllUserRoles(counter + 1);
				}
				else 
				{
					this.setState({userRoles: status});
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
				this.setState({users: users});
			}.bind(this),
			error: function (xhr, status, error) {
				if(counter < 3)
				{
					this.setState({users: 'retrying'});
					this._getAllUserRoles(counter + 1);
				}
				else 
				{
					this.setState({users: status});
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
		if(this.state.userSettingsView === undefined)
		{
			userSettingsView = <div className="col-md-12">
									<UsersComponents 
										users={this.state.users}
										userSettingsViewChange={this._onUserSettingsViewChange}/>
									<EditUserRolesComponent userRoles={this.state.userRoles}/>
								</div>;
		}
		else if(this.state.userSettingsView === 'ADD-USER')
		{
			userSettingsView = 	<div className="col-md-12">
									<AddUserComponents 
										userSettingsViewChange={this._onUserSettingsViewChange}
										modalViewChange={this.props.modalViewChange}/>
								</div>;
		}
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="page-header">
								<h2>User Settings</h2>
							</div>
							<div className="row">
								{userSettingsView}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var EmailSettingsComponent = React.createClass({
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
				this.setState({emails: emails});
			}.bind(this),
			error: function (xhr, status, error) {
				if(counter < 3)
				{
					this.setState({emails: 'retrying'});
					this._getEmailAccounts(counter + 1);
				}
				else 
				{
					this.setState({emails: status});
				}
			}.bind(this)
		});
	},
	render: function () {
		var emailSettingsView;
		if(this.state.emailSettingsView === undefined)
		{
			emailSettingsView = <div className="col-md-12">
									<OutgoingEmailsComponent emails={this.state.emails}/> 
								</div>;
		}
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="page-header">
								<h2>Email Settings</h2>
							</div>
							<div className="row">
								{emailSettingsView}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Settings View  ======*/

/*=================================================
=            Email Settings Components            =
=================================================*/

var OutgoingEmailsComponent = React.createClass({
	render: function () {
		var emailView;
		if(this.props.emails === undefined)
		{
			emailView = <div className="panel panel-default">
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
		else if(this.props.emails === 'retrying')
		{
			emailView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retying to load users. Please wait.
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else if (this.props.emails == 'error')
		{
			emailView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-exclamation-triangle fa-fw"></i> {"Unable to load users."} <button className="btn btn-link btn-xs">Retry</button>
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else 
		{
			var emailList = this.props.emails.map( function (email, index) {
				return 	<tr key={index} className="text-center">
							<td>{index + 1}</td>
							<td>{email.name}</td>
							<td>{email.username}</td>
							<td>{email.port}</td>
							<td>{email.driver}</td>
							<td>{email.encryption_type}</td>
						</tr>;
			});
			emailView = 	<table className="table table-bordered table-striped table-condensed">
								<thead>
									<tr>
										<th className="text-center">#</th>
										<th className="text-center">Email Account Name</th>
										<th className="text-center">Email Address</th>
										<th className="text-center">Port</th>
										<th className="text-center">Type</th>
										<th className="text-center">Encryption</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{emailList}
								</tbody>
							</table>;
		}
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-heading">
							Email Accounts
							<div className="pull-right">
								
							</div>
						</div>
						<div className="panel-body">
							{emailView}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Email Settings Components  ======*/

/*================================================
=            User Settings Components            =
================================================*/

var UsersComponents = React.createClass({
	render: function () {
		var userView;
		if(this.props.users === undefined)
		{
			userView = <div className="panel panel-default">
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
		else if(this.props.users === 'retrying')
		{
			userView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retying to load users. Please wait.
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else if (this.props.users == 'error')
		{
			userView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-exclamation-triangle fa-fw"></i> {"Unable to load users."} <button className="btn btn-link btn-xs">Retry</button>
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else 
		{
			var userList = this.props.users.map( function (user, index) {
				return 	<tr key={index} className="text-center">
							<td>{index + 1}</td>
							<td>{user.username}</td>
							<td>{user.user_role.name}</td>
							<td>{user.is_active ? "Active" : "Inactive"}</td>
							<td className="text-center">
								<div className="btn-group text-right">
									<button type="button" className="btn btn-link btn-xs">Set as Active</button>
									{user.is_editable ? <button type="button" className="btn btn-link btn-xs">Edit</button> : null}										
									{user.is_deletable ? <button type="button" className="btn btn-link btn-xs">Delete</button> : null}
								</div>
							</td>
						</tr>;
			});
			userView = 	<table className="table table-bordered table-striped table-condensed">
								<thead>
									<tr>
										<th className="text-center">#</th>
										<th className="text-center">Username</th>
										<th className="text-center">Role</th>
										<th className="text-center">Status</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{userList}
								</tbody>
							</table>;
		}
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-heading">
							Users
							<div className="pull-right">
								<button className="btn btn-primary btn-xs" onClick={this.props.userSettingsViewChange.bind(null, 'ADD-USER')}>Add New User</button>
							</div>
						</div>
						<div className="panel-body">
							{userView}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var AddUserComponents = React.createClass({
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
	render: function () {
		var rolesOptions;
		if(this.state.roles.length > 0)
		{
			rolesOptions = this.state.roles.map(function (role, index) {
				return <option key={index} value={role.id}>{role.name}</option>;
			});
		}
		else
		{
			roles = <option>Loading Data...</option>;
		}
		return (
			<div className="row">
				<div className="col-md-12">
					<form onSubmit={this._saveAdminUser}>
						<div className="panel panel-default">
							<div className="panel-heading">
								<button type="button" className="btn btn-link btn-xs" onClick={this.props.userSettingsViewChange.bind(null, undefined)}><i className="fa fa-chevron-left"></i></button>
								Create New Users
								<div className="pull-right">
									<button type="submit" className="btn btn-primary btn-xs">Save User</button>
								</div>
							</div>
							<div className="panel-body">
								<div className="form-group" id="fg-username">
									<label className="control-label" htmlFor="input-username">Username *</label>
									<input 
										type="text" 
										className="form-control"
										id="input-username"
										value={this.state.username}
										onChange={this._handleChange.bind(null, 'username')}/>
								</div>
								<div className="form-group" id="fg-displayname">
									<label className="control-label" htmlFor="input-displayname">Display Name</label>
									<input 
										type="text" 
										className="form-control" 
										id="input-displayname"
										value={this.state.displayname}
										onChange={this._handleChange.bind(null, 'displayname')}/>
								</div>
								<div className="form-group" id="fg-email">
									<label className="control-label" htmlFor="input-email">Email Address *</label>
									<input 
										type="text" 
										className="form-control"
										id="input-email"
										value={this.state.email}
										onChange={this._handleChange.bind(null, 'email')}/>
								</div>
								<div className="form-group" id="fg-role_id">
									<label className="control-label" htmlFor="input-role_id">Role *</label>
									<select 
										className="form-control"
										id="input-role_id"
										value={this.state.role_id}
										onChange={this._handleChange.bind(null, 'role_id')}>
										{rolesOptions}
									</select>
								</div>
								<div className="form-group" id="fg-password">
									<label className="control-label" htmlFor="input-password">Password *</label>
									<input 
										type="password" 
										className="form-control" 
										id="input-password"
										value={this.state.password}
										onChange={this._handleChange.bind(null, 'password')}/>
								</div>
								<div className="form-group" id="fg-confirmpassword">
									<label className="control-label" htmlFor="input-confirmpassword">Confirm Password *</label>
									<input 
										type="password" 
										className="form-control"
										id="input-confirmpassword"
										value={this.state.confirmpassword}
										onChange={this._handleChange.bind(null, 'confirmpassword')}/>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
});

/*----------  User Roles  ----------*/

var UserRolesComponent = React.createClass({
	render: function () {
		var userRoleView;
		if(this.props.userRoles === undefined)
		{
			userRoleView = <div className="panel panel-default">
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
		else if(this.props.userRoles === 'retrying')
		{
			userRoleView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-circle-o-notch fa-spin fa-fw"></i> Retying to load user roles. Please wait.
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else if (this.props.userRoles == 'error')
		{
			userRoleView = 	<div className="panel panel-default">
								<div className="panel-body">
									<div className="row">
										<div className="col-md-12">
											<div className="text-center">
												<i className="fa fa-exclamation-triangle fa-fw"></i> {"Unable to load user roles."} <button className="btn btn-link btn-xs">Retry</button>
											</div>
										</div>
									</div>
								</div>
							</div>;
		}
		else 
		{
			var UserRoleList = this.props.userRoles.map( function (userRole, index) {
				return 	<tr key={index} className="text-center">
							<td>{index + 1}</td>
							<td>{userRole.name}</td>
							<td>{userRole.is_active ? "Active" : "Inactive"}</td>
							<td className="text-center">
								<div className="btn-group text-right">
									<button type="button" className="btn btn-link btn-xs">Set as Active</button>
									{userRole.is_default ? null : <button type="button" className="btn btn-link btn-xs">Edit</button> }										
									{userRole.is_default ? null : <button type="button" className="btn btn-link btn-xs">Delete</button> }
								</div>
							</td>
						</tr>;
			});
			userRoleView = 	<table className="table table-bordered table-striped table-condensed">
								<thead>
									<tr>
										<th className="text-center">#</th>
										<th className="text-center">Roles</th>
										<th className="text-center">Status</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{UserRoleList}
								</tbody>
							</table>;
		}
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-heading">
							User Roles
							<div className="pull-right">
								<button className="btn btn-primary btn-xs">Add New Role</button>
							</div>
						</div>
						<div className="panel-body">
							{userRoleView}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var EditUserRolesComponent = React.createClass({
	render: function () {
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-heading">
							<button className="btn btn-link btn-xs"><i className="fa fa-chevron-left"></i> </button>
							User Roles
							<div className="pull-right">
								<button className="btn btn-primary btn-xs">Save Role</button>
							</div>
						</div>
						<div className="panel-body">

						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of User Settings Components  ======*/

/*========================================
=            Modal Components            =
========================================*/

/*----------  Message Modal  ----------*/

var SettingsMessageContainerModal = React.createClass({
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
			<div className="modal fade" id="SettingsMessageContainerModal" role="dialog">
				<div className="modal-dialog" role="document">
					{ modalMessageComponent }
				</div>
			</div>
		);
	}
});

/*=====  End of Modal Components  ======*/

/*=====================================
=            Settings Main            =
=====================================*/

var SettingsMain = React.createClass({
	getInitialState: function () {
		return {
			modalView: {
				type: undefined
			},
			mainView: 'EMAIL-SETTINGS'
		};
	},
	_onModalViewChange: function (modalView) {
		this.setState({modalView: modalView});
	},
	render: function () {
		var mainView;
		switch(this.state.mainView) {
			case 'USER-SETTINGS':
				mainView = 	<UserSettingsComponent 
								modalViewChange={this._onModalViewChange}/>;
				break;

			case 'EMAIL-SETTINGS':
				mainView = 	<EmailSettingsComponent />;
				break;
		}
		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="row">
						<div className="col-md-3">
							<div className="panel panel-default">
								<div className="panel-body">
									<div className="form-group">
										<div className="list-group">
											<button
												type="button" 
												className="list-group-item btn-xs active">
													<i className="fa fa-chevron-right fa-fw"></i> User Settings
											</button>
											<button
												type="button" 
												disabled="true"
												className="list-group-item btn-xs">
													<i className="fa fa-chevron-right fa-fw"></i> Email Settings
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-9">
							{mainView}
							<SettingsMessageContainerModal 
								modalView={this.state.modalView}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Settings Main  ======*/

if(typeof $("#settings-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<SettingsMain />,
	document.getElementById('settings-app-node'));
}