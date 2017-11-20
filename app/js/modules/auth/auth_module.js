define([
	'angular',
	'./controllers/LoginPageCtrl',
	'./services/SessionService'
], function (angular, LoginPageCtrl, SessionService) {
	var module = angular.module('webApp.auth', ['webApp.config']);

	module.controller({
		LoginPageCtrl: LoginPageCtrl
	});

	module.service({
		SessionService: SessionService
	});
});