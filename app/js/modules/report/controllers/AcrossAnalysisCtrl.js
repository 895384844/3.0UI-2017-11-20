/**
 * Created by zhaoyang on 16/8/29.
 */
define(['moment', 'echarts'], function (moment, echarts) {
	return ['$scope', 'HttpService','GridService','ModalService','DateFormat', 'delEmptyInput','EmptyInput', 'DialogService', 'groupSelectMore',AcrossAnalysisCtrl];

	function AcrossAnalysisCtrl($scope, HttpService,GridService,ModalService,DateFormat,delEmptyInput,EmptyInput,DialogService, groupSelectMore) {
		$scope.btn = {
	        status : true
	    }
		$scope.txt = '';
		
		var mobileNetCarrier = {
			0 : '移动',
			1 : '联通',
			2 : '电信',
			3 : '其它',
			4 : '境外'
		}
		
		$scope.showDelete = false;
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
		
		EmptyInput($scope.query);
		groupSelectMore();
		
		HttpService.get('rest/system/domain/allgroup').then(function success(data) {
            $scope.vendorChoice = data;
        });
        
        $scope.forText = function(event,scope){
        	var adCode = scope.group.adCode;
        	var target = angular.element(event.target); 
        	var txt = scope.group.name;
        	target.parent().prev().text(txt);
        	var idx = target.parents('.lis1').index();
        	$scope.query[idx].domainGroup = adCode;
        }
        $scope.forText1 = function(event,scope){
        	var adCode = scope.group.adCode       	
        	var target = angular.element(event.target); 
        	var txt = scope.group.name;
        	target.parent().prev().text(txt);
        	var options = $('.option');
        	var idx = target.parents('.lis1').index();
        	$scope.query[idx].domainGroup = adCode;
        	for(var i=0; i<options.length; i++){
        		options[i].style.cssText = 'display:none';       		
        	}
        }
        
        $scope.selectBox = function(event,scope){
        	event.stopPropagation();
        	var target = angular.element(event.target);
        	target.context.nextElementSibling.style.cssText = 'display:block'
        }
		
		$scope.currentW = true;
	    $scope.changeW = false;

	    $scope.toogleLeftState = function(){
	    	$scope.currentW = !$scope.currentW;
	    	$scope.changeW = !$scope.changeW;   	
	    }
	    	
	    $scope.addCondition = function(){
	    	if($('.lis1').length >= 2){
	    		$scope.showDelete = true;
	    	}
	    	var obj={
		    		domainGroup : '',
		    		startTime : '',
		    		endTime : ''
		    	};
			$scope.list.push(obj);
			$scope.query = $scope.query.slice(0,2);
			$scope.query = $scope.query.concat($scope.list);
	    }
	    
	    $scope.delEle1 = function(event,idx){
	    	if($('.lis1').length <= 3){
				$scope.showDelete = false;
			}
	    	var el = event.currentTarget.parentElement.previousElementSibling;
	    	if(el == null){
	    		$scope.query.splice(0,1);
	    		$('#rm').find('.lis')[0].remove();
	    	}else{
	    		$scope.query.splice(1,1);
	    		$('#rm').find('.lis')[1].remove();
	    	}
	    }
				
		$scope.delEle=function(idx){
			if($('.lis').length <= 3){
				$scope.showDelete = false;
			}
		    $scope.list.splice(idx,1);
		    $scope.query.splice(idx+2,1);
		    if($scope.list.length == 0){
		    	$scope.query = $scope.query.slice(0,2);
		    }
		    if($('.curLi').length == 0){
		    	$scope.query = $scope.list;
		    }
		}		

		var doSearch = function (query) {
			HttpService.post('report/fwupgrade/result', query).then(function success(data) {
				console.dir(data);
					var succeedDatas = {
						name: '成功',
						type: 'line',
						data: []
					};
					var failedDatas = {
						name: '失败',
						type: 'line',
						data: []
					};
					var _date = [];

					_.forEach(data, function (item) {
						_date.push(item.date);
						succeedDatas.data.push(item.SUCCESSED);
						failedDatas.data.push(item.FAILED);
					});

					var chart = echarts.init(document.getElementById('report_fwupgrade_charts'));
					var option = {
						title: {
							text: '升级结果汇总',
							subtext: '(默认页面载入最近七天数据)'
						},
						legend: {
							data:['成功','失败']
						},
						tooltip : {
							trigger: 'axis'
						},
						toolbox: {
							show : true,
							feature : {
								mark : {show: true},
								dataView : {show: true, readOnly: false},
								magicType : {show: true, type: ['line', 'bar']},
								restore : {show: true},
								saveAsImage : {show: true}
							}
						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: _date
						},
						yAxis: {
							type: 'value'
						},
						series: [succeedDatas, failedDatas]
					};
					chart.setOption(option);
				},
				function failure(errorResponse) {
				}, function (value) {
				});
		};

		GridService.create($scope,{
				fetchData:true,
				columnDefs:[
			        { field: 'imei',displayName: 'IMEI',enableSorting:false,enableColumnMenu:false },
		            { field: 'imsi',displayName: 'IMSI',enableSorting:false,enableColumnMenu:false },
		            { field: 'attributeName',displayName: '归属地',enableSorting:false,enableColumnMenu:false },
		            { field: 'resident',displayName: '是否为常住人口',enableSorting:false,enableColumnMenu:false },
		            { field: 'mobileNetCarrier',displayName: '终端网络提供商',enableHiding:false,enableSorting:false,enableColumnMenu:false },
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
				    	css:'fa fa-fw fa-refresh',
				    	tooltip:'刷新',
				    	method:function(){
				    		GridService.refresh($scope);
				    	}
			    	},
			    	{
				    	css:'fa fa-fw fa-share-square-o',
				    	tooltip:'导出',
				    	//method:add
			    	},
			    	{
				    	css:'fa fa-fw fa-download',
				    	tooltip:'下载',
				    	//method:add
			    	}
			    ]
		});	
		$scope.showMap = function() {
			ModalService.showModal({
				templateUrl: 'report/templates/trace_log_showMap.html',
				controller: 'ShowMapCtrl',
				inputs: {
					title: '详情',
					userInfo: {}
				}
			}).then(function(modal) {
				modal.close.then(function(result) {
					GridService.refresh($scope);
				});
			});
		};
				
		$scope.search = function(){
			$scope.toogleLeftState();
			delEmptyInput($scope.query);
			for(var i=0; i<$scope.query.length; i++){
				if($scope.query[i].domainGroup == ''){
					$scope.query.splice(i,1)
				}
			}
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.getPagingList = function(currentPage, pageSize, sort) {
				var filter={page_size:pageSize,page_no:currentPage};
				filter.complexQuery = [];
	            if($scope.query){
	            	filter.complexQuery = angular.copy($scope.query);
	            	angular.forEach(filter.complexQuery, function(data,index,array){
	            		if(filter.complexQuery[index].startTime){
	            			filter.complexQuery[index].startTime = DateFormat(filter.complexQuery[index].startTime);
	            		}
						if(filter.complexQuery[index].endTime){
							filter.complexQuery[index].endTime = DateFormat(filter.complexQuery[index].endTime);
						}
						if(!filter.complexQuery[index].domainGroup){
							filter.complexQuery.splice(index,1)
						}
						delEmptyInput(filter.complexQuery[index]);
					});  				
	            }
	            var result = HttpService.post('rest/analysis/efence/collision',filter);
	            result.then(function success(resp){
	           		if(resp.count == 0){
	           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		                return;
	           		}else{
	           			var list = data.items;
		           		for(var i=0; i<list.length; i++){
		           			list[i].mobileNetCarrier = mobileNetCarrier[list[i].mobileNetCarrier];
		           		}
	           		}
	            })
	           return result;
			};
			GridService.refresh($scope);
		}
	}
});
