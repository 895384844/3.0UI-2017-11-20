define(
	function () {
		return ['$scope', 'HttpService','SystemService', 'title','datas','close', BlackListFormCtrl];
		function BlackListFormCtrl($scope, HttpService,SystemService,title, datas,close) {


			$scope.addBlacklist = datas;
			$scope.imsiList = [];
			$scope.imeiList = [];
			$scope.macList = [];
			$scope.plateList = [];
			
			HttpService.get('rest/case/case/get').then(function success(resp){
				resp.splice(0,0,{name:"未指定",code:'0'});
				$scope.caseList = resp;
				$scope.addBlacklist.caseCode = '0';
			})
			
			$scope.pushImsi = function(){
				if($scope.addImsi){
					$scope.imsiList.push($scope.addImsi);
				}
				$scope.addImsi = '';
			}
			
			$scope.pushImei = function(){
				if($scope.addImei){
					$scope.imeiList.push($scope.addImei);
				}
				$scope.addImei = '';
			}
			
			$scope.pushMac = function(){
				if($scope.addMac){
					$scope.macList.push($scope.addMac);
				}
				$scope.addMac = '';
			}
			
			$scope.pushPlate = function(){
				if($scope.addPlate){
					$scope.plateList.push($scope.addPlate);
				}
				$scope.addPlate = '';
			}
			
			$scope.removeImsi = function(idx){
				$scope.imsiList.splice(idx,1);
			}
			
			$scope.removeImei = function(idx){
				$scope.imeiList.splice(idx,1);
			}
			
			$scope.removeMac = function(idx){
				$scope.macList.splice(idx,1);
			}
			
			$scope.removePlate = function(idx){
				$scope.plateList.splice(idx,1);
			}
			
			$scope.sure = function(){
				$scope.addBlacklist.imsiList = $scope.imsiList;
				$scope.addBlacklist.imeiList = $scope.imeiList;
				$scope.addBlacklist.macList = $scope.macList;
				$scope.addBlacklist.plateList = $scope.plateList;
				SystemService.saveOrUpdateUser('rest/surveillance/target/save',$scope.addBlacklist).then(function success(data){
					close()
				})
			}
			
			$scope.clear = function(){
				$scope.addBlacklist = {};
			}

			$scope.close=close;

		}
	});
