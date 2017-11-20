define(
function() {
	return ['$scope', 'HttpService', 'DialogService', SetResidenCtrl];

	function SetResidenCtrl($scope, HttpService, DialogService) {	
		
		$scope.checkDay = function(){
			if($scope.res.attIn == 'week'){
				var day = $scope.res.attDay;
				if(day < 1){
					DialogService.showMessage(
		                '提示',
		                '一周之内上号不能少于一天！',null)
					delete $scope.res.attDay;
				}else if(day > 7){
					DialogService.showMessage(
		                '提示',
		                '一周之内上号不能大于七天！',null)
					delete $scope.res.attDay;
				}
			}else if($scope.res.attIn == 'month'){
				var day = $scope.res.attDay;
				if(day < 1){
					DialogService.showMessage(
		                '提示',
		                '一个月之内上号不能少于一天！',null)
					delete $scope.res.attDay;
				}else if(day > 30){
					DialogService.showMessage(
		                '提示',
		                '一个月之内上号不能大于三十天！',null)
					delete $scope.res.attDay;
				}
			}else if($scope.res.attIn == 'year'){
				var day = $scope.res.attDay;
				if(day < 1){
					DialogService.showMessage(
		                '提示',
		                '一年之内上号不能少于一天！',null)
					delete $scope.res.attDay;
				}else if(day > 365){
					DialogService.showMessage(
		                '提示',
		                '一年之内上号不能大于三百六十五天！',null)
					delete $scope.res.attDay;
				}
			}
			
			//console.log($scope.res.attDay)
		}
		
		$scope.checkTime = function(){
			var times = $scope.res.attTimes;
			if(times < 1){
				DialogService.showConfirm(
	                '提示',
	                '匹配次数不能小于一次！',null)
				delete $scope.res.attTimes;
			}
		}
		
		$scope.sureResult = function(){
			var filter={};
            if($scope.res){
            	filter = $scope.res;
            }
            HttpService.post('rest/system/setting/save',filter);
		}
	}
})
