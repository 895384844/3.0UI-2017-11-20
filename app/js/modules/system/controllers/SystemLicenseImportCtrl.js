define(
function() {
	return ['$scope', 'HttpService', 'close', SystemLicenseImportCtrl];

	function SystemLicenseImportCtrl($scope, HttpService, close) {		
		$scope.close = close;
	}
})
