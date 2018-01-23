define(function() {
	return ['$scope', 'HttpService', 'close', 'list', 'GetLocalTime', ShowMapCtrl];

	function ShowMapCtrl($scope, HttpService, close, list, GetLocalTime) {
		
		$scope.list = list;
		var isOnline = sessionStorage.getItem('isOnline');
		if(isOnline == 'false'){
			$scope.isOnline = 0;
		}else if(isOnline == 'true'){
			$scope.isOnline = 1;
		}
		var currentCenter = sessionStorage.getItem('currentCenter').split(',');

		$scope.points = [];
		if (typeof($scope.list) != "undefined") {
			for(var i = 0; i < $scope.list.length; i++) {
		        var point = {
		            'lat' : $scope.list[i]['lat'],
		            'lon' : $scope.list[i]['lon']
		        };
		        $scope.points.push(point);
		    }
		}
		
		for(var i=0; i<$scope.list.length; i++){
			$scope.list[i].locations = $scope.list[i].locations.split('•');
			var str = $scope.list[i].locations[2]+"•"+$scope.list[i].locations[3]
			$scope.list[i].locations = str;
			if(typeof($scope.list[i].timestamp) === 'number'){
				$scope.list[i].timestamp = GetLocalTime($scope.list[i].timestamp);
			}
		}

		$scope.close = function(result) {
	 	    close(result,500);
	    };
				
		$scope.mapOptions = {
	    	center: {
	            longitude: currentCenter[0],
				latitude: currentCenter[1]
	        },
	        zoom: 17,
	        navCtrl:true,
	        scaleCtrl:true,
	        overviewCtrl:true,
	        enableScrollWheelZoom:true,
	        maxZoomLevel: 18,
	        minZoomLevel: 2,
	        externalCallBack: cb
	    };

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
		
		var loadMarkers = function(node) {
			for(var i=0; i<node.length; i++){
				var obj = {
					longitude: node[i].lon,
					latitude: node[i].lat,
					icon: 'images/device_group.png',
					width: 30,
					height: 30,
					circle: false,
					title: node[i].locations,
					timestamp : GetLocalTime(node[i].timestamp),
					pt : node[i].pt
				};
				$scope.mapOptions.markers.push(obj);
			}
		}
		
		function TimeList(list) {
			this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
			this.defaultOffset = new BMap.Size(20, 66);

			this.box = document.createElement("div");
			this.box.className = "timelist-box";
			this.box.id = "timelist-box";

			this.top = document.createElement("div");
			this.top.className = "timelist-top";
			this.box.appendChild(this.top);
			this.leftinfo = document.createElement("div");
			this.leftinfo.className = "timelist-left-info";
			this.top.appendChild(this.leftinfo);
			this.title = document.createElement("span");
			this.title.innerHTML = "轨迹信息";
			this.leftinfo.appendChild(this.title);

			this.content = document.createElement("div");
			this.content.className = "timelist-content";
			this.box.appendChild(this.content);
			this.list = list;
		}
		
		function initTimeList() {
			TimeList.prototype = new BMap.Control();

			TimeList.prototype.initialize = function(map) {
				for (var i = 0; i <this.list.length; i++) {
					var entry = document.createElement("div");
					entry.className = "timelist-group";

					var addressLeft = document.createElement("div");
					addressLeft.className = "timelist-content-left timelist-mg-11";
					var addressImage = document.createElement("img");
					addressImage.src = "../../images/timelist_address.png";
					addressLeft.appendChild(addressImage);
					var addressRight = document.createElement("div");
					addressRight.className = "timelist-content-right timelist-mg-11";
					var addressText = document.createElement("span");
					addressText.innerHTML = this.list[i]['locations'];
					addressText.title = this.list[i]['locations']
					addressRight.appendChild(addressText);

					var startLeft = document.createElement("div");
					startLeft.className = "timelist-content-left";
					var startImage = document.createElement("img");
					startImage.src = "../../images/timelist_start.png";
					startLeft.appendChild(startImage);
					var startRight = document.createElement("div");
					startRight.className = "timelist-content-right";
					var startText = document.createElement("span");
					startText.innerHTML = this.list[i]['timestamp'];
					startRight.appendChild(startText);

					var clear1 = document.createElement("div");
					clear1.style = "clear: both;";
					var clear2 = document.createElement("div");
					clear2.style = "clear: both;";

					var clickable = null;

					if (i == 0) {
						clickable = entry;
					} else {
						var addition = document.createElement("div");
						addition.className = "timelist-mg-5";
						entry.appendChild(addition);
						clickable = addition;
					}

					clickable.appendChild(addressLeft);
					clickable.appendChild(addressRight);
					clickable.appendChild(clear1);
					clickable.appendChild(startLeft);
					clickable.appendChild(startRight);
					clickable.appendChild(clear2);

					entry.onclick = (function(map, list, index) {
						return function() {
							entryClick(map, list, index);
						}
					})(map, this.list, i);

					this.content.appendChild(entry);

					var line = document.createElement("span");
					line.className = "line";
					this.content.appendChild(line);
				}

				// 添加DOM元素到地图中  
				// map.getContainer().appendChild(this.box);
				$(map.getContainer()).after(this.box);

				return this.box;  
			}
		}

		function entryClick(map, list, index) {
			var infoWindow = new BMap.InfoWindow("");
			var node = list[index];
			var zoomlevel = map.getZoom();
			var point = new BMap.Point(node['lon'], node['lat']);
			map.centerAndZoom(point, zoomlevel);
			
			var content = '<div style="margin:0;line-height:1.5;font-size:13px;">' +
	                    node['timestamp'] + '<br/>经度：' + node["lon"] + '<br/>纬度：' + node["lat"] +
	                  '</div>';
			infoWindow.setTitle(node['locations']);
			infoWindow.setContent(content);
			map.openInfoWindow(infoWindow, point);
		}

	    var cb = function(map) {
			if(typeof($scope.list) != "undefined") {

				var mapPoints = [];
				for (var i = 0; i < $scope.points.length; i++) {
			        var lat = parseFloat($scope.points[i]['lat']);
			        var lon = parseFloat($scope.points[i]['lon']);
			        mapPoints.push(new BMap.Point(lon, lat));

			        if (i == $scope.points.length - 1) {
			        	var trackIcon = new BMap.Icon('images/track_end.png', new BMap.Size(26, 26));
			        	var marker = new BMap.Marker(new BMap.Point(lon, lat), {icon: trackIcon});
			        	marker.setTop(true);
			        	marker.setOffset(new BMap.Size(-5, -5));
			        } else if (i == 0) {
			        	var trackIcon = new BMap.Icon('images/track_start.png', new BMap.Size(26, 26));
			        	var marker = new BMap.Marker(new BMap.Point(lon, lat), {icon: trackIcon});
			        	marker.setTop(true);
			        	marker.setOffset(new BMap.Size(5, 5));
			        } else {
			        	var trackIcon = new BMap.Icon('images/track_point.png', new BMap.Size(26, 26));
			        	var marker = new BMap.Marker(new BMap.Point(lon, lat), {icon: trackIcon});
			        }

			        marker.disableDragging();
			        map.addOverlay(marker); 
				}
				map.setViewport(mapPoints);

		        //创建折线
				var polyline = new BMap.Polyline(mapPoints, {strokeColor:"blue", strokeWeight:5, strokeOpacity:0.5});
		        //增加折线
				map.addOverlay(polyline);

				initTimeList();

				var timeList = new TimeList($scope.list);
				map.addControl(timeList);
				   
			}else{
				map.centerAndZoom(new BMap.Point(116.417854,39.921988), 15);
			}
	    }

	    $scope.mapOptions = {
	    	center: {
	            longitude: $scope.points[0]['lon'],
	            latitude: $scope.points[0]['lat']
	        },
	        zoom: 17,
	        navCtrl:true,
	        scaleCtrl:true,
	        overviewCtrl:true,
	        enableScrollWheelZoom:true,
	        maxZoomLevel: 18,
	        minZoomLevel: 1,
	        externalCallBack: cb
	    };
	}
})
