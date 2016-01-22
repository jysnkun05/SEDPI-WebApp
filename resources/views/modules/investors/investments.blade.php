@extends('layouts.master')
@section('title', 'My Investments')
@section('content')
<body class="light-gray-bg">
	@include('layouts.investor-nav')
	<div class="container-fluid" id="investments-app-node"></div>
	<script src="{{asset('js/app-min/investors.min.js')}}"></script>
	<!--script src="{{asset('js/app/investors/investments.js')}}"></script-->
</body>
@endsection
