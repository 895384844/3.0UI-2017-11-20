define(
	function () {
		return ['$scope', 'HttpService','SystemService','row','close', DeviceListEditCtrl];
		function DeviceListEditCtrl($scope, HttpService,SystemService,row,close) {
			$scope.device = row;
			var network = {
				'GSM' : '0',
				'CDMA' : '1',
				'W-CDMA' : '2',
				'TD-SCDMA' : '3',
				'FDD-LTE' : '4',
				'TDD-LTE' : '5',
				'WIFI' : '6'
			}
			for(i in network){
				if(row.network == i){
					$scope.device.network = network[i];
				}
			}
			
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
