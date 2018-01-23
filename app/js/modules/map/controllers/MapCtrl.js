define(['moment'], function(moment) {
	return ['$scope', 'AlertService', 'HttpService', 'GridService', 'DialogService', 'ModalService', 'EmptyInput','delEmptyInput',MapCtrl];

	function MapCtrl($scope, AlertService, HttpService, GridService, DialogService, ModalService,EmptyInput,delEmptyInput) {		
		var GLOBAL_OBJECT = {};
		var isOnline = sessionStorage.getItem('isOnline');
		if(isOnline == 'false'){
			$scope.isOnline = 0;
		}else if(isOnline == 'true'){
			$scope.isOnline = 1;
		}
		
		$scope.deviceList = false;
		var gettree = {
			adCode : '00'
		};
		var currentCenter = sessionStorage.getItem('currentCenter').split(',');
		
		var network = {
			0 : 'GSM',
			1 : 'CDMA',
			2 : 'W-CDMA',
			3 : 'TD-CDMA',
			4 : 'FDD-LTE',
			5 : 'TDD-LTE',
			6 : 'WIFI'			
		};			
			
		
		$scope.close = function(){
			$scope.deviceList = false;
		}
		
		function searchDeviceInfo(marker){
			var postData = {
	    		page_size : 500,
	    		page_no : 1,
	    		query : {
	    			domainGroup : marker.domainGroup
	    		}
	    	}
			HttpService.post('rest/device/efence/search',postData).then(function success(resp){
	    		var list = resp.items;
	    		if(list.length == 0){
	    			$scope.deviceList = false;
	    		}else{
		    		for(var i=0; i<list.length; i++){
		    			list[i].network = network[list[i].network];
		    		}
		    		$scope.devices = list;
	    		}
	    	})	
		}
		
		//获取域组
		$scope.data = [];	//域组信息		
			
		HttpService.get('rest/system/domain/getgrouptree',gettree).then(function success(resp){	    	
	    	$scope.data.splice(0,0,{adCode: "all",name: "全部",isdefault:true});
	    	$scope.data.splice(1,0,{adCode: "0",name: "游离设备"}); 
	    	$scope.data.push(resp);
	    		    	
	    		    	
	    	
	    	GLOBAL_OBJECT.NodeList = [];
	    	
	    	var locations = [];	//设备组坐标
	    	var pt = [];
	    	//获取所有设备组坐标
	    	function traverseNode(node){
			    for(var i=0; i<node.length; i++){
			    	if(node[i].adCode.length == 10){
			    		var groupCenter = node[i].center.split(',');
			    		pt.push(groupCenter);
			    		var obj = {
			    			lon : groupCenter[0],
			    			lat : groupCenter[1],
			    			fullPath : node[i].fullPath,
			    			domainGroup : node[i].adCode,
			    			name : node[i].name,
			    			pt : pt
			    		};
			    		locations.push(obj);
			    	};
			    }
			}
	    	function traverseTree(node){
			    if (!node) {
			        return;
			    }			
			    traverseNode(node);
			   	for(var i=0; i<node.length; i++){
				   	if(node[i].nodes && node[i].nodes.length >0){
				   		traverseTree(node[i].nodes);
				   	}
			   	}
			}			
			traverseTree(resp.nodes);	
			$scope.getList = function(scope){			
				$('.tree-node').removeClass('device-page-active');
				scope.$element.addClass('device-page-active')
				if(scope.$modelValue){
					domain = scope.$modelValue.adCode;
				}else{
					domain = scope;
				}
				if(scope.$modelValue.center){
					var loc = scope.$modelValue.center.split(',')
					$scope.mapOptions.center.longitude = loc[0];
					$scope.mapOptions.center.latitude = loc[1];
				}
				/*for(var i=0;i<$scope.mapOptions.markers.length; i++){
					if(scope.$modelValue.name == $scope.mapOptions.markers[i].name){
						$scope.mapOptions.markers.select;
					}
				}*/
			}
			
			$scope.mapOptions = {
				center: {
					longitude: currentCenter[0],
					latitude: currentCenter[1]
				},
				zoom: 12,
				navCtrl: true,
				scaleCtrl: true,
				overviewCtrl: true,
				enableScrollWheelZoom: true,
				markers: [],
				maxZoomLevel: 1,
				minZoomLevel: 18,
				onMarkerSelect: function(marker) {
					$scope.deviceList = true;
					searchDeviceInfo(marker);
				}
			};

			var loadMarkers = function(node) {
				for(var i=0; i<node.length; i++){
					var obj = {
						longitude: node[i].lon,
						latitude: node[i].lat,
						icon: 'images/device_group.png',
						width: 30,
						height: 30,
						circle: false,
						title: node[i].fullPath,
						domainGroup : node[i].domainGroup,
						name : node[i].name,
						pt : node[i].pt
					};
					GLOBAL_OBJECT.NodeList.push(node[i]);
					$scope.mapOptions.markers.push(obj);
				}
			}
			loadMarkers(locations);
		    
		    function setMap(centerLongitude, centerLatitude, zoom, markers) {
				$scope.mapOptions.center.longitude = centerLongitude || $scope.mapOptions.center.longitude,
				$scope.mapOptions.center.latitude = centerLatitude || $scope.mapOptions.center.latitude;
				$scope.mapOptions.zoom = zoom || $scope.mapOptions.zoom;
				if(!!markers) {
					$scope.mapOptions.markers = markers;
				}
				$scope.mapOptions.isUpdate = !$scope.mapOptions.isUpdate;
				//$scope.$apply();
			}
		    
		    setMap($scope.mapOptions.center.longitude,$scope.mapOptions.center.latitude,$scope.mapOptions.zoom,$scope.mapOptions.marker)
       
		})
	}
});