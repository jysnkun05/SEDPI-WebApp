@extends('layouts.master')
@section('title', 'Email Verification')
@section('content')
<body class="light-gray-bg">
	@include('layouts.guest-nav')
	<div class="container-fluid" id="verify-app-node"></div>
	<script src="{{asset('js/app-min/application.min.js')}}"></script>
	<!--script src="{{asset('js/app/application/verify.js')}}"></script-->
</body>
@endsection
