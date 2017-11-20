define([
    'angular',
    './controllers/WarningSystemCtrl',
    './controllers/WarningDeviceCtrl',
    './controllers/WarningDeviceEditCtrl',
    './controllers/WarningBlacklistCtrl',
    './controllers/WarningBlacklistEditCtrl',
    './service/WarningService'
], function(
    angular,
    WarningSystemCtrl,
    WarningDeviceCtrl,
    WarningDeviceEditCtrl,
    WarningBlacklistCtrl,
    WarningBlacklistEditCtrl,
    WarningService
){
    var module = angular.module('webApp.warning', []);

    module.controller({
        WarningSystemCtrl:WarningSystemCtrl,
        WarningDeviceCtrl:WarningDeviceCtrl,
        WarningDeviceEditCtrl:WarningDeviceEditCtrl,
        WarningBlacklistCtrl:WarningBlacklistCtrl,
        WarningBlacklistEditCtrl:WarningBlacklistEditCtrl
    });

    module.factory({
        WarningService: WarningService
    });
});