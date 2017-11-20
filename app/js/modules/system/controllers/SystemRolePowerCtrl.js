define(
	function() {
		return ['$scope', 'close', SystemRolePowerCtrl];

		function SystemRolePowerCtrl($scope,  close) {
			
			$scope.close = close;
		}
	})