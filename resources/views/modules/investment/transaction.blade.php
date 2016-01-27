@extends('layouts.master')
@section('title', 'Transaction')
@section('content')
<body class="light-gray-bg">
	@include('layouts.admin-nav')
	<div class="container-fluid" id="transaction-app-node"></div>
	<!--script src="{{asset('js/app-min/investment.min.js')}}"></script-->
	<script src="{{asset('js/app/investment/transaction.js')}}"></script>
</body>
@endsection
