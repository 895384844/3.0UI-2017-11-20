define(
	function() {
		return ['$scope', 'HttpService', 'title', 'userInfo', 'close', CatchPointCtrl];

		function CatchPointCtrl($scope, HttpService, title, userInfo, close) {
			$scope.title = "捕获近设备频点"
			$scope.close = close;
		}
	}
)