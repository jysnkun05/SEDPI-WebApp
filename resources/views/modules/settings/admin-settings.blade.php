@extends('layouts.master')
@section('title', 'Settings')
@section('content')
<body class="light-gray-bg">
	@include('layouts.admin-nav')
	<div class="container-fluid" id="settings-app-node"></div>
	<script src="{{asset('js/app-min/investment.min.js')}}"></script>
</body>
@endsection
