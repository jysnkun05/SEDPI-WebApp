@extends('layouts.master')
@section('title', 'Members')
@section('content')
<body class="light-gray-bg">
	@include('layouts.admin-nav')
	<div class="container-fluid" id="members-app-node"></div>
	<script src="{{asset('js/app/membership/members.js')}}"></script>
</body>
@endsection
