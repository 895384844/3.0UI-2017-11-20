define([
    'angular',
    './controllers/SystemScopeCtrl',
    './controllers/SystemUserCtrl',
    './controllers/SystemUserEditCtrl',
    './controllers/SystemRoleCtrl',
    './controllers/SystemRoleEditCtrl',
    './controllers/SystemConfigureCtrl',
    './controllers/SystemLogCtrl',
    './controllers/SystemLicenseCtrl',
    './controllers/SystemEditCtrl',
    './controllers/SystemUserRoleCtrl',
    './controllers/SystemResetPwdCtrl',
    './controllers/SystemDownloadCtrl',
    './controllers/SystemRolePowerCtrl',
    './controllers/SystemRoleMenuCtrl',
    './controllers/SystemLicenseImportCtrl',
    './controllers/SystemConfigureEditCtrl',
    './controllers/SystemConfigureFormCtrl',
    './controllers/SetMsgCtrl',
    './controllers/SetMapCtrl',
    './controllers/SetResidenCtrl',
    './controllers/SystemUserSet',
    './controllers/SystemScopeFormCtrl',
    './controllers/SystemScopeDeleteCtrl',
    './controllers/SystemScopeEditCtrl',
    './controllers/SystemUserFormCtrl',
    './controllers/AuditLogCtrl',
    //'./controllers/ShowMapCtrl',
    './services/SystemService'
], function(
    angular,
    SystemScopeCtrl,
    SystemUserCtrl,
    SystemUserEditCtrl,
    SystemRoleCtrl,
    SystemRoleEditCtrl,
    SystemConfigureCtrl,
    SystemLogCtrl,
    SystemLicenseCtrl,
    SystemEditCtrl,
    SystemUserRoleCtrl,
    SystemResetPwdCtrl,
    SystemDownloadCtrl,
    SystemRolePowerCtrl,
    SystemRoleMenuCtrl,
    SystemLicenseImportCtrl,
    SystemConfigureEditCtrl,
    SystemConfigureFormCtrl,
    SetMsgCtrl,
    SetMapCtrl,
    SetResidenCtrl,
    SystemUserSet,
    SystemScopeFormCtrl,
    SystemScopeDeleteCtrl,
    SystemScopeEditCtrl,
    SystemUserFormCtrl,
    AuditLogCtrl,
   // ShowMapCtrl,
    SystemService
){
    var module = angular.module('webApp.system', []);

    module.controller({
        SystemScopeCtrl:SystemScopeCtrl,
        SystemUserCtrl: SystemUserCtrl,
        SystemUserEditCtrl:SystemUserEditCtrl,
        SystemRoleCtrl: SystemRoleCtrl,
        SystemRoleEditCtrl:SystemRoleEditCtrl,
        SystemConfigureCtrl: SystemConfigureCtrl,
        SystemLicenseCtrl:SystemLicenseCtrl,
        SystemEditCtrl: SystemEditCtrl,
        SystemUserRoleCtrl: SystemUserRoleCtrl,
        SystemResetPwdCtrl: SystemResetPwdCtrl,
        SystemDownloadCtrl:SystemDownloadCtrl,
        SystemRolePowerCtrl: SystemRolePowerCtrl,
        SystemRoleMenuCtrl: SystemRoleMenuCtrl,
        SystemLicenseImportCtrl: SystemLicenseImportCtrl,
        SystemConfigureEditCtrl: SystemConfigureEditCtrl,
        SystemConfigureFormCtrl: SystemConfigureFormCtrl,
        SetMsgCtrl: SetMsgCtrl,
        SetMapCtrl: SetMapCtrl,
        SetResidenCtrl: SetResidenCtrl,
        SystemUserSet: SystemUserSet,
        SystemScopeFormCtrl: SystemScopeFormCtrl,
        SystemScopeDeleteCtrl: SystemScopeDeleteCtrl,
        SystemScopeEditCtrl: SystemScopeEditCtrl,
        SystemUserFormCtrl: SystemUserFormCtrl,
        SystemLogCtrl:SystemLogCtrl,
        AuditLogCtrl: AuditLogCtrl
    });

    module.factory({
        SystemService: SystemService
    });
});