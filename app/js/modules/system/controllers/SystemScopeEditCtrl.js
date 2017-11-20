define(function() {
		return ['$scope', 'HttpService', 'SystemService', 'title', 'user', 'DialogService', 'close', SystemScopeEditCtrl];
		function SystemScopeEditCtrl($scope, HttpService, SystemService, title, user, DialogService, close) {
			$scope.close = close;
			$scope.title = title;
			var filter = {};
			//console.log(user)
			$scope.group = user;
			if(user.center){
				var center = user.center.split(',');
				$scope.group.lon = center[0];
				$scope.group.lat = center[1];
			}
			$scope.groupAdd = function(){
				filter = $scope.group;
				filter.id = user.id;
				if($scope.group.lon && $scope.group.lat){
					filter.center = $scope.group.lon+','+$scope.group.lat;
				}
				delete filter.lon;
				delete filter.lat;
				SystemService.saveOrUpdateUser('rest/system/domain/editgroup',filter).then(function success(data){
					close();
				})
			}
			
		}
	});
