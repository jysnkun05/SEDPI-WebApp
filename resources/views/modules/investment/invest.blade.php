@extends('layouts.master')
@section('title', 'Investors')
@section('content')
<body class="light-gray-bg">
	@include('layouts.admin-nav')
	<div class="container-fluid" id="invest-app-node"></div>
	<script src="{{asset('js/app-min/investment.min.js')}}"></script>
</body>
@endsection
