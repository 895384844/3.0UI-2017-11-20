define(
function() {
	return ['$scope', 'HttpService', 'title', 'userInfo', 'close', RestartCaptureCtrl];

	function RestartCaptureCtrl($scope, HttpService, title, userInfo, close) {
		$scope.title = "重启捕获程序"
		$scope.close = close;
	}
})
