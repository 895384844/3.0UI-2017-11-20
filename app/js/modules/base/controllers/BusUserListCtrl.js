define(
	function () {
		return ['$scope', 'HttpService', 'SystemService','title','person','close', BusUserListCtrl];
		function BusUserListCtrl($scope, HttpService,SystemService,title, person,close) {

			$scope.person = person
			$scope.title = title;
			
			$scope.sure = function(){
				if($scope.periodEnd){
					var end = $scope.periodEnd.split(':')[0];
					$scope.person.periodEnd = end * 1;
				}
				if($scope.periodStart){
					var start = $scope.periodStart.split(':')[0];
					$scope.person.periodStart = start * 1;
				}
				if($scope.person.interval){
					$scope.person.interval *= 1;
				}
				SystemService.saveOrUpdateUser('rest/surveillance/staff/save',$scope.person).then(function success(data){
					close();
				})
			}
			$scope.clear = function(){
				$scope.person = {};
			}

			$scope.close=close;
		}
	});
