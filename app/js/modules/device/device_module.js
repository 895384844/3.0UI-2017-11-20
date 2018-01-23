define([
	'angular',
	'./controllers/DeviceListCtrl',
	'./controllers/DeviceListFormCtrl',
	'./controllers/DeviceImportCtrl',
	'./controllers/DeviceMoveCtrl',
	'./controllers/DeviceDeleteCtrl',
	'./controllers/DeviceSetCtrl',
	'./controllers/DeviceListEditCtrl',
	'./controllers/VehicleListCtrl',
	'./controllers/VehicleListFormCtrl',
	'./controllers/VehicleImportCtrl',
	'./controllers/VehicleDeleteCtrl',
	'./controllers/VehicleListEditCtrl',
	'./controllers/VehicleMoveCtrl'
], function (angular,
             DeviceListCtrl,
			 DeviceListFormCtrl,
			 DeviceImportCtrl,
			 DeviceMoveCtrl,
			 DeviceDeleteCtrl,
			 DeviceSetCtrl,
			 DeviceListEditCtrl,
			 VehicleListCtrl,
			 VehicleListFormCtrl,
			 VehicleImportCtrl,
 			 VehicleDeleteCtrl,
			 VehicleListEditCtrl,
			 VehicleMoveCtrl) {

	var module = angular.module('webApp.device', []);

	module.controller({
		DeviceListCtrl: DeviceListCtrl,
		DeviceListFormCtrl: DeviceListFormCtrl,
		DeviceImportCtrl: DeviceImportCtrl,
		DeviceMoveCtrl: DeviceMoveCtrl,
		DeviceDeleteCtrl: DeviceDeleteCtrl,
		DeviceSetCtrl: DeviceSetCtrl,
		DeviceListEditCtrl: DeviceListEditCtrl,
		VehicleListCtrl: VehicleListCtrl,
		VehicleListFormCtrl: VehicleListFormCtrl,
		VehicleImportCtrl: VehicleImportCtrl,
		VehicleDeleteCtrl: VehicleDeleteCtrl,
		VehicleListEditCtrl: VehicleListEditCtrl,
		VehicleMoveCtrl: VehicleMoveCtrl
	});

});