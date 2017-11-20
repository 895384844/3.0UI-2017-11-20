define(
function() {
	return ['$scope', 'HttpService', 'close', SystemResetPwdCtrl];

	function SystemResetPwdCtrl($scope, HttpService, close) {
		
		$scope.close = close;
	}
})
