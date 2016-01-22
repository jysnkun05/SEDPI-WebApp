var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var babel = require('gulp-babel');
var checkFileSize = require('gulp-check-filesize');

var libpath = './bower_components/';

gulp.task('common-css', function () {
	return gulp.src([
		libpath + 'bootstrap/dist/css/bootstrap.css',
		libpath + 'font-awesome/css/font-awesome.css',
		libpath + 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css',
	])
	.pipe(checkFileSize())
	.pipe(gulp.dest('./public/css/common/'));
});

gulp.task('common-js', function () {
	return gulp.src([
		libpath + 'bootstrap/dist/js/bootstrap.js',
		libpath + 'jquery/dist/jquery.js',
		libpath + 'jquery-ui/jquery-ui.js',
		libpath + 'moment/moment.js',
		libpath + 'moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
		libpath + 'bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
		libpath + 'react/react-dom.js',
		libpath + 'react/react.js',
		libpath + 'accounting.js/accounting.js'
	])
	.pipe(checkFileSize())
	.pipe(gulp.dest('./public/js/common/'));
});

gulp.task('common-fonts', function () {
	return gulp.src([
		libpath + 'bootstrap/dist/fonts/*.*',
		libpath + 'font-awesome/fonts/*.*',
	])
	.pipe(checkFileSize())
	.pipe(gulp.dest('./public/css/fonts/'));
});

gulp.task('common', ['common-css', 'common-js', 'common-fonts', 'watch']);

gulp.task('apply', function () {
	return gulp.src('./resources/assets/js/app/application/apply.js')
		.pipe(babel())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app/application/'));
});

gulp.task('application', function () {
	return gulp.src('./resources/assets/js/app/membership/application.js')
		.pipe(babel())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app/membership/'));
});

gulp.task('membership', function () {
	return gulp.src('./resources/assets/js/app/membership/members.js')
		.pipe(babel())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app/membership/'));
});

gulp.task('deposit', function () {
	return gulp.src('./resources/assets/js/app/investors/deposit.js')
		.pipe(babel())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app/investors/'));
});

gulp.task('investment', function () {
	return gulp.src('./resources/assets/js/app/investment/invest.js')
		.pipe(babel())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app/investment/'));
});

gulp.task('transaction', function () {
	return gulp.src('./resources/assets/js/app/investment/transaction.js')
		.pipe(babel())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app/investment/'));
});

gulp.task('verify', function () {
	return gulp.src('./resources/assets/js/app/application/verify.js')
		.pipe(babel())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app/application/'));
});

gulp.task('investments', function () {
	return gulp.src('./resources/assets/js/app/investors/investments.js')
		.pipe(babel())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app/investors/'));
});

gulp.task('application-min', function () {
	return  gulp.src('./public/js/app/application/*.js')
		.pipe(concat('application.min.js'))
		.pipe(uglify())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app-min/'));
});

gulp.task('investment-min', function () {
	return gulp.src('./public/js/app/investment/*.js')
		.pipe(concat('investment.min.js'))
		.pipe(uglify())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app-min/'));
});

gulp.task('investors-min', function () {
	return gulp.src('./public/js/app/investors/*.js')
		.pipe(concat('investors.min.js'))
		.pipe(uglify())
		.pipe(checkFileSize())
		.pipe(gulp.dest('./public/js/app-min/'));
});

gulp.task('watch', function () {
	gulp.watch('./resources/assets/js/app/application/apply.js', ['apply']);
	gulp.watch('./resources/assets/js/app/application/verify.js', ['verify']);
	gulp.watch('./resources/assets/js/app/membership/application.js', ['application']);
	gulp.watch('./resources/assets/js/app/membership/members.js', ['membership']);	
	gulp.watch('./resources/assets/js/app/investors/deposit.js', ['deposit']);
	gulp.watch('./resources/assets/js/app/investors/investments.js', ['investments']);
	gulp.watch('./resources/assets/js/app/investment/invest.js', ['investment']);
	gulp.watch('./resources/assets/js/app/investment/transaction.js', ['transaction']);
});

gulp.task('default', ['watch']);
