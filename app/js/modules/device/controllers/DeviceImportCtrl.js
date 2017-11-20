define(
function() {
	return ['$scope', 'HttpService', 'close', DeviceImportCtrl];

	function DeviceImportCtrl($scope, HttpService, close) {		
		$scope.close = close;
	}
})
