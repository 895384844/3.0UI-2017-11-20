define(
function() {
	return ['$scope', 'HttpService', 'close', SystemConfigureFormCtrl];

	function SystemConfigureFormCtrl($scope, HttpService, close) {		
		$scope.close = close;
	}
})
