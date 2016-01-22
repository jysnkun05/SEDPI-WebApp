
/*====================================================
=            Verify User Credentials Form            =
====================================================*/

var VerifyUserCredentialsForm = React.createClass({
	displayName: 'VerifyUserCredentialsForm',

	getInitialState: function () {
		return {
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
	handleSubmit: function (e) {
		e.preventDefault();

		this.props.modalViewChange('SAVING');
		$("#VerifyMessageContainerModal").modal();
		$("#VerifyMessageContainerModal").data('bs.modal').options.keyboard = false;
		$("#VerifyMessageContainerModal").data('bs.modal').options.backdrop = 'static';

		var postData = {
			username: this.state.username.trim(),
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			verification_code: window.location.href.split('/')[4]
		};

		$.each(postData, function (key, value) {
			$("#fg-" + key).removeClass('has-error');
			$("#input-" + key).popover('destroy');
		});

		this.setState({
			user: postData.username
		});

		$.ajax({
			url: '/api/verify/setUserCredentials',
			type: 'POST',
			data: postData,
			success: function (response) {
				this.props.modalViewChange('SUCCESS');
				$("#VerifyMessageContainerModal").data('bs.modal').options.keyboard = true;
				$("#VerifyMessageContainerModal").data('bs.modal').options.backdrop = true;
				$("#VerifyMessageContainerModal").on('hidden.bs.modal', function () {
					window.location.replace(response.url);
				});
			}.bind(this),
			error: function (response) {
				$("#VerifyMessageContainerModal").modal('hide');
				if (response.status === 422) {
					$.each(response.responseJSON, function (key, value) {
						$("#fg-" + key).addClass('has-error');
						$("#input-" + key).popover({ trigger: 'hover', content: value, placement: 'top' });
					});
				}
			}
		});
	},
	render: function () {
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-10 col-md-offset-1' },
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
								'Setup User Credentials'
							)
						),
						React.createElement(
							'form',
							{ onSubmit: this.handleSubmit },
							React.createElement(
								'div',
								{ className: 'form-group has-feedback', id: 'fg-username' },
								React.createElement(
									'label',
									{ className: 'control-label' },
									'Username *'
								),
								React.createElement('input', {
									type: 'text',
									className: 'form-control',
									id: 'input-username',
									value: this.state.username,
									onChange: this.handleChange.bind(null, 'username') })
							),
							React.createElement(
								'div',
								{ className: 'form-group has-feedback', id: 'fg-password' },
								React.createElement(
									'label',
									{ className: 'control-label' },
									'Password *'
								),
								React.createElement('input', {
									type: 'password',
									id: 'input-password',
									className: 'form-control',
									value: this.state.password,
									onChange: this.handleChange.bind(null, 'password') })
							),
							React.createElement(
								'div',
								{ className: 'form-group has-feedback', id: 'fg-confirmPassword' },
								React.createElement(
									'label',
									{ className: 'control-label' },
									'Confirm Password *'
								),
								React.createElement('input', {
									type: 'password',
									id: 'input-confirmPassword',
									className: 'form-control',
									value: this.state.confirmPassword,
									onChange: this.handleChange.bind(null, 'confirmPassword') })
							),
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'button',
									{ type: 'submit', className: 'btn btn-primary btn-lg btn-block' },
									'Submit User Credentials'
								)
							)
						)
					)
				)
			)
		);
	}
});

/*=====  End of Verify User Credentials Form  ======*/

/*============================================
=            Verify Modal Message            =
============================================*/

var VerifyMessageContainerModal = React.createClass({
	displayName: 'VerifyMessageContainerModal',

	render: function () {
		var modalMessageComponent;
		switch (this.props.modalView) {
			case 'SAVING':
				modalMessageComponent = React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-heading' },
						'Setup User Credentials'
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
										'Validating User Credentials.'
									),
									React.createElement(
										'p',
										{ className: 'text-center' },
										'Please wait...'
									)
								)
							)
						)
					)
				);
				break;

			case 'SUCCESS':
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
								' User Credentials has been setup. You can access now your account.',
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
			{ className: 'modal fade', id: 'VerifyMessageContainerModal', role: 'dialog' },
			React.createElement(
				'div',
				{ className: 'modal-dialog', role: 'document' },
				modalMessageComponent
			)
		);
	}
});

/*=====  End of Verify Modal Message  ======*/

/*===================================
=            Verify Main            =
===================================*/

var VerifyMain = React.createClass({
	displayName: 'VerifyMain',

	getInitialState: function () {
		return {
			modalView: undefined
		};
	},
	onModalViewChange: function (modalViewKeyword) {
		this.setState({ modalView: modalViewKeyword });
	},
	render: function () {
		return React.createElement(
			'div',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-md-6 col-md-offset-3' },
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
								'h2',
								null,
								"Alright! We're almost done."
							)
						),
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'p',
								null,
								"Your account is almost ready. In order to activate and access your account, you need to setup your user credentials by filling up the form below."
							)
						),
						React.createElement(VerifyUserCredentialsForm, { modalViewChange: this.onModalViewChange }),
						React.createElement(VerifyMessageContainerModal, { modalView: this.state.modalView })
					)
				)
			)
		);
	}
});

/*=====  End of Verify Main  ======*/

if (typeof $("#verify-app-node").prop('tagName') !== typeof undefined) {
	ReactDOM.render(React.createElement(VerifyMain, null), document.getElementById('verify-app-node'));
}