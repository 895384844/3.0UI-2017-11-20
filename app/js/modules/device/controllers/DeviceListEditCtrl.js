define(
	function () {
		return ['$scope', 'HttpService', 'SystemService','close', 'row',DeviceListEditCtrl];
		function DeviceListEditCtrl($scope, HttpService,SystemService,close,row) {
			$scope.device = row;
			
			$scope.sure = function(){
				SystemService.saveOrUpdateUser('rest/business/device/edit',$scope.device).then(function success(data){
					close();
				})
			};
			
			$scope.clear = function(){
				$scope.device = {};
			}

			$scope.close=function(){
				close();
			};
		}
	});
