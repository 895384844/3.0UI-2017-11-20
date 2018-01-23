define([
	'angular',
	'./controllers/BusUserCtrl',
	'./controllers/BlackListCtrl',
	'./controllers/BacklistAlarmNotifyPolicyCtrl',
	'./controllers/BacklistAlarmNotifyPolicyFormCtrl',
	'./controllers/DeviceAlarmNotifyPolicyCtrl',
	'./controllers/DeviceAlarmNotifyPolicyFormCtrl',
	'./controllers/DeviceAlarmNotifyPolicyEditCtrl',
	'./controllers/BusUserListCtrl',
	'./controllers/BlackListFormCtrl',
	'./controllers/BusUserEditCtrl',
	'./controllers/BlacklistAlarmNotifyPolicyEditCtrl',
	'./controllers/BlacklistEditCtrl',
	'./controllers/BlackListImportCtrl',
	'./controllers/BusUserImportCtrl'
	
], function (angular,
             BusUserCtrl,
			 BlackListCtrl,
			 BacklistAlarmNotifyPolicyCtrl,
			 BacklistAlarmNotifyPolicyFormCtrl,
			 DeviceAlarmNotifyPolicyCtrl,
			 DeviceAlarmNotifyPolicyFormCtrl,
			 DeviceAlarmNotifyPolicyEditCtrl,
			 BusUserListCtrl,
			 BlackListFormCtrl,
			 BusUserEditCtrl,
			 BlacklistAlarmNotifyPolicyEditCtrl,
			 BlacklistEditCtrl,
			 BlackListImportCtrl,
			 BusUserImportCtrl) {

	var module = angular.module('webApp.base', []);

	module.controller({
		BusUserCtrl: BusUserCtrl,
		BlackListCtrl: BlackListCtrl,
		BacklistAlarmNotifyPolicyCtrl: BacklistAlarmNotifyPolicyCtrl,
		BacklistAlarmNotifyPolicyFormCtrl:BacklistAlarmNotifyPolicyFormCtrl,
		DeviceAlarmNotifyPolicyCtrl: DeviceAlarmNotifyPolicyCtrl,
		DeviceAlarmNotifyPolicyFormCtrl:DeviceAlarmNotifyPolicyFormCtrl,
		DeviceAlarmNotifyPolicyEditCtrl: DeviceAlarmNotifyPolicyEditCtrl,
		BusUserListCtrl: BusUserListCtrl,
		BlackListFormCtrl: BlackListFormCtrl,
		BusUserEditCtrl: BusUserEditCtrl,
		BlacklistAlarmNotifyPolicyEditCtrl: BlacklistAlarmNotifyPolicyEditCtrl,
		BlacklistEditCtrl: BlacklistEditCtrl,
		BlackListImportCtrl: BlackListImportCtrl,
		BusUserImportCtrl: BusUserImportCtrl
	});

});