define(
	function () {
		return ['$scope', 'HttpService','SystemService', 'title','query', 'close', AboutCtrl];
		function AboutCtrl($scope, HttpService,SystemService,title, query, close) {

			$scope.query = query;
			
			HttpService.get('rest/tool/customization/get').then(function success(resp){
				$scope.copyright = resp.copyright;
			})
			
			$scope.close=close;
		}
	});
