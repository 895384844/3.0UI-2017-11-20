define([
	'angular',
	'./controllers/CustomizationCtrl'
], function (angular,
             CustomizationCtrl) {

	var module = angular.module('webApp.tools', []);

	module.controller({
		CustomizationCtrl: CustomizationCtrl
	});

});