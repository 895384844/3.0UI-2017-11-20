define(function () {
	return ['$scope', 'HttpService', '$interval', 'ModalService', MapMainCtrl];

	function MapMainCtrl($scope, HttpService, $interval, ModalService) {
		var GLOBAL_OBJECT = {};
		$scope.isOnline = true;
	
		$scope.device = {
			name: ''
		};
		$scope.actionType = '0';
		$scope.remoteUrlRequestFn = function(str) {
			return {
				name: str,
				page: 1,
				rows: 1000,
				sort: 'id',
				order: 'desc'
			};
		};
			
		$scope.devices = [];
		$scope.showDeviceInfo = false;
		$scope.dissmissDeviceInfo = function() {
			$scope.showDeviceInfo = false;

		}
		
		//点击定位时与系统设置的经纬度一致
	    $scope.setCenter = function() {    
		    $scope.device.name="";             //选择后点击返回中心点时清空里边的内容 
		    HttpService.post('/system/settingsAction!getSettings.action').then(function(resp){           //从系统设置那调的api
	            setMap(resp.data.map_center_lon,resp.data.map_center_lat,resp.data.map_focus);   //再调用setMap
		    });
	    }  
		
		$scope.markers = [];
		var loadMarkers = function(node) {
			for(var i = 0; i < node.length; i++) {
				if(node[i]["children"]) {
					loadMarkers(node[i]["children"]);
				} else {
					var obj = {
						longitude: node[i].longitude,
						latitude: node[i].latitude,
						icon: 'images/device_group.png',
						width: 49,
						height: 60,
						title: node[i].sname,
						content: node[i].address || '',
						devices: node[i].devices,
						circle: false
					};
					var devices = node[i].devices;
					for(var j = 0; j < devices.length; j++) {
						var device = devices[j];
						device.type = getDeviceModeById(device.modelId).code || '未知';
					}

					GLOBAL_OBJECT.NodeList.push(node[i]);
					$scope.markers.push(obj);
				}
			}
		}
		
		//过滤器，目前只过滤设备
		function filterNode(keyword, node) {
			for(var i = 0; i < node.length; i++) {
				if(node[i]["children"]) {
					if(node[i]["sname"].toLowerCase() == keyword.toLowerCase()) {
						var tempNode = utilityServices.clone(node[i]);
						node.splice(0, node.length);
						node.push(tempNode);
						break;
					}
					filterNode(keyword, node[i]["children"]);
					if(node[i]["children"].length == 0) {
						node.splice(i, 1);
						i--;
					}
				} else {
					if(node[i]["sname"].toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
						node.splice(i, 1);
						i--;
					}
				}
			}
		}

		GLOBAL_OBJECT.isHidden = true;
		GLOBAL_OBJECT.NodeList = [];
		GLOBAL_OBJECT.currentNode = null;

		$scope.actionTypes = [{
				name: "-----选择设备执行-----",
				value: "0"
			},
			{
				name: "设置查询",
				value: "1"
			},
			{
				name: "启动捕获程序",
				value: "2"
			},
			{
				name: "重启捕获程序",
				value: "3"
			},
			{
				name: "关闭捕获程序",
				value: "4"
			},
			{
				name: "重启设备系统",
				value: "5"
			},
			{
				name: "同步设备时钟",
				value: "6"
			},
			{
				name: "扫描频点",
				value: "7"
			},
			{
				name: "实时告警查询",
				value: "8"
			}
		]
		
		function displayArea(currentNode) {
			if(currentNode["children"]) {
				var childrenList = currentNode["children"];

				for(var i = 0; i < childrenList.length; i++) {
					if(childrenList[i]["children"]) {
						displayArea(childrenList[i]);
					} else {
						var point = {
							lng: parseFloat(childrenList[i].longitude),
							lat: parseFloat(childrenList[i].latitude)
						};
						GLOBAL_OBJECT.positionList.push(point);
					}
				}
			} else {

			}
		}
		
		function setMap(centerLongitude, centerLatitude, zoom, markers) {
			$scope.mapOptions.center.longitude = centerLongitude || $scope.mapOptions.center.longitude,
				$scope.mapOptions.center.latitude = centerLatitude || $scope.mapOptions.center.latitude;
			$scope.mapOptions.zoom = zoom || 11;
			if(!!markers) {
				$scope.mapOptions.markers = markers;
			}
			$scope.mapOptions.isUpdate = !$scope.mapOptions.isUpdate;
			//$scope.$apply();
		}

		$scope.addAction = function(actionType, device) {
			var type = actionType;
			switch(type) {
				case '0':
					break;
				case '1':
					$scope.setSearch(device);
					break;
				case '2':
					$scope.noWifiLte(0, 'startCaptureCtrl', device);
					break;
				case '3':
					$scope.noWifiLte(2, 'restartCaptureCtrl', device);
					break;
				case '4':
					$scope.noWifiLte(1, 'closeCaptureCtrl', device);
					break;
				case '5':
					$scope.noWifi(3, 'restartSystemCtrl', device);
					break;
				case '6':
					$scope.noWifi(8, 'sameClockCtrl', device);
					break;
				case '7':
					$scope.noWifiLte(4, 'catchPointCtrl', device)
					break;
				case '8':
					break;
			}

		};
		$scope.actionType = "0";
		
		$scope.mapOptions = {
            enableScrollWheelZoom:true,
            overviewCtrl:true,
            scaleCtrl:true,
            navCtrl:true,
            center: {
                longitude: 116.39,
                latitude: 39.94
            },
            zoom: 15
        };
       /*$scope.mapOptions = {
			center: {
				longitude: 116.39449,
				latitude: 39.912056
			},
			zoom: 10,
			navCtrl: true,
			scaleCtrl: true,
			overviewCtrl: true,
			enableScrollWheelZoom: true,
			markers: [],
			maxZoomLevel: 1,
			minZoomLevel: 18,
			onMarkerSelect: function(marker) {
				$scope.devices = marker.devices;
				$scope.showDeviceInfo = true;
				$scope.$apply();
			}
		};*/
	}
});