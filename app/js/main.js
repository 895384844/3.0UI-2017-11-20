define([
	'angular',
	'config',
	'moment',
	'modules/common/common_module',
	'modules/common/utils/md5',
	'modules/app/menu',
	'modules/app/app_module',
	'modules/auth/auth_module',
	'modules/system/system_module',
	'modules/warning/warning_module',
	'modules/device/device_module',
	'modules/report/report_module',
	'modules/base/base_module',
	'template'
], function (angular, config, moment) {
	moment.locale('zh-cn');
	// add template support for building process
	try {
		angular.module("template");
	} catch (e) {
		console.info(e);
		angular.module("template", []);
	}

	// Declare app level module which depends on filters, and services
	angular.module('webApp', [
			'pascalprecht.translate',
			'angularModalService',
			'ngRoute',
			'ngFileUpload',
			'angular-echarts',
			'ui.grid', 
			'ui.grid.pagination', 
			'ui.grid.selection',
			'ui.grid.i18n',
        	'ui.grid.treeView',
    		'ui.grid.autoResize',
    		'ui.grid.resizeColumns',
    		'ui.grid.moveColumns',
    		'ui.tree',
			'webApp.menu',
			'webApp.config',
			'webApp.common',
			'webApp.app',
			'webApp.auth',
			'webApp.system',
			'webApp.warning',
			'webApp.device',
			'webApp.report',
			'webApp.base',
			'template'
		])
		.config(['$routeProvider', 'API_HOST', 'API_URL', '$httpProvider', '$translateProvider', 'localeText',
			function ($routeProvider, API_HOST, API_URL, $httpProvider, $translateProvider, lt) {
				$routeProvider
					.when('/login', {
						templateUrl: 'js/modules/auth/templates/login.html',
						pageType: 'login'
					})
					.when('/:sectionId', {
						templateUrl: 'js/modules/app/templates/main.html',
						pageType: 'edit'
					})
					.otherwise({
						redirectTo: '/login'
					});

				$httpProvider.interceptors.push(function () {
					return {
						'request': function (config) {
							return config;
						},

						'response': function (response) {
							if (response.data && response.data.data) {
								response.data = response.data.data;
								return response;
							}
							return response;
						}
					};
				});

				$translateProvider.translations('en-US', lt['en-US']);
				var lang = window.navigator.userLanguage || window.navigator.language;
				$translateProvider.preferredLanguage(lang);

			}
		]);
});