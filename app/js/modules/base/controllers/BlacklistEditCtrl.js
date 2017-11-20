define(
	function () {
		return ['$scope', 'HttpService', 'SystemService','close','title', 'addBlacklist', BlacklistEditCtrl];
		function BlacklistEditCtrl($scope, HttpService, SystemService,close,title,addBlacklist) {
			
			$scope.title = title;
			$scope.addBlacklist = addBlacklist;
			
			$scope.sure = function(){
				SystemService.saveOrUpdateUser('rest/surveillance/efence/edit', $scope.addBlacklist).then(function success(data){
					close();
				})
			}
			
			$scope.clear = function(){
				$scope.addBlacklist = {};
			}
			
		    $scope.close = function(result) {
		 	    close(result, 500); 
		    };
		}
	});
