define(
	function () {
		return ['$scope', 'HttpService','SystemService', 'title','device','close', DeviceListFormCtrl];
		function DeviceListFormCtrl($scope, HttpService,SystemService,title, device,close) {
			HttpService.get('rest/system/domain/allgroup').then(function success(resp){
				$scope.list = resp;
			})
			$scope.device = device;
			
			$scope.save = function(){
				SystemService.saveOrUpdateUser('rest/device/efence/save',$scope.device).then(function success(data){
					close();
				})
			}
			$scope.clear = function(){
				$scope.device = {};
			}

			$scope.close=close;
		}
	});
