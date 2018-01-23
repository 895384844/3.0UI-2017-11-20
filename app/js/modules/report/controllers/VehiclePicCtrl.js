define(
	function () {
		return ['$scope', 'HttpService','$http', 'SystemService','row','GridService','GetLocalTime','close', VehiclePicCtrl];
		function VehiclePicCtrl($scope, HttpService,$http,SystemService,row,GridService, GetLocalTime,close) {			
			
			$scope.close = close;
			
			var str = 'carimages/' + row.fileName;
			
	   		$scope.pic = str;
		    
		}
	});
