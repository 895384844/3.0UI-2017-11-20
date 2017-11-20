define(
	function () {
		return ['$scope', 'HttpService','SystemService', 'title','addBlacklist','close', BlackListFormCtrl];
		function BlackListFormCtrl($scope, HttpService,SystemService,title, addBlacklist,close) {


			$scope.addBlacklist = addBlacklist;
			$scope.title = title;
			
			$scope.sure = function(){
				SystemService.saveOrUpdateUser('rest/surveillance/efence/save',$scope.addBlacklist).then(function success(data){
					close()
				})
			}
			
			$scope.clear = function(){
				$scope.addBlacklist = {};
			}

			$scope.close=close;

		}
	});
