define([
	'angular',
	'./controllers/DeviceListCtrl',
	'./controllers/DeviceListFormCtrl',
	'./controllers/DeviceListEditCtrl',
	'./controllers/RestartCaptureCtrl',
	'./controllers/CloseCaptureCtrl',
	'./controllers/CatchPointCtrl',
	'./controllers/RestartSystemCtrl',
	'./controllers/SameClockCtrl',
	'./controllers/DeviceImportCtrl',
	'./controllers/DeviceMoveCtrl',
	'./controllers/DeviceDeleteCtrl'
], function (angular,
             DeviceListCtrl,
			 DeviceListFormCtrl,
			 DeviceListEditCtrl,
			 RestartCaptureCtrl,
			 CloseCaptureCtrl,
			 CatchPointCtrl,
			 RestartSystemCtrl,
			 SameClockCtrl,
			 DeviceImportCtrl,
			 DeviceMoveCtrl,
			 DeviceDeleteCtrl) {

	var module = angular.module('webApp.device', []);

	module.controller({
		DeviceListCtrl: DeviceListCtrl,
		DeviceListFormCtrl: DeviceListFormCtrl,
		DeviceListEditCtrl: DeviceListEditCtrl,
		RestartCaptureCtrl: RestartCaptureCtrl,
		CloseCaptureCtrl: CloseCaptureCtrl,
		CatchPointCtrl: CatchPointCtrl,
		RestartSystemCtrl: RestartSystemCtrl,
		SameClockCtrl: SameClockCtrl,
		DeviceImportCtrl: DeviceImportCtrl,
		DeviceMoveCtrl: DeviceMoveCtrl,
		DeviceDeleteCtrl: DeviceDeleteCtrl
	});

});