define(['Chart', 'echarts', 'moment', 'china'], function(Chart, echarts, moment,china) {
	return ['$scope', 'i18nService', '$lt', '$filter', '$http', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','$timeout','delEmptyInput', BelongingCtrl];

	function BelongingCtrl($scope, i18nService, $lt, $filter, $http, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,$timeout,delEmptyInput) {

		$scope.citylist = [];
		$scope.groupList = [];
		$scope.loc = [];
		$scope.locations = [];
		$scope.query = {};

		$http.get('testJson/citylist.json').then(function(resp) {
			$scope.citylist = resp.data;
			$scope.query.zoneID = $scope.citylist[0];
		})
		/*
		HttpService.post('rest/business/device/getDeviceGroup').then(function success(resp) {
            $scope.groupArray = resp;
        });
        */
        HttpService.get('rest/system/domain/allgroup').then(function success(data) {
        	for(var i=0; i<data.length; i++){
				data[i].fullPath = data[i].fullPath.split('•');
				var str = data[i].fullPath[2]+"•"+data[i].fullPath[3]
				data[i].fullPath = str;
			}
            $scope.groupArray = data;
        });
       
       /* Array.prototype.unique3 = function(){
			var res = [];
			var json = {};
			for(var i = 0; i < this.length; i++){
				if(!json[this[i]]){
					res.push(this[i]);
					json[this[i]] = 1;
				}
			}
			return res;
		}*/
		// 最简单数组去重法 
		function unique1(array){ 
			var n = []; //一个新的临时数组 
			//遍历当前数组 
			for(var i = 0; i < array.length; i++){ 
				//如果当前数组的第i已经保存进了临时数组，那么跳过， 
				//否则把当前项push到临时数组里面 
				if (n.indexOf(array[i]) == -1) n.push(array[i]); 
			} 
			return n; 
		}
		
		$scope.addGroup = function(id){
			$scope.locations = $scope.loc;
			$scope.groupList.push($scope.query.groupList);
			for(j in $scope.groupList){	
				for(i in $scope.groupArray){			
					if($scope.groupList[j] == $scope.groupArray[i].adCode){	
						$scope.locations.push($scope.groupArray[i].name);						
					}
				}
			}	
			$scope.loc = unique1($scope.locations);//.unique3();
		}
		
		$scope.removeGroup = function(idx){
			$scope.groupList.splice(idx,1);
			$scope.loc.splice(idx,1);
		}

	    $scope.showLoading=false;
	
	    $scope.echartOptions = {
	        title : {
	            text: '归属地占比情况',
	          //  subtext: '手机归属地占比情况'
	        },
	        tooltip : {
	            trigger: 'item'
	        },
	        legend: {
	            x:'left',
	            y:'50',
	            orient: 'vertical',
	            selectedMode:false,
	            data:[]//['北京']
	        },
	        roamController: {
	            show: true,
	            x: 'right',
	            mapTypeControl: {
	                'china': true
	            }
	        }, 
	        dataRange: {
		        //x: 'left',
		        //y: 'bottom',
		        left: '-300',
		        splitList: [
		            {start: 100},
		            {start: 75, end: 100},
		            {start: 50, end: 74.99999},
		            {start: 49, end: 49.99999},
		            {start: 48, end: 48.99999},
		            {start: 47, end: 47.99999},
		            {start: 46, end: 46.99999},
		            {start: 45, end: 45.99999},
		            {start: 44, end: 44.99999},
		            {start: 43, end: 43.99999},
		            {start: 42, end: 42.99999},
		            {start: 41, end: 41.99999},
		            {start: 40, end: 40.99999},
		            {start: 39, end: 39.99999},
		            {start: 38, end: 38.99999},
		            {start: 37, end: 37.99999},
		            {start: 36, end: 36.99999},
		            {start: 35, end: 35.99999},
		            {start: 34, end: 34.99999},
		            {start: 33, end: 33.99999},
		            {start: 32, end: 32.99999},
		            {start: 31, end: 31.99999},
		            {start: 30, end: 30.99999},
		            {start: 29, end: 29.99999},
		            {start: 28, end: 28.99999},
		            {start: 27, end: 27.99999},
		            {start: 26, end: 26.99999},
		            {start: 25, end: 25.99999},
		            {start: 24, end: 24.99999},
		            {start: 23, end: 23.99999},
		            {start: 22, end: 22.99999},
		            {start: 21, end: 21.99999},
		            {start: 20, end: 20.99999},
		            {start: 19, end: 19.99999},
		            {start: 18, end: 18.99999},
		            {start: 17, end: 17.99999},
		            {start: 16, end: 16.99999},
		            {start: 15, end: 15.99999},
		            {start: 14, end: 14.99999},
		            {start: 13, end: 13.99999},
		            {start: 12, end: 12.99999},
		            {start: 11, end: 11.99999},
		            {start: 10, end: 10.99999},
		            {start: 9, end: 9.99999},
		            {start: 8, end: 8.99999},
		            {start: 7, end: 7.99999},
		            {start: 6, end: 6.99999},
		            {start: 5, end: 5.99999},
		            {start: 4, end: 4.99999},
		            {start: 3, end: 3.99999},
		            {start: 2, end: 2.99999},
		            {start: 1, end: 1.99999},
		            {start: 0.5, end: 0.99999},
		            {start: 0.4, end: 0.5},
		            {start: 0.3, end: 0.4},
		            {start: 0.2, end: 0.3},
		            {start: 0.1, end: 0.2},
		            //{start: 10, end: 200, label: '10 到 200（自定义label）'},
		            //{start: 5, end: 5, label: '5（自定义特殊颜色）', color: 'black'},
		            {start: 0.000000001, end:0.09999999},
		            {end: 0}
		        ],
		        
		       //	splitNumber: 1,
		       	color: ['#bf444c', '#e6bd8c']
		    },
		    
	        toolbox: {
	            show : true,
	            orient: 'vertical',
	            x:'right',
	            y:'center',
	            feature : {
	                mark : {show: true},
	                dataView : {show: false, readOnly: false},
	                magicType : {show: false, type: ['line', 'bar']}
	            }
	        },
	        xAxis: {
		        type: 'category',
		        data: [],
		        splitNumber: 1,
		        show: false
		    },
		    yAxis: {
		        position: 'left',
		        offset: -48,
		        min: 0,
		        max: 10,
		        splitNumber: 10,
		        inverse: true,
		        axisLabel: {
		            show: true
		        },
		        axisLine: {
		            show: false  
		        },
		        splitLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        data: []
		    },
	        series : [
	            {
	                name: '地区统计占比',
	                type: 'map',
	                //zoom: 0.1,
	                mapType: 'china',
	                itemStyle:{
	                    normal:{label:{show:true}},
	                    emphasis:{label:{show:true}}
	                },
	                tooltip: {
	                    trigger: 'item',
	                    formatter: function(a){
	                        var value =0;
	                        if(!isNaN(a.value)){
	                            value=a.value
	                        }else if(!isNaN(a.value) && $scope.echartOptions.series[1].data[0] == undefined){
	                        	value = a.value;
	                        }/*else if($scope.echartOptions.series[1].data[0]){
	                        	var d_name = $scope.echartOptions.series[1].data[0].name;
	                        	if(d_name == "上海市" || d_name == "北京市" || d_name == "天津市" || d_name == "重庆市"){
	                        		value = $scope.echartOptions.series[1].data[0].value;
	                        	}
	                        }*/
	                        return a.name+"统计占比："+value;
	                    }
	                },
	                data:[
	                   // {name:'北京', value:0}               
	                ]
	            },
	            {
	                type:'pie',
					color : ['#95bdd6','#448fb9'],
	                tooltip: {
	                    trigger: 'item',
	                    formatter: "{a} <br/>{b} : {c} ({d}%)"
	                },
	                center: ['15%', '80%'],
	                radius: [40, 60],
	                data:[
	                   // {name: '北京', value: 0}
	                ]
	            },
	            {
		            type: 'bar',
		            barWidth: 5,
		            itemStyle: {
		                normal: {
		                    color: undefined,
		                    shadowColor: 'rgba(0, 0, 0, 0.1)',
		                    shadowBlur: 10
		                }
		            },
		            data: []
		        }
	        ],
	        animation: true
	    };
	    $scope.currentMapType='china';
	
	    $scope.changeMapType=function(){
	    	if($scope.query.zoneID.name == '全部'){
	    		$scope.currentMapType = 'china';
	    	}else{
	    		$scope.currentMapType=$scope.query.zoneID;
	    	}
	       
	    }
	
	    $scope.search = function(){
	    	delEmptyInput($scope.query);
	        $scope.showLoading=true;
	        $scope.query.zoneID=$scope.query.zoneID||{};
	        $scope.echartOptions.series[0].mapType = $scope.query.zoneID.name||'china';
	        if($scope.query.zoneID.name == '全部'){
	        	$scope.echartOptions.series[0].mapType = 'china';
	        	/*var data = [
	        		{name:'全国',value:658},
	        		{name:'境外',value:68}
	        	]	        	
	        	$scope.echartOptions.series[1].data = data;*/
	        }else{
	        	$scope.echartOptions.series[0].mapType = $scope.query.zoneID.name;
	        	delete $scope.echartOptions.series[1].data;
	        }
	        var filter = {};
			if($scope.query) {
				filter.mapQuery = angular.copy($scope.query);
				/*for(i in $scope.groupID){
					$scope.groupID[i] = Number($scope.groupID[i]);
				}*/				
				if($scope.query.zoneID){
					filter.mapQuery.zoneID = $scope.query.zoneID.pid+'';
				}
				if(filter.mapQuery.startTime){
					filter.mapQuery.startTime = DateFormat(filter.mapQuery.startTime);
				}
				if(filter.mapQuery.startTime == ''){
					delete filter.mapQuery.startTime;
				}
				if(filter.mapQuery.endTime){
					filter.mapQuery.endTime = DateFormat(filter.mapQuery.endTime);
				}
				if(filter.mapQuery.endTime == ''){
					delete filter.mapQuery.endTime;
				}
				if($scope.groupList.length >=1){
					filter.mapQuery.groupList = $scope.groupList;
				}
				if(typeof(filter.mapQuery.groupList) == 'string'){
					delete filter.mapQuery.groupList;
				}
			}
	        	
	        var results = HttpService.post('rest/analysis/efence/attribute',filter);
	        results.then(function success(resp){
	            var result=resp.data;
	            $scope.showLoading=false;
	            var sdata0 = [];
	            var sdata2 = [];
	           	for(i in $scope.citylist){
	           		for(j in resp){
	           			if(filter.mapQuery.zoneID == '0'){
	           				if(resp[j].flagID == $scope.citylist[i].pid){
		            			var legendData = [];
		            			var name = $scope.citylist[i].name;
		            			legendData.push(name);
		            			sdata0.push({
		            				name : name,
		            				//value : resp[j].count
		            				value : resp[j].percent
		            			});		            			
		            		};
		            		if(resp[j].provinceName == "境外"){
		            			var num = 100 - resp[j].percent;
		            			var data = [
					        		{name:'全国',value:num},
					        		{name:'境外',value:resp[j].percent}
					        	];
					        	$scope.echartOptions.series[1].data = data;
		            		}
	           				if(filter.mapQuery.zoneID != 11 && filter.mapQuery.zoneID != 12 && filter.mapQuery.zoneID != 31 && filter.mapQuery.zoneID != 50 && resp[j].percent){
	           					if(resp[j].provinceName == ''){
	           						resp[j].provinceName = '其它';
	           					}
	            				sdata2.push({
		            				value: resp[j].provinceName+' '+resp[j].percent+'%'
		            			})
	            			}
	           			}else{
	           				var legendData = [];
	           				legendData.push(resp[j].flagName);
	           				sdata0.push({
	           					name : resp[j].flagName,
	           					//value : resp[j].count
	           					value : resp[j].percent
	           				});
	           				
	           				if(filter.mapQuery.zoneID != 11 && filter.mapQuery.zoneID != 12 && filter.mapQuery.zoneID != 31 && filter.mapQuery.zoneID != 50 && resp[j].percent){
	            				sdata2.push({
		            				value: resp[j].flagName+' '+resp[j].percent+'%'
		            			})
	            			}
	           			}
	           		}
	           	}
	           	for(var i=1; i<100; i++){
	            	if(sdata0.length / 32 == i && filter.mapQuery.zoneID != 0){
	            		sdata0 = sdata0.slice(0,i)
	            	}
	            }
	           	var sdata1 = []
	           	for(k in sdata0){
	           		sdata1.push(sdata0[k].name);
	           	}
	           	var sdata = unique1(sdata1);
	           	
	           	var result = [], hash = {};  hash_ = {}
			    for (var i = 0; i<sdata2.length; i++) {
			        var elem = sdata2[i].value; 
			        if (!hash[elem]) {
			            result.push(sdata2[i]);
			            hash[elem] = true;
			        }
			    }
			    sdata2 = result;
	           	if(sdata2.length > 5){
	           		sdata2 = sdata2.slice(0,5);
	           		sdata2.splice(0,0,{value:"TOP5"})
	           	}
	           	if(sdata2.length <= 0){
	           		$scope.echartOptions.yAxis.axisLabel.show = false;
	           	}else{
	           		$scope.echartOptions.yAxis.axisLabel.show = true;
	           	}
	            $scope.echartOptions.legend.data=legendData;
	            if(!sdata0[0]){
	            	return;
	            }else{
	            	if(sdata0[0].name == '北京市' || sdata0[0].name == '上海市' || sdata0[0].name == '重庆市' || sdata0[0].name == '天津市'){
		            	sdata0 = sdata0.slice(0,1);
		            }
	            }
	            if(sdata0[0].name == '上海市'){
	            	$scope.echartOptions.series[0].zoom = 0.15;
	            }else{
	            	$scope.echartOptions.series[0].zoom = 1;
	            }
	            if(sdata0.length == 31){
	            	if(sdata0[0].name == sdata0[1].name){
	            		sdata0 = sdata0.slice(0,1);
	            	}
	            }
	            
	            $scope.echartOptions.series[0].data = sdata0;
	            $scope.echartOptions.yAxis.data = sdata2;
	            //$scope.echartOptions.series[1].data=sdata0;
	        });  
			return results;
	    
	   };
	}
});