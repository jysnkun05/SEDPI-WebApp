@extends('layouts.master')
@section('title', 'Member Application')
@section('content')
<body class="light-gray-bg">
	@include('layouts.admin-nav')
	<div class="container-fluid" id="application-app-node"></div>
	<script src="{{asset('js/app/membership/application.js')}}"></script>
</body>
@endsection
