define(
function() {
	return ['$scope', 'HttpService', 'title', 'userInfo', 'close', SameClockCtrl];

	function SameClockCtrl($scope, HttpService, title, userInfo, close) {
		$scope.title = "同步设备时钟"
		$scope.close = close;
	}
})
