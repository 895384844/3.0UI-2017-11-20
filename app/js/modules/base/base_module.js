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
	'./controllers/BlacklistEditCtrl'
	
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
			 BlacklistEditCtrl) {

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
		BlacklistEditCtrl: BlacklistEditCtrl
	});

});