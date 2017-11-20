define(function() {
		return ['$scope', 'HttpService', 'SystemService', 'title', 'parentID', 'close', SystemScopeFormCtrl];
		function SystemScopeFormCtrl($scope, HttpService, SystemService, title, parentID, close) {
			$scope.close = close;
			$scope.group = {};
			$scope.title = title;
			var data = {};
			var filter = {};
		    filter.adCode = '00';
		    $scope.groupAdd = function(){
		    	data.name = $scope.group.name;
		    	data.adCode = parentID;
		    	if($scope.group.lon && $scope.group.lat){
		    		data.center = $scope.group.lon+","+$scope.group.lat
		    	}		    	
		    	if($scope.group.description){
		    		data.description = $scope.group.description;
		    	}
		    	SystemService.saveOrUpdateUser('rest/system/domain/addgroup',data).then(function success(resp){		    		
					HttpService.get('rest/system/domain/gettree',filter).then(function success(resp){
						$scope.data = [];
				    	$scope.data.push(resp);
				    })
					close();
				})
		    }
		}
	});
