define([
	'angular',
	'./controllers/CaseListCtrl',
	'./controllers/CaseListFormCtrl',
	'./controllers/CaseListEditCtrl'
], function (angular,
             CaseListCtrl,
			 CaseListFormCtrl,
			 CaseListEditCtrl) {

	var module = angular.module('webApp.case', []);

	module.controller({
		CaseListCtrl: CaseListCtrl,
		CaseListFormCtrl: CaseListFormCtrl,
		CaseListEditCtrl: CaseListEditCtrl
	});

});