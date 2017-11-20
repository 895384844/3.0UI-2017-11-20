define(
	function () {
		return ['$scope', 'HttpService','SystemService', 'title','query','close', AboutCtrl];
		function AboutCtrl($scope, HttpService,SystemService,title, query,close) {

			$scope.query = query;
			
			$scope.close=close;
		}
	});
