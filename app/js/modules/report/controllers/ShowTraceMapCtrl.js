define(['echarts', 'china', 'bmap', 'moment', 'jquery'], function(echarts, china, bmap, moment, jquery) {
    return ['$scope', 'HttpService', 'close', 'list', '$timeout', '$interval', 'GetLocalTime', ShowTraceMapCtrl];

    function ShowTraceMapCtrl($scope, HttpService, close, list, $timeout, $interval, GetLocalTime){
        $scope.list = list;
        // console.log(list);
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

        var isSingleRefresh = false;
        var isPlaying = false;

        $scope.refreshCharts = function() {
            listIndex = 0;
            isSingleRefresh = false;
            if(isPlaying){
                isPlaying = false;
                $interval.cancel(stop);
                document.getElementsByClassName("startplay")[0].style.backgroundImage = "url('../images/play.png')";
                createSeries($scope.points);
            }else{
                isPlaying = true;
                document.getElementsByClassName("startplay")[0].style.backgroundImage = "url('../images/stop.png')";
                refreshCharts($scope.points);
            }

        };

        var listIndex = 0;
        $scope.refreshNextCharts = function(){
            var singlePoints = [];
            isSingleRefresh = true;
            if(listIndex < $scope.points.length-1){
                singlePoints.push($scope.points[listIndex]);
                singlePoints.push($scope.points[listIndex+1]);
                refreshCharts(singlePoints);
            }
            // else{
            //     listIndex = 0;
            // }
            document.getElementsByClassName("startplay")[0].style.backgroundImage = "url('../images/play.png')";
            isPlaying = false;
        }

        $scope.refreshLastCharts = function(){
            var singlePoints = [];
            isSingleRefresh = true;
            if(listIndex <= $scope.points.length-1 && listIndex > 0){
                listIndex = listIndex - 1;
                singlePoints.push($scope.points[listIndex]);
                singlePoints.push($scope.points[listIndex+1]);
                refreshCharts(singlePoints);
            }else{
                listIndex = 0;
            }
            document.getElementsByClassName("startplay")[0].style.backgroundImage = "url('../images/play.png')";
            isPlaying = false;
        }

        $scope.close = function(result) {
            close(result,500);
            $interval.cancel(stop);
        };

        $timeout(createChart, 500);
        var myChart;
        var points = [];
        for(var i = 1; i < $scope.points.length-1; i++){
            var lat = parseFloat($scope.points[i]['lat']);
            var lon = parseFloat($scope.points[i]['lon']);
            points.push([lon,lat]);
        }
        var start = [$scope.points[0]['lon'], $scope.points[0]['lat']];
        var end = [$scope.points[$scope.points.length-1]['lon'], $scope.points[$scope.points.length-1]['lat']];
        // console.log(points);

        var online = sessionStorage.getItem('isOnline');
        // console.log(online);
        var script = document.getElementById("baiduscript");
        if (script){
            document.body.removeChild(script);
        }
        var scriptTag = document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.id = 'baiduscript';
        if (online == "true"){
            scriptTag.src = 'http://api.map.baidu.com/api?v=2.0&ak=Qspv2In2CfD4PYqIfBeiL5wQTlL4EXp1&callback=initOnlineMap';
        }else {
            scriptTag.src = 'js/modules/common/directives/apiv2.0.min.js';
        }
        document.body.appendChild(scriptTag);


        var stopSeries = function (data){
            var series = [];
            series.push({
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    // symbol:'image://./images/track_point.png',
                    zlevel: 2,
                    symbolSize: function (val) {
                        return 5;
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color: '#438EB9',
                            formatter: function (params) {
                                var lon = params.value[0];
                                var lat = params.value[1];
                                for (var i = 0; i<$scope.list.length;i++){
                                    if (lon == $scope.list[i]['lon'] && lat == $scope.list[i]['lat']){
                                        return $scope.list[i].locations.split('•')[1];
                                    }
                                }
                            }
                        }
                    },
                    // showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    // hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#F77171'
                        }
                    },
                    data: points
                },
                {
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    symbol:'image://./images/track_start.png',
                    zlevel: 2,
                    symbolSize: function (val) {
                        return 30;
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color: '#438EB9',
                            formatter: function (params) {
                                var lon = params.value[0];
                                var lat = params.value[1];
                                if (lon == $scope.list[0]['lon'] && lat == $scope.list[0]['lat']){
                                    return $scope.list[0].locations.split('•')[1];
                                }
                            }
                        }
                    },
                    data:[{
                        // name: item[1][0][1].name,
                        value:start
                    }],
                },
                {
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    symbol:'image://./images/track_end.png',
                    zlevel: 2,
                    symbolSize: function (val) {
                        return 30;
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color: '#438EB9',
                            formatter: function (params) {
                                var lon = params.value[0];
                                var lat = params.value[1];
                                if (lon == $scope.list[$scope.list.length-1]['lon'] && lat == $scope.list[$scope.list.length-1]['lat']){
                                    return $scope.list[$scope.list.length-1].locations.split('•')[1];
                                }
                            }
                        }
                    },
                    data: [{
                        value:end
                    }],
                },
                {
                    type: 'lines',
                    zlevel: 2,
                    coordinateSystem: 'bmap',
                    symbolSize: 10,
                    symbol: ['none', 'arrow'],
                    lineStyle: {
                        normal: {
                            color: '#F77171',
                            width: 3,
                            opacity: 0.6,
                            curveness: 0.1
                        }
                    },

                    data: convertData($scope.points)
                },
                {
                    type: 'lines',
                    zlevel: 2,
                    coordinateSystem: 'bmap',
                    effect: {
                        show: false,
                        period: 1,
                        trailLength: 0,
                        symbol: 'image://./images/track_point.png',
                        loop: true,
                        delay:function (idx) {
                            // 越往后的数据延迟越大
                            return idx * 1000;
                        },
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: '#F77171',
                            width: 0,
                            curveness: 0.1
                        }
                    },

                    data: convertData(data)
                },
                {
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    // polyline: true,
                    data: convertData(data),
                    effect: {
                        show: false,
                        period: 1,
                        trailLength: 0.7,
                        color: '#fff',
                        shadowBlur: 5,
                        scaleSize: 1,
                        symbolSize: 3,
                        loop: true,
                        delay:function (idx) {
                            // 越往后的数据延迟越大
                            return idx * 1000;
                        },
                    },
                    lineStyle: {
                        normal: {
                            color: '#F77171',
                            width: 0,
                            curveness: 0.1
                        }
                    },
                    zlevel: 1
                });
            return series;
        }

        var playSeries = function (data){
            var series = [];
            series.push(
                {
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    // symbol:'image://./images/track_point.png',
                    zlevel: 2,
                    symbolSize: function (val) {
                        return 5;
                    },
                    // showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color: '#438EB9',
                            formatter: function (params) {
                                var lon = params.value[0];
                                var lat = params.value[1];
                                for (var i = 0; i<$scope.list.length;i++){
                                    if (lon == $scope.list[i]['lon'] && lat == $scope.list[i]['lat']){
                                        return $scope.list[i].locations.split('•')[1];
                                    }
                                }
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#F77171'
                        }
                    },
                    data: points
                },
                {
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    symbol:'image://./images/track_start.png',
                    zlevel: 2,
                    symbolSize: function (val) {
                        return 30;
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color: '#438EB9',
                            formatter: function (params) {
                                var lon = params.value[0];
                                var lat = params.value[1];
                                if (lon == $scope.list[0]['lon'] && lat == $scope.list[0]['lat']){
                                    return $scope.list[0].locations.split('•')[1];
                                }
                            }
                        }
                    },
                    data:[{
                        // name: item[1][0][1].name,
                        value:start
                    }],
                },
                {
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    symbol:'image://./images/track_end.png',
                    zlevel: 2,
                    symbolSize: function (val) {
                        return 30;
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color: '#438EB9',
                            formatter: function (params) {
                                var lon = params.value[0];
                                var lat = params.value[1];
                                if (lon == $scope.list[$scope.list.length-1]['lon'] && lat == $scope.list[$scope.list.length-1]['lat']){
                                    return $scope.list[$scope.list.length-1].locations.split('•')[1];
                                }
                            }
                        }
                    },
                    data: [{
                        // name: item[1][item[1].length-1][1].name,
                        value:end
                    }],
                },
                {
                    type: 'lines',
                    zlevel: 2,
                    coordinateSystem: 'bmap',
                    symbolSize: 10,
                    symbol: ['none', 'arrow'],
                    animation: false,
                    lineStyle: {
                        normal: {
                            color: '#F77171',
                            width: 3,
                            opacity: 0.6,
                            curveness: 0.1
                        }
                    },

                    data: convertData($scope.points)
                },
                {
                    type: 'lines',
                    zlevel: 2,
                    coordinateSystem: 'bmap',
                    effect: {
                        show: true,
                        period: 1,
                        trailLength: 0,
                        symbol: 'image://./images/track_point.png',
                        loop: false,
                        delay:function (idx) {
                            // 越往后的数据延迟越大
                            return idx * 1000;
                        },
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: '#F77171',
                            width: 0,
                            curveness: 0.1
                        }
                    },

                    data: convertData(data)
                },
                {
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    // polyline: true,
                    data: convertData(data),
                    effect: {
                        show: true,
                        period: 1,
                        trailLength: 0.7,
                        color: '#fff',
                        shadowBlur: 5,
                        scaleSize: 1,
                        symbolSize: 3,
                        loop: false,
                        delay:function (idx) {
                            // 越往后的数据延迟越大
                            return idx * 1000;
                        },
                    },
                    lineStyle: {
                        normal: {
                            color: '#F77171',
                            width: 0,
                            curveness: 0.1
                        }
                    },
                    zlevel: 1
                });
            return series;
        }

        function createChart(){
            myChart = echarts.init(document.getElementById("maptrace"));
            myChart.setOption({
                bmap: {
                    center: [currentCenter[0], currentCenter[1]],
                    zoom: 17,
                    roam: true,
                },
                series: []
            });

            var bmap = myChart.getModel().getComponent('bmap').getBMap();
            bmap.addControl(new BMap.NavigationControl()); // 缩放控件
            bmap.addControl(new BMap.ScaleControl()); // 比例尺
            bmap.addControl(new BMap.OverviewMapControl());
            bmap.enableScrollWheelZoom(true);
            bmap.setMinZoom(1);
            bmap.setMaxZoom(18);
            drawMap(bmap);
            $timeout(function() {
                createSeries($scope.points);
            }, 100);

            myChart.on('click', function (params) {
                if (params.seriesType == "effectScatter"){
                    var lon = params.value[0];
                    var lat = params.value[1];
                    var infoWindow = new BMap.InfoWindow("");
                    var point = new BMap.Point(lon, lat);
                    for (var i = 0; i<$scope.list.length;i++){
                        if (lon == $scope.list[i]['lon'] && lat == $scope.list[i]['lat']){
                            infoWindow.setTitle('<div style="margin:0;line-height:1.5;font-size:13px;">' +
                                $scope.list[i]['locations'] + '</div>');
                        }
                    }
                    var content = '<div style="margin:0;line-height:1.5;font-size:13px;max-height: 80px;overflow-y: scroll;overflow-x: hidden">'+'坐标：'+lon+','+lat+'</div>';
                    infoWindow.setContent(content);
                    bmap.openInfoWindow(infoWindow, point);
                }
            });
        }


    function createSeries(data){
            myChart.setOption({series:stopSeries(data)});
        }

        var convertData = function (data){
            var mapPoints = [];
            for (var i = 0; i < data.length-1; i++) {
                var latFrom;
                var lonFrom;
                var latTo;
                var lonTo;
                // if(i != data.length-1){
                    latFrom = parseFloat(data[i]['lat']);
                    lonFrom = parseFloat(data[i]['lon']);
                    latTo = parseFloat(data[i+1]['lat']);
                    lonTo = parseFloat(data[i+1]['lon']);
                // }
                // else{
                //     latFrom = parseFloat(data[i]['lat']);
                //     lonFrom = parseFloat(data[i]['lon']);
                //     latTo = parseFloat(data[0]['lat']);
                //     lonTo = parseFloat(data[0]['lon']);
                // }

                // mapPoints.push([[lonFrom, latFrom], [lonTo, latTo]]);
                mapPoints.push({
                    coords: [[lonFrom, latFrom], [lonTo, latTo]]
                });
            }
            return mapPoints;
        }
        var stop;
        function refreshCharts(data){
            if(!myChart){
                return;
            }
            createSeries($scope.points);
            $interval.cancel(stop);
            refreshTimeList(listIndex);
            var groups = document.getElementsByClassName("timelist-group");
            for(var i = 0; i < groups.length; i++){
                groups[i].style.boxShadow="-5px 0px 0px #438EB9, 0px 1px 0px #b6bfc4";
            }
            var loopCount;
            if(isSingleRefresh){
                loopCount = 1;
            }else{
                loopCount = data.length-1;
            }
            document.getElementsByClassName("timelist-group")[listIndex].style.boxShadow="-5px 0px 0px #ffa022, 0px 1px 0px #b6bfc4";
            stop = $interval(function() {
                listIndex = listIndex + 1;
                refreshTimeList(listIndex);
            }, 1000, loopCount);

            //更新数据
            myChart.setOption({series:playSeries(data)});
            $timeout(function() {
                createSeries($scope.points);
                document.getElementsByClassName("startplay")[0].style.backgroundImage = "url('../images/play.png')";
                isPlaying = false;
            }, 1000 * loopCount);
        }

        function drawMap(map){
            if(typeof($scope.list) != "undefined") {

                var mapPoints = [];
                for (var i = 0; i < $scope.points.length; i++) {
                    var lat = parseFloat($scope.points[i]['lat']);
                    var lon = parseFloat($scope.points[i]['lon']);
                    mapPoints.push(new BMap.Point(lon, lat));

                }
                map.setViewport(mapPoints);

                initTimeList(map);

                var timeList = new TimeList($scope.list);
                map.addControl(timeList);

            }else{
                map.centerAndZoom(new BMap.Point(116.417854,39.921988), 15);
            }
        }

        function TimeList(list) {
            this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
            this.defaultOffset = new BMap.Size(20, 20);

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

        function initTimeList(bmap) {
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
                    addressText.title = this.list[i]['locations'];
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
        function refreshTimeList(index){
            var groups = document.getElementsByClassName("timelist-group");
            for(var i = 0; i < groups.length; i++){
                groups[i].style.boxShadow="-5px 0px 0px #438EB9, 0px 1px 0px #b6bfc4";
            }
            // console.log(groups[index]);
            if(index != $scope.points.length){
                groups[index].style.boxShadow="-5px 0px 0px #ffa022, 0px 1px 0px #b6bfc4";
                var mainContainer = $('.timelist-content'),
                    // scrollToContainer = mainContainer.find('.son-panel:last');//滚动到<div id="thisMainPanel">中类名为son-panel的最后一个div处
                scrollToContainer = mainContainer.find('.timelist-group:eq(' + index + ')');//滚动到<div id="thisMainPanel">中类名为son-panel的第六个处
                mainContainer.animate({
                    scrollTop: scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop()
                }, 500);
            }

        }

        function entryClick(map, list, index) {
            var infoWindow = new BMap.InfoWindow("");
            var node = list[index];
            var zoomlevel = map.getZoom();
            var point = new BMap.Point(node['lon'], node['lat']);
            // map.centerAndZoom(point, zoomlevel);
            myChart.setOption({bmap: {
                center: [node['lon'], node['lat']]
            }});
            listIndex = index;
            refreshTimeList(listIndex);

            var content = '<div style="margin:0;line-height:1.5;font-size:13px;max-height: 80px;overflow-y: scroll;overflow-x: hidden">';
            for(var i in node['timeList']){
                if(typeof(node['timeList'][i]) === 'number'){
                    node['timeList'][i] = GetLocalTime(node['timeList'][i]);
                }
                content = content + node['timeList'][i] + '<br/>';
            }
            content = content + '</div>';
            infoWindow.setTitle('<div style="margin:0;line-height:1.5;font-size:13px;">' +
                node['locations'] + '</div>');
            infoWindow.setContent(content);
            map.openInfoWindow(infoWindow, point);
        }
    }

});
