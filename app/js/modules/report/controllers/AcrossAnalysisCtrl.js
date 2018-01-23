/**
 * Created by zhaoyang on 16/8/29.
 */
define(['moment', 'echarts'], function (moment, echarts) {
	return ['$scope', 'HttpService','GridService','ModalService','DateFormat', 'delEmptyInput','EmptyInput', 'DialogService',AcrossAnalysisCtrl];

	function AcrossAnalysisCtrl($scope, HttpService,GridService,ModalService,DateFormat,delEmptyInput,EmptyInput,DialogService) {
		$scope.btn = {
	        status : true
	    }
		$scope.showDelete = false;
		var cacheQuery = {};
		EmptyInput($scope.query);
		$scope.showLoading = false;

		var field = {
			'imei' : 'IMEI',
			'imsi' : 'IMSI',
			'attributeName' : '归属地',
			'resident' : '是否为常住人口',
			'mobileNetCarrier' : '网络运营商',
			'traceCount' : '查询结果总数',
			'deviceCount' : '经过设备点位个数',
			'address' : '设备点位详情'
		}
		
		var mobileNetCarrier = {
			0 : '移动',
			1 : '联通',
			2 : '电信',
			3 : '其它',
			4 : '境外'
		}
		
		HttpService.get('rest/system/domain/allgroup').then(function success(data) {
			for(var i=0; i<data.length; i++){
				data[i].fullPath = data[i].fullPath.split('•');
				var str = data[i].fullPath[2]+"•"+data[i].fullPath[3]
				data[i].fullPath = str;
			}
            $scope.vendorChoice = data;
        });
		
		$scope.currentW = true;
	    $scope.changeW = false;

	    $scope.toogleLeftState = function(){
	    	$scope.currentW = !$scope.currentW;
	    	$scope.changeW = !$scope.changeW;   	
	    }
	    
	    $scope.list = [];
	    
	    $scope.query = [
	    	{
	    		domainGroup : '',
	    		startTime : '',
	    		endTime : ''
	    	},
	    	{
	    		domainGroup : '',
	    		startTime : '',
	    		endTime : ''
	    	}
	    ];	
	    $scope.addCondition = function(){
	    	if($('.lis1').length >= 2){
	    		$scope.showDelete = true;
	    	}
	    	var obj={addElement:"addElement"};    	
			$scope.list.push(obj);
			if($scope.list.length > 13){
				$scope.list = $scope.list.slice(0,13);
			}
			$scope.query = $scope.query.slice(0,2);
			$scope.query = $scope.query.concat($scope.list);			
	    }
		$scope.delEle1 = function(idx){
	    	if($('.lis1').length <= 3){
				$scope.showDelete = false;
			}
	    	if($('.lis3').length == 2){
	    		$('#rm').find('.lis')[idx].remove();
	    		$scope.query.splice(idx,1);
	    	}else{
	    		$('#rm').find('.lis')[0].remove();
	    		$scope.query.splice(0,1);
	    	}
	    }
				
		$scope.delEle=function(idx){
			if($('.lis1').length <= 3){
				$scope.showDelete = false;
			}
		    $scope.list.splice(idx,1);
		    $scope.query.splice(idx+2,1);
		    if($scope.list.length == 0){
		    	$scope.query = $scope.query.slice(0,2);
		    } 
		}	
		
		var add = function () {
				ModalService.showModal({
                    templateUrl: 'system/templates/user_form.html',
                    controller: 'SystemUserEditCtrl',
                    inputs:{
                        title:'新建用户',
                        userInfo:{}
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                           GridService.refresh($scope);
                    });
                });
			};
		
		
		var exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "手机侦码碰撞分析-"+times,
			    fields: field,
			    fileName: "AcrossAnalysisPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    param: {
			        complexQuery: angular.copy(cacheQuery)
			    }
			}
			angular.forEach(filter.param.complexQuery, function(data,index,array){
        		if(filter.param.complexQuery[index].startTime){
        			filter.param.complexQuery[index].startTime = DateFormat(filter.param.complexQuery[index].startTime);
        		}
				if(filter.param.complexQuery[index].endTime){
					filter.param.complexQuery[index].endTime = DateFormat(filter.param.complexQuery[index].endTime);
				}
			});
			HttpService.post('rest/analysis/efence/collision_export',filter).then(function success(resp) {
				$scope.showLoading = false;
            	var filter={fileName: resp.file};
            	var anchor = angular.element('<a/>');
		        anchor.attr({
		            href: 'EFS/core/system/file/download_file?fileName=' + resp.file
		        })[0].click();
			},function error(err){
				$scope.showLoading = false;
			})
		}
		GridService.create($scope,{
				fetchData:true,
				columnDefs:[
			        { field: 'imei',displayName: 'IMEI',enableSorting:false,enableColumnMenu:false },
		            { field: 'imsi',displayName: 'IMSI',enableSorting:false,enableColumnMenu:false },
		            { field: 'attributeName',displayName: '归属地',enableSorting:false,enableColumnMenu:false },
		            { field: 'resident',displayName: '是否为常住人口',enableSorting:false,enableColumnMenu:false },
		            { field: 'mobileNetCarrier',displayName: '网络运营商',enableHiding:false,enableSorting:false,enableColumnMenu:false },
		            { field: 'traceCount',displayName: '查询结果总数',enableHiding:false,enableSorting:false,enableColumnMenu:false },
		            { field: 'deviceCount',displayName: '经过设备点位个数',enableHiding:false,enableSorting:false,enableColumnMenu:false },
		            { field: 'address',displayName: '设备点位详情',enableSorting:false,enableColumnMenu:false },
		            { 
		                field: 'btnGroup',
		                displayName: '查看轨迹',
		                enableSorting:false,
		                enableColumnMenu:false,
		                maxWidth:500,minWidth:100,
		               	cellTemplate: '<a class="fa fa-fw fa-search btn-edit" href ng-click="grid.appScope.showMap(row.entity)" style="margin-left:15px;color:#31708f;" uib-tooltip="查看轨迹" tooltip-placement="left"></a>'
		            }
			    ],
			    btnTools:[
			    	{
				    	//css:'fa fa-fw fa-refresh',
				    	src: 'images/refresh.png',
				    	tooltip:'刷新',
				    	method:function(){
				    		GridService.refresh($scope);
				    	}
			    	},
			    	{
				    	//css:'fa fa-fw fa-share-square-o',
				    	src: 'images/exports.png',
				    	tooltip:'导出',
				    	method:exports
			    	}
			    ]
		});	
		$scope.showMap = function(row) {
			$scope.showLoading = true;
			var filter={};
			filter.imsi = row.imsi;
			filter.complexQuery = [];
            if($scope.query){
            	filter.complexQuery = angular.copy(cacheQuery);
            	angular.forEach(filter.complexQuery, function(data,index,array){
            		if(filter.complexQuery[index].startTime){
            			filter.complexQuery[index].startTime = DateFormat(filter.complexQuery[index].startTime);
            		}
					if(filter.complexQuery[index].endTime){
						filter.complexQuery[index].endTime = DateFormat(filter.complexQuery[index].endTime);
					}
					delEmptyInput(filter.complexQuery[index]);
				});  				
            }

            HttpService.post('rest/analysis/efence/collisionOnMap',filter).then(function success(resp){
            	$scope.showLoading = false;
            	var locations = [];
				var pt = [];
				for(var i=0; i<resp.length; i++){
					var groupCenter = resp[i].center.split(',');
					pt.push(groupCenter);
					var obj = {
		    			lon : groupCenter[0],
		    			lat : groupCenter[1],
		    			locations : resp[i].location,
		    			timestamp : resp[i].timestamp,
		    			pt : pt,
                        timeList: resp[i].timeList
		    		};
		    		locations.push(obj);
				}

				ModalService.showModal({
					templateUrl: 'report/templates/trace_log_mapShow.html',
					controller: 'ShowTraceMapCtrl',
					inputs: {
						title: '详情',
						list: locations
					}
				}).then(function(modal) {
					modal.close.then(function(result) {
						//GridService.refresh($scope);
					});
				});
        	},function error(err){
        		$scope.showLoading = false;
        	})
		};
				
		$scope.search = function(){
			$scope.showLoading = true;
			cacheQuery = angular.copy($scope.query);
			$scope.toogleLeftState();
			delEmptyInput($scope.query);
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.getPagingList = function(currentPage, pageSize, sort) {				
				var filter={page_size:pageSize,page_no:currentPage};
				filter.complexQuery = [];
	            if($scope.query){
	            	filter.complexQuery = angular.copy(cacheQuery);
	            	angular.forEach(filter.complexQuery, function(data,index,array){
	            		if(filter.complexQuery[index].startTime){
	            			filter.complexQuery[index].startTime = DateFormat(filter.complexQuery[index].startTime);
	            		}
						if(filter.complexQuery[index].endTime){
							filter.complexQuery[index].endTime = DateFormat(filter.complexQuery[index].endTime);
						}
						/*if(filter.complexQuery[index] = {}){
							filter.complexQuery = filter.complexQuery.slice(index,1);
						}*/
						delEmptyInput(filter.complexQuery[index]);
					});  				
	            }
	            var result = HttpService.post('rest/analysis/efence/collision',filter);
	            result.then(function success(resp){
	            	$scope.showLoading = false;
	           		if(resp.count == 0){
	           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		                return;
	           		}else{
	           			var list = resp.items;
		           		for(var i=0; i<list.length; i++){
		           			list[i].mobileNetCarrier = mobileNetCarrier[list[i].mobileNetCarrier];
		           		}
	           		}
	            },function error(err){
	            	$scope.showLoading = false;
	            })
	           return result;
			};
			GridService.refresh($scope);
		}
	}
});
