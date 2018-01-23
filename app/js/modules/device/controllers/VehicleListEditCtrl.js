define(
	function () {
		return ['$scope', 'HttpService','SystemService','row','close', VehicleListEditCtrl];
		function VehicleListEditCtrl($scope, HttpService,SystemService,row,close) {
			$scope.device = row;
			$scope.save = function(){
				SystemService.saveOrUpdateUser('rest/device/vehicle/save',$scope.device).then(function success(data){
					close();
				})
			}
			$scope.clear = function(){
				$scope.device = {};
			}

			$scope.close=close;
		}
	});
