define(
function() {
	return ['$scope', 'HttpService', SetMapCtrl];

	function SetMapCtrl($scope, HttpService) {	
		var online = document.getElementById('onlineMap');
		var offline = document.getElementById('offlineMap');
		$scope.sureMap = function(){
			var filter={};
            if($scope.maps){	
            	filter = angular.copy($scope.maps);
            	if(filter.mapFocusLevel){
            		filter.mapFocusLevel = Number(filter.mapFocusLevel);
            	}
            	if(online.checked){
            		filter.mapIsonline = 1;
            	}else if(offline.checked){
            		filter.mapIsonline = 0;
            	}
            }
            if(offline.checked){
            	sessionStorage.setItem('isOnline',false);
            }else if(online.checked){
            	sessionStorage.setItem('isOnline',true);
            }
            var result = HttpService.post('rest/system/setting/save',filter);
            return result;
		}
	}
})
