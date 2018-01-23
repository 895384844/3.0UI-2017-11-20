define([
	'angular',
	'./controllers/MapCtrl'
], function (angular,
             MapCtrl) {

	var module = angular.module('webApp.map', []);

	module.controller({
		MapCtrl: MapCtrl
	});

});