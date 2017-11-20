define(
	function () {
		return ['$scope', 'HttpService', 'SystemService','close','title', 'person',BusUserEditCtrl];
		function BusUserEditCtrl($scope, HttpService, SystemService,close,title,person) {
	
			$scope.title = title;
			$scope.person = person;	
			
			$scope.sure = function(){
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
