define(
function() {
	return ['$scope', 'HttpService', SetMapCtrl];

	function SetMapCtrl($scope, HttpService) {	
		var online = document.getElementById('onlineMap');
		var offline = document.getElementById('offlineMap');
		$scope.sureMap = function(){
			var filter={};
            if($scope.maps){	
            	filter = $scope.maps;
            	if(filter.mapFocusLevel){
            		filter.mapFocusLevel = Number(filter.mapFocusLevel);
            	}
            	
            }
            
            var result = HttpService.post('rest/system/setting/save',filter);
            return result;
		}
	}
})
