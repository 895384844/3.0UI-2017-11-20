define([
	'angular',
	'./controllers/AppCtrl',
	'./controllers/TabsCtrl',
	'./controllers/MapMainCtrl',
	'./controllers/HeaderCtrl',
	'./controllers/MenusCtrl',
	'./controllers/LicenseCtrl',
	'./controllers/HomepageCtrl',
	'./controllers/AboutCtrl',
	'./services/SectionsService',
	'./services/ChartsService'
], function (angular,
             AppCtrl,
             TabsCtrl,
             MapMainCtrl,
             HeaderCtrl,
             MenusCtrl,
             LicenseCtrl,
             HomepageCtrl,
             AboutCtrl,
             SectionsService,
             ChartsService
             ) {
	var module = angular.module('webApp.app', ['webApp.menu', 'webApp.config']);

	module.controller({
		AppCtrl: AppCtrl,
		TabsCtrl:TabsCtrl,
		MapMainCtrl: MapMainCtrl,
		HeaderCtrl: HeaderCtrl,
		MenusCtrl: MenusCtrl,
		LicenseCtrl: LicenseCtrl,
		HomepageCtrl: HomepageCtrl,
		AboutCtrl: AboutCtrl
	});

	module.factory({
		SectionsService: SectionsService,
		ChartsService:ChartsService
	});
});