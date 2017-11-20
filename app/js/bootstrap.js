// Include libraries that should be included at "all times" and are dependencies
// to some other behaviors.
//
// Add some functionalities to specific parts of existing libraries
define([
	'jquery',
	'angular',
	'adminLTE',

	'angularTranslate',
	'angularRoute',
	'angularCookies',
	'angularSanitize',
	'angularGrid',
	'angularModalService',
	'angularEcharts',
	'ngFileUpload',
	'angularUITree',

	'fastclick',
	'myBootstrap',
	'lodash',
	'Chart',
	'echarts',
	'datetimepicker',
	
	'moment',
	'main'
], function () {
	angular.element(document).ready(function () {
		var myElement = angular.element('[web-app-main]');
		angular.bootstrap(myElement, ['webApp']);
	});

	require(["template"]);
});