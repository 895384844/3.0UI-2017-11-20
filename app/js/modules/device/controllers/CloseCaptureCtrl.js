define(
function() {
	return ['$scope', 'HttpService', 'title', 'userInfo', 'close', CloseCaptureCtrl];

	function CloseCaptureCtrl($scope, HttpService, title, userInfo, close) {
		$scope.title = "关闭捕获程序"
		$scope.close = close;
	}
})
