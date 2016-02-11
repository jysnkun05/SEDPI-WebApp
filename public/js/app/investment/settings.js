/*=====================================
=            Settings View            =
=====================================*/

var UserSettingSComponent = React.createClass({
	displayName: 'UserSettingSComponent',

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
							React.createElement(
								'div',
								{ className: 'col-md-12' },
								React.createElement(UsersComponents, null),
								React.createElement(UserRolesComponents, { userRoles: this.state.userRoles })
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Settings View  ======*/

/*================================================
=            User Settings Components            =
================================================*/

var UsersComponents = React.createClass({
	displayName: 'UsersComponents',

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
						'Users'
					),
					React.createElement('div', { className: 'panel-body' })
				)
			)
		);
	}
});

/*----------  User Roles  ----------*/

var UserRolesComponents = React.createClass({
	displayName: 'UserRolesComponents',

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
					React.createElement('td', null),
					React.createElement('td', null)
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
						'User Roles'
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

/*=====  End of User Settings Components  ======*/

/*=====================================
=            Settings Main            =
=====================================*/

var SettingsMain = React.createClass({
	displayName: 'SettingsMain',

	render: function () {
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
						React.createElement(UserSettingSComponent, null)
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