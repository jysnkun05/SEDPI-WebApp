@extends('layouts.master')
@section('title', 'Deposit')
@section('content')
<body class="light-gray-bg">
	@include('layouts.investor-nav')
	<div class="container-fluid" id="deposit-app-node"></div>
	<!--script src="{{asset('js/app-min/investors.min.js')}}"></script-->
	<script src="{{asset('js/app/investors/deposit.js')}}"></script>
</body>
@endsection
