@extends('layouts.master')
@section('title', 'Apply Member')
@section('content')
<body class="light-gray-bg">
	@include('layouts.guest-nav')
	<div class="container-fluid" id="apply-app-node"></div>
	<script src="{{asset('js/app-min/application.min.js')}}"></script>
	<!--script src="{{asset('js/app/application/apply.js')}}"></script-->
</body>
@endsection
