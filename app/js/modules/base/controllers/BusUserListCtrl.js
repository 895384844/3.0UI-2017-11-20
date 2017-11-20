define(
	function () {
		return ['$scope', 'HttpService', 'SystemService','title','person','close', BusUserListCtrl];
		function BusUserListCtrl($scope, HttpService,SystemService,title, person,close) {

			$scope.person = person
			$scope.title = title;
			
			$scope.sure = function(){
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
