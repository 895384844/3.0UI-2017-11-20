define(
function() {
	return ['$scope', 'HttpService', 'title', 'userInfo', 'close', RestartSystemCtrl];

	function RestartSystemCtrl($scope, HttpService, title, userInfo, close) {
		$scope.title = "重启设备系统"
		$scope.close = close;
	}
})
