define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridServiceReport', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat', 'EmptyInput', 'delEmptyInput','groupSelect', 'uiGridConstants', TrafficWifiCtrl];

	function TrafficWifiCtrl($scope, i18nService, $lt, $filter, GridServiceReport, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat, EmptyInput, delEmptyInput,groupSelect, uiGridConstants) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		$scope.btn = {};
		$scope.btn.status = true;
		EmptyInput($scope.query);
		$scope.data = [];
		$scope.isDeviceID = false;	
		$scope.showLoading = false;
		$scope.query.timeSpan = '1h';
		var cacheQuery = {};
		$scope.showFooter = false;
		
		
		var field = {
			'start' : '开始时间',
			'end' : '结束时间',
			'count' : '终端数量'
		}
		
		$scope.isActive = true;
		$scope.isShow = false;
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		
		var toogle = document.getElementsByClassName('sidebar-toggle')[0];
		
		HttpService.get('rest/system/domain/allgroup').then(function success(data) {
			for(var i=0; i<data.length; i++){
				data[i].fullPath = data[i].fullPath.split('•');
				var str = data[i].fullPath[2]+"•"+data[i].fullPath[3]
				data[i].fullPath = str;
			}
            $scope.vendorChoice = data;
        });
       
        $scope.groupName = function(scope){
        	var data = $scope.query.domainGroup * 1;
        	if($scope.query.domainGroup == 'all'){
        		$scope.isDeviceID = false;
        		$scope.isShow = false;
        	}else{
        		$scope.isDeviceID = true;
        		if(window.outerWidth <= 1367){
        			$scope.isShow = true;
        		}       		
        		HttpService.get('rest/device/efence/get',{type:'wifi',group:data}).then(function success(resp){
        			resp.splice(0,0,{deviceID:"全部"})
					$scope.deviceID = resp;
					$scope.query.deviceID = '全部';
				});
        	}
        }
		
		toogle.onclick = function(){			
			var winWid = window.outerWidth;
			var sidebarWid = $(".main-sidebar").width();
			if(winWid <= 1280){
				if(sidebarWid = 230){
					$scope.isShow = !$scope.isShow;
				}
			}
		}
		
		$scope.emptyDatetime = function(){
			$scope.isShow = true;
			$('.datetimes').val('');
			delete $scope.query.startTime;
			delete $scope.query.endTime;
		}
		
		$scope.checkInput = function(){
			if(!$scope.query.startTime){
				delete $scope.query.startTime;
				$scope.btn.status = true;
			}
			if(!$scope.query.endTime){
				delete $scope.query.endTime;
				$scope.btn.status = true;
			}
		}
		
		onWinResize();
		
		function onWinResize(){
			var winWid = window.outerWidth;
			if(winWid > 1176){
				$scope.isShow = false;
			}else{
				$scope.isShow = true;
			}		
		}
		
		window.addEventListener("resize",onWinResize);
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}

		$scope.exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "终端MAC流量分析-"+times,
			    fields: field,
			    fileName: "TrafficAnalysisPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    param: {
			       // mapQuery: angular.copy($scope.query)
			    }			    
			}
			if($scope.query){
            	filter.param.mapQuery = angular.copy(cacheQuery);
            	filter.param.mapQuery.flag = "pager"; 
            	if(!filter.param.mapQuery.domainGroup || filter.param.mapQuery.domainGroup == 'all'){
            		delete filter.param.mapQuery.domainGroup;
            	};
            	if(filter.param.mapQuery.deviceID){
            		filter.param.mapQuery.deviceID = filter.param.mapQuery.deviceID.deviceID;
            	}
            	if(!filter.param.mapQuery.deviceID || filter.param.mapQuery.deviceID == '全部'){
            		delete filter.param.mapQuery.deviceID;
            	}
            }
			HttpService.post('rest/analysis/wifi/traffic_export',filter).then(function success(resp) {
				$scope.showLoading = false;
            	var filter={fileName: resp.file}
         	    var anchor = angular.element('<a/>');
		        anchor.attr({
		            href: 'EFS/core/system/file/download_file?fileName=' + resp.file
		        })[0].click();
         	   //HttpService.get('core/system/file/download_file',{'fileName':resp.file})
			},function error(err){
				$scope.showLoading = false;
			})
		}
		
		$scope.refresh = function(){
			GridServiceReport.refresh($scope);
		}

		GridServiceReport.create($scope, {
			fetchData: true,
			columnDefs: [{
					field: 'start',
					displayName: '开始时间',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'end',
					displayName: '结束时间',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'count',
					displayName: '终端数量',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false,
					aggregationType: uiGridConstants.aggregationTypes.sum
				}
			]
		});
		function showCharts() {
			//	var filter={page_size:pageSize,page_no:currentPage-1};
				var filter = {};
	            if($scope.query){
	            	filter.mapQuery = angular.copy(cacheQuery);
	            	filter.mapQuery.flag = "list";
	            	if(filter.mapQuery.deviceID){
	            		filter.mapQuery.deviceID = filter.mapQuery.deviceID.deviceID;
	            	}
	            	if(!filter.mapQuery.domainGroup || filter.mapQuery.domainGroup == 'all'){
	            		delete filter.mapQuery.domainGroup;
	            	};
	            	//filter.mapQuery.deviceID = filter.mapQuery.deviceID.deviceID;
	            	if(!filter.mapQuery.deviceID || filter.mapQuery.deviceID == '全部'){
	            		delete filter.mapQuery.deviceID;
	            	}  	
	            }
	            var result = HttpService.post('rest/analysis/wifi/traffic',filter);
	            result.then(function success(resp){ 
	            	$scope.showLoading = false;
	           		if(resp.length > 0){
	           			ModalService.showModal({
							templateUrl: 'report/templates/traffic_chart.html',
							controller: 'TrafficChartCtrl',
							inputs: {
								title: '',
								list: resp
							}
						}).then(function(modal) {
							modal.close.then(function(result) {
								
							});
						});	   
	           		}else{
	           			alert('无图表显示！')
	           		}
	            },function error(err){
	           		$scope.showLoading = false;
	            })
	           return result;
			};

		$scope.search = function() {
			$scope.showLoading = true;
			delEmptyInput($scope.query);
			cacheQuery = angular.copy($scope.query);
			$scope.getNoPagingList = function() {				
				var filter={page_size:50000,page_no:1};
	            if($scope.query){
	            	filter.mapQuery = angular.copy(cacheQuery);
	            	filter.mapQuery.flag = "pager"; 
	            	if(!filter.mapQuery.domainGroup || filter.mapQuery.domainGroup == 'all'){
	            		delete filter.mapQuery.domainGroup;
	            	};
	            	if(filter.mapQuery.deviceID){
	            		filter.mapQuery.deviceID = filter.mapQuery.deviceID.deviceID;
	            	}
	            	if(!filter.mapQuery.deviceID || filter.mapQuery.deviceID == '全部'){
	            		delete filter.mapQuery.deviceID;
	            	} else {
	            		delete filter.mapQuery.domainGroup;
	            	}
	            }
	            var result = HttpService.post('rest/analysis/wifi/traffic',filter);
	            result.then(
	            	function success(resp){
		            	$scope.showLoading = false;
		           		if(resp.count == 0){
		           			$scope.btn.status = true; 
		           			DialogService.showMessage(
			                '提示',
			                '没有查询结果！',null);
		           		}else{
		           			$scope.btn.status = false;
		           			$scope.showFooter = true;
		           		}
		            },
		            function error(err){
		            	$scope.showLoading = false;
		            })
	           return result;
			};
           	var query = {};
			GridServiceReport.refresh($scope, query, 50000, true);
		};
		$scope.showChar = function(){
			//$scope.showLoading = true;			
			showCharts();
			GridServiceReport.refresh($scope);
			
		}

	}
});