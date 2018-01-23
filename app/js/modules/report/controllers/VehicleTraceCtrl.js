define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'MENU_GROUPS', 'SystemService', 'DateFormat', 'EmptyInput', 'delEmptyInput', 'GetLocalTime', '$timeout', '$interval', VehicleTraceCtrl];

	function VehicleTraceCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, menuGroups, SystemService, DateFormat, EmptyInput, delEmptyInput,GetLocalTime, $timeout, $interval) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		$scope.btn = {};
		var cacheQuery = {};
		$scope.btn.status = true;
		$scope.isActive = true;
		$scope.isShow = false;	
		$scope.showLoading = false;

		var field = {
			'plate' : '车牌号',
			'deviceID' : '采集设备编号',
			'location' : '采集设备域组信息',
			'datetime' : '采集时间'
		}
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		
		$scope.checkInput = function(){
			if(!$scope.query.plate){
				$scope.btn.status = true;
			}
		}
		
		var add = function() {
			ModalService.showModal({
				templateUrl: 'system/templates/user_form.html',
				controller: 'SystemUserEditCtrl',
				inputs: {
					title: '新建用户',
					userInfo: {}
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
				title: "车辆轨迹分析-"+times,
			    fields: field,
			    fileName: "VehicleTracePageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        query: angular.copy(cacheQuery)
			    }
			}
			HttpService.post('rest/analysis/vehicle/trace_export',filter).then(function success(resp) {
            	$scope.showLoading = false;
            	var filter={fileName: resp.file}
            	var anchor = angular.element('<a/>');
		        anchor.attr({
		            href: 'EFS/core/system/file/download_file?fileName=' + resp.file
		        })[0].click();
			},function error(err){
				$scope.showLoading = false;
			})
		}

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [{
					field: 'plate',
					displayName: '车牌号',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'deviceID',
					displayName: '采集设备编号',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'location',
					displayName: '采集设备域组信息',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'datetime',
					displayName: '采集时间',
					enableHiding:false,
					enableSorting: false,
					enableColumnMenu: false
				}
			],
			btnTools: [{
					//css: 'fa fa-fw fa-refresh',
					src: 'images/refresh.png',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				},
				{
					//css: 'fa fa-fw fa-share-square-o',
					src: 'images/exports.png',
					tooltip: '导出',
					method: exports
				}
			]

		});

		$scope.search = function() {
			cacheQuery = angular.copy($scope.query);
			delEmptyInput($scope.query);
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.getPagingList = function(currentPage, pageSize, sort) {
				$scope.showLoading = true;
				var filter={
					page_size:pageSize,
					page_no:currentPage
				};
	            if($scope.query){
	            	filter.query = angular.copy(cacheQuery);
	            	filter.query.flag = "pager";
	            }
	            var result = HttpService.post('rest/analysis/vehicle/trace',filter);
	            result.then(function success(resp){
	            	$scope.showLoading = false;
	            	if(resp.count == 0){
	            		DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		                return;
	            	}else{
		           		var list = resp.items;
		           		if(list.length > 0){
		           			$scope.btn.status = false;
		           		}
		           	}
	           	},function error(err){
	           		$scope.showLoading = false;
	           	})
	           	return result;
			};
			GridService.refresh($scope);
		};

		$scope.showMap = function(){
			if(!$scope.query.plate){
				alert('无图表显示！')
			}else{
				$scope.showLoading = true;
				var filter={page_size:20,page_no:1};
	            if($scope.query){
	            	filter.query = angular.copy(cacheQuery);
	            	filter.query.flag = "list";  
	            }
                HttpService.post('rest/analysis/vehicle/trace',filter).then(function success(resp){
					$scope.showLoading = false;
	            	var locations = [];
					var pt = [];
					for(var i=0; i<resp.length; i++){
						if(resp[i].center){
							var groupCenter = resp[i].center.split(',');
							pt.push(groupCenter);
							var obj = {
				    			lon : groupCenter[0],
				    			lat : groupCenter[1],
				    			locations : resp[i].location,
				    			timestamp : resp[i].datetime,
				    			pt : pt,
                                timeList: resp[i].timeList
				    		};
				    		locations.push(obj);
						}						
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
			}
		}
	}
});
