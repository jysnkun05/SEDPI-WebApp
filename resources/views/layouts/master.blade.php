<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="csrf-token" content="{{csrf_token()}}">
	<title>@yield('title') - SEDPI</title>
	<link rel="stylesheet" type="text/css" href="{{asset('css/common/bootstrap.css')}}">
	<link rel="stylesheet" type="text/css" href="{{asset('css/common/bootstrap-datepicker.css')}}">
	<link rel="stylesheet" type="text/css" href="{{asset('css/common/font-awesome.css')}}">
	<link rel="stylesheet" type="text/css" href="{{asset('css/custom.css')}}">

	<script src="{{asset('js/common/react.js')}}"></script>
	<script src="{{asset('js/common/react-dom.js')}}"></script>
	<script src="{{asset('js/common/jquery.js')}}"></script>
	<script src="{{asset('js/common/jquery-ui.js')}}"></script>
	<script src="{{asset('js/common/moment.js')}}"></script>
	<script src="{{asset('js/common/moment-timezone-with-data-2010-2020.js')}}"></script>
	<script src="{{asset('js/common/bootstrap.js')}}"></script>
	<script src="{{asset('js/common/bootstrap-datepicker.js')}}"></script>
	<script src="{{asset('js/common/accounting.js')}}"></script>
	<script type="text/javascript">
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')
			}
		});
	</script>
</head>
@yield('content')
</html>