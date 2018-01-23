define(
	function () {
		return ['$scope', 'HttpService', 'SystemService','close','title', 'person',BusUserEditCtrl];
		function BusUserEditCtrl($scope, HttpService, SystemService,close,title,person) {
	
			$scope.title = title;
			$scope.person = person;
			$scope.periodEnd = $scope.person.periodEnd + ':00';
			$scope.periodStart = $scope.person.periodStart + ':00';
			
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
				SystemService.saveOrUpdateUser('rest/surveillance/staff/edit',$scope.person).then(function success(data){
					close();
				})
			}
			
			$scope.clear = function(){
				$scope.person = {};
			}
			
			$scope.close = function(result) {
		 	    close(result, 500); 
		   };
		}
	});
