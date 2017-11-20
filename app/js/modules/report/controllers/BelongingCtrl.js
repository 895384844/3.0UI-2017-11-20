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
            $scope.groupArray = data;
        });
       
        Array.prototype.unique3 = function(){
			var res = [];
			var json = {};
			for(var i = 0; i < this.length; i++){
				if(!json[this[i]]){
					res.push(this[i]);
					json[this[i]] = 1;
				}
			}
			return res;
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
			$scope.loc = $scope.locations.unique3();
		}
		
		$scope.removeGroup = function(idx){
			$scope.groupList.splice(idx,1);
			$scope.loc.splice(idx,1);
		}
				
	    $scope.showLoading=false;
	
	    $scope.echartOptions = {
	        /*title : {
	            text: '全国各省',
	            subtext: '手机归属地占比情况'
	        },*/
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
	        series : [
	            {
	                name: '地区统计数量',
	                type: 'map',
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
	                        return a.name+"统计数量："+value;
	                    }
	                },
	                data:[
	                   // {name:'北京', value:0}               
	                ]
	            },
	            {
	                name:'归属地占比',
	                type:'pie',
					color : ['#95bdd6','#448fb9'],
	                tooltip: {
	                    trigger: 'item',
	                    formatter: "{a} <br/>{b} : {c} ({d}%)"
	                },
	                center: ['85%', '80%'],
	                radius: [40, 60],
	                data:[
	                   // {name: '北京', value: 0}
	                ]
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
	        $scope.showLoading=true;
	        $scope.query.zoneID=$scope.query.zoneID||{};
	        $scope.echartOptions.series[0].mapType = $scope.query.zoneID.name||'china';
	        
	        if($scope.query.zoneID.name == '全部'){
	        	$scope.echartOptions.series[0].mapType = 'china';
	        	var data = [
	        		{name:'全国',value:658},
	        		{name:'境外',value:68}
	        	]	        	
	        	$scope.echartOptions.series[1].data = data;
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
	           	for(i in $scope.citylist){
	           		for(j in resp){
	           			if(filter.mapQuery.zoneID == '0'){
	           				if(resp[j].flagID == $scope.citylist[i].pid){
		            			var legendData = [];
		            			var name = $scope.citylist[i].name;
		            			legendData.push(name);
		            			sdata0.push({
		            				name : name,
		            				value : resp[j].count
		            			})
		            		}
	           			}else{
	           				var legendData = [];
	           				legendData.push(resp[j].flagName);
	           				sdata0.push({
	           					name : resp[j].flagName,
	           					value : resp[j].count
	           				})
	           			}
	           		}
	           	}
	           	var sdata1 = []
	           	for(k in sdata0){
	           		sdata1.push(sdata0[k].name);
	           	}
	           	var sdata = sdata1.unique3();
	           	var len = sdata.length-2;
	           	if(filter.mapQuery.zoneID != '0'){
	           		var sdata0 = sdata0.slice(0,len)
	           	}	
	            $scope.echartOptions.legend.data=legendData;
	            $scope.echartOptions.series[0].data=sdata0;
	            //$scope.echartOptions.series[1].data=sdata0;
	        });  
			return results;
	    
	   };
	}
});