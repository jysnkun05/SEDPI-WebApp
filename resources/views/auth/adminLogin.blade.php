@extends('layouts.master')
@section('title', 'Administrator Login')
@section('content')
<body class="light-gray-bg">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-4 col-md-offset-4 login-form">
				@if(count($errors) > 0)
				<div class="panel panel-custom-error" id="message-panel">
					<div class="panel-body">
						@foreach($errors->all() as $error)
						<i class="fa fa-info-circle fa-fw" id="message-icon"></i> <p style="display: inline" id="message-text">{{$error}}</p><br />
						@endforeach
					</div>
				</div>
				@endif
				<form method="POST" action="{{url('login')}}">
					{{csrf_field()}}
					<div class="container-fluid">
						<div class="row">
							<div class="col-md-12">
								<div class="form-group form-brand">
									<img src="{{asset('images/sedpi_logo.png')}}" width="75%">
									<p class="text-center">Administrator Login</p>
								</div>
								<div class="form-group">
									<input type="text" class="form-control" name="email" placeholder="Email Address" value="{{ old('email') }}" />
								</div>
								<div class="form-group">
									<input type="password" class="form-control" name="password" placeholder="Password"/>
								</div>
								<div class="form-group">
									<input type="checkbox" name="remember me"/> Remember Me
								</div>
								<div class="form-group">
									<button type="submit" class="btn btn-primary btn-block">Login</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</body>
@endsection
