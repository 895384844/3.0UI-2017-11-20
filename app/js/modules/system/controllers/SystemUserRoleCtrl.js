define(
	function () {
		return ['$scope', 'HttpService', 'close', SystemUserRoleCtrl];
		function SystemUserRoleCtrl($scope, HttpService,close) {

			$scope.close=close;


		}
	});
