@extends('layouts.master')
@section('title', 'Login')
@section('content')
<body class="light-gray-bg">
	@include('layouts.guest-nav')
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-3 col-md-offset-8 login-form">
				@if(count($errors) > 0)
				<div class="panel panel-custom-error" id="message-panel">
					<div class="panel-body">
						@foreach($errors->all() as $error)
						<i class="fa fa-info-circle fa-fw" id="message-icon"></i> <p style="display: inline" id="message-text">{{$error}}</p><br />
						@endforeach
					</div>
				</div>
				@endif
				<div class="panel panel-default">
					<div class="panel-body">
						<form method="POST" action="{{url('login')}}">
							{{csrf_field()}}
							<div class="container-fluid">
								<div class="row">
									<div class="col-md-12">
										<div class="form-group form-brand">
											<img src="{{asset('images/sedpi_logo.png')}}" width="75%">
										</div>
										<div class="form-group">
											<input type="text" class="form-control" name="username" placeholder="Username" value="{{ old('username') }}" />
										</div>
										<div class="form-group">
											<input type="password" class="form-control" name="password" placeholder="Password"/>
										</div>
										<div class="form-group">
											<input type="checkbox" name="remember me"/> Remember Me
										</div>
										<div class="form-group">
											<div class="pull-right">
											<button type="submit" class="btn btn-link">Forgot Password?</button>
											<button type="submit" class="btn btn-primary">Login</button>
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
</body>
@endsection
