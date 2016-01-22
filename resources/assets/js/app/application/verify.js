
/*====================================================
=            Verify User Credentials Form            =
====================================================*/

var VerifyUserCredentialsForm = React.createClass({
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
		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="page-header">
								<h2>Setup User Credentials</h2>
							</div>
							<form onSubmit={this.handleSubmit}>
								<div className="form-group has-feedback" id="fg-username">
									<label className="control-label">Username *</label>
									<input 
										type="text" 
										className="form-control"
										id="input-username"
										value={this.state.username}
										onChange={this.handleChange.bind(null, 'username')}/>
								</div>
								<div className="form-group has-feedback" id="fg-password">
									<label className="control-label">Password *</label>
									<input 
										type="password" 
										id="input-password"
										className="form-control"
										value={this.state.password}
										onChange={this.handleChange.bind(null, 'password')}/>
								</div>
								<div className="form-group has-feedback" id="fg-confirmPassword">
									<label className="control-label">Confirm Password *</label>
									<input 
										type="password"
										id="input-confirmPassword" 
										className="form-control"
										value={this.state.confirmPassword}
										onChange={this.handleChange.bind(null, 'confirmPassword')}/>
								</div>
								<div className="form-group">
									<button type="submit" className="btn btn-primary btn-lg btn-block">Submit User Credentials</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Verify User Credentials Form  ======*/

/*============================================
=            Verify Modal Message            =
============================================*/

var VerifyMessageContainerModal = React.createClass({
	render: function () {
		var modalMessageComponent;
		switch(this.props.modalView) {
			case 'SAVING':
				modalMessageComponent = <div className="panel panel-default">
											<div className="panel-heading">
												Setup User Credentials
											</div>
											<div className="panel-body">
												<div className="row">
													<div className="col-md-12">
														<div className="form-group">
															<p className="text-center"><i className="fa fa-circle-o-notch fa-2x fa-spin"></i></p>
															<p className="text-center">Validating User Credentials.</p>
															<p className="text-center">Please wait...</p>
														</div>
													</div>
												</div>
											</div>
										</div>;
				break;

			case 'SUCCESS':
				modalMessageComponent = <div className="panel-custom-success">
										   	<div className="panel-body">
										   		<div className="row">
										   			<div className="col-md-12">
														<i className="fa fa-check-circle fa-fw"></i> User Credentials has been setup. You can access now your account.
											   			<button className="close" data-dismiss="modal">&times;</button>
										   			</div>
										   		</div>
										   	</div>
										</div>;
				break;

		}
		return (
			<div className="modal fade" id="VerifyMessageContainerModal" role="dialog">
				<div className="modal-dialog" role="document">
					{ modalMessageComponent }
				</div>
			</div>
		);
	}
});

/*=====  End of Verify Modal Message  ======*/

/*===================================
=            Verify Main            =
===================================*/

var VerifyMain = React.createClass({
	getInitialState: function () {
		return {
			modalView: undefined
		};
	},
	onModalViewChange: function (modalViewKeyword) {
		this.setState({modalView: modalViewKeyword});
	},
	render: function () {
		return (
			<div className="row">
				<div className="col-md-6 col-md-offset-3">
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="form-group">
								<h2>{"Alright! We're almost done."}</h2>
							</div>
							<div className="form-group">
								<p>{"Your account is almost ready. In order to activate and access your account, you need to setup your user credentials by filling up the form below."}</p>
							</div>
							<VerifyUserCredentialsForm modalViewChange={this.onModalViewChange}/>
							<VerifyMessageContainerModal modalView={this.state.modalView}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

/*=====  End of Verify Main  ======*/

if(typeof $("#verify-app-node").prop('tagName') !== typeof undefined)
{
	ReactDOM.render(
	<VerifyMain />,
	document.getElementById('verify-app-node'));
}