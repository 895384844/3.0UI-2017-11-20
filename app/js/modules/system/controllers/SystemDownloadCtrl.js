define(
function() {
	return ['$scope', 'HttpService', 'close', SystemDownloadCtrl];

	function SystemDownloadCtrl($scope, HttpService, close) {
		
		$scope.close = close;
	}
})
