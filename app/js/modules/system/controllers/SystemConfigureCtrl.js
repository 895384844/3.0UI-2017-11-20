define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService','EmptyInput','delEmptyInput', SystemConfigureCtrl];

	function SystemConfigureCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService,EmptyInput,delEmptyInput) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		EmptyInput($scope.query);
		
		var offline = document.getElementById("offlineMap");
	    var online = document.getElementById("onlineMap");
	    var map_status = localStorage.getItem("isMapOffline");
	    
	    $scope.msg = {};
	    $scope.maps = {};
	    $scope.res = {};
	    
	    HttpService.get('rest/system/setting/get').then(function success(resp){
	    	
	    	$scope.msg.msgNet = resp.msgNet+'';
	    	$scope.msg.msgPort = resp.msgPort;
	    	$scope.msg.msgRate = resp.msgRate;
	    	$scope.msg.msgTestInfo = resp.msgTestInfo;
	    	$scope.msg.msgTestTel = Number(resp.msgTestTel);
	    	$scope.maps.mapCenterLat = resp.mapCenterLat;
	    	$scope.maps.mapCenterLon = resp.mapCenterLon;
	    	$scope.maps.mapFocusLevel = resp.mapFocusLevel;
	    	if(resp.mapIsonline == 0){
	    		var offline = document.getElementById('offlineMap');
	    		offline.checked = true;
	    	}else{
	    		var online = document.getElementById('onlineMap');
	    		online.checked = true;
	    	}
	    	$scope.res.attDay = resp.attDay;
	    	$scope.res.attIn = resp.attIn;
	    	$scope.res.attTimes = resp.attTimes;
	    })
	   	
	                                	               
        if(map_status == 'false'){
        	online.checked = false;
        	offline.checked = true;
        }else{
        	online.checked = true;
        	offline.checked = false;
        }

		$scope.search = function() {
			delEmptyInput($scope.query);
			GridService.refresh($scope);
		};

	}

	
});