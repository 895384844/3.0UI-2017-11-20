define(
function() {
	return ['$scope', 'HttpService', 'close', SystemConfigureEditCtrl];

	function SystemConfigureEditCtrl($scope, HttpService, close) {		
		$scope.close = close;
	}
})
