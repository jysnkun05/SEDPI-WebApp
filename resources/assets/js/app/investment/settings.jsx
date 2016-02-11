/*=====================================
=            Settings View            =
=====================================*/

var UserSettingSComponent = React.createClass({
	getInitialState: function () {
		return {
			userRoles: undefined
		};
	},
	componentWillMount: function () {
		this._getAllUserRoles(0);
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
	render: function () {
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="page-header">
								<h2>User Settings</h2>
							</div>
							<div className="row">
								<div className="col-md-12">
									<UsersComponents />
									<UserRolesComponents userRoles={this.state.userRoles}/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Settings View  ======*/

/*================================================
=            User Settings Components            =
================================================*/

var UsersComponents = React.createClass({
	render: function () {
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="panel panel-default">
						<div className="panel-heading">
							Users
						</div>
						<div className="panel-body">
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*----------  User Roles  ----------*/

var UserRolesComponents = React.createClass({
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
							<td></td>
							<td></td>
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

/*=====  End of User Settings Components  ======*/


/*=====================================
=            Settings Main            =
=====================================*/

var SettingsMain = React.createClass({
	render: function () {
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
							<UserSettingSComponent />
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