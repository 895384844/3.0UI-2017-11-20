define(
	function () {
		return ['$scope', 'HttpService','SystemService','close', 'row', DeviceMoveCtrl];
		function DeviceMoveCtrl($scope, HttpService,SystemService,close,row) {
			$scope.groupName='';
			HttpService.get('rest/system/domain/allgroup').then(function success(resp){
				$scope.list = resp;
			})
			$scope.sure = function(){
				var data = {};
				data.domainGroup = $scope.groupName;
				data.deviceIDs = row;
				var result = HttpService.post('rest/device/efence/move',data);
				result.then(function success(resp){
					close();
				})
				return result;
			}
			
			$scope.close=close;
		}
	});
