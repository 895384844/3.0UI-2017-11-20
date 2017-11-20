define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'MENU_GROUPS', 'SystemService', 'DateFormat', 'EmptyInput', 'delEmptyInput', 'GetLocalTime', '$timeout', '$interval', TraceLogCtrl];

	function TraceLogCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, menuGroups, SystemService, DateFormat, EmptyInput, delEmptyInput,GetLocalTime, $timeout, $interval) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		$scope.btn = {};
		$scope.btn.status = true;
		$scope.isActive = true;
		$scope.isShow = false;
		
		var thisMenu = menuGroups[3].subMenus[2];
		
		function searchData(){
			if(thisMenu.data){
				$scope.query.imsi = angular.copy(thisMenu.data)*1;
				$scope.getPagingList = function(currentPage, pageSize, sort) {
					var filter={
						page_size:pageSize,
						page_no:currentPage,					
						query:{
							flag:'pager',
							imsi : thisMenu.data
						}
					};
		           	
		            var result = HttpService.post('rest/analysis/efence/trace',filter);
		            result.then(function success(resp){
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
		           	})
		           	return result;
				};
			}
		}
		
		searchData();
		
		//$interval(searchData,500)
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		
		$scope.checkInput = function(){
			if(!$scope.query.imsi){
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

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [{
					field: 'imsi',
					displayName: 'IMSI',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'imei',
					displayName: 'IMEI',
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
					css: 'fa fa-fw fa-refresh',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				},
				{
					css: 'fa fa-fw fa-share-square-o',
					tooltip: '导出',
					method: add
				},
				{
					css: 'fa fa-fw fa-download',
					tooltip: '下载',
					method: add
				}
			]

		});
		$scope.export = function() {
			var filter = {
				"fields": [
					"name",
					"id"
				]
			};
			HttpService.download('action/group/exportxml', filter);
		};

		$scope.edit = function() {
			var selection = $scope.gridapi.getSelectedRows();
			if(selection.length <= 0) {
				$scope.showNoItemDialog(
					$lt('提示'),
					$lt('请选择需要编辑的选项')
				);
				return;
			}

			if(selection.length > 1) {
				$scope.showNoItemDialog(
					$lt('提示'),
					$lt('最多选择一项')
				);
				return;
			}
			var rid = selection[0];
			$scope.selectData = $scope.gridapi.getSelectedData(rid);
			$scope.getgridData = $scope.gridapi.getgridData();
			var dataArray = $scope.getgridData.items;
			$.each(dataArray, function(n, data) {
				if($scope.selectData.id == data.id) {
					$scope.gridItemData = data;
					$scope.gridItemData.confirm = $scope.gridItemData.password;
				}
			});
			//$scope.gridItemData.isEdit = 'true';
			OverlayService.show({
				title: $lt('编辑用户信息'),
				template: 'js/modules/warning/templates/warning_blacklist_form.html',
				scope: $scope
			});
		};

		$scope.search = function() {
			delEmptyInput($scope.query);
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.getPagingList = function(currentPage, pageSize, sort) {
				var filter={
					page_size:pageSize,
					page_no:currentPage
				};
	            if($scope.query){
	            	filter.query = angular.copy($scope.query);
	            	filter.query.flag = "pager";       	
	            	if(filter.query.imsi){
	            		filter.query.imsi = filter.query.imsi+'';
	            	}
	            }
	            var result = HttpService.post('rest/analysis/efence/trace',filter);
	            result.then(function success(resp){
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
	           	})
	           	return result;
			};
			GridService.refresh($scope);
		};

		$scope.showMap = function(){
			if(!$scope.query.imsi){
				alert('无图表显示！')
			}else{
				$scope.gridOptions.paginationCurrentPage = 1;
				$scope.getPagingList = function(currentPage, pageSize, sort) {
					var filter={page_size:pageSize,page_no:currentPage};
		            if($scope.query){
		            	filter.query = angular.copy($scope.query);
		            	filter.query.flag = "pager";            	
		            }
		           var result =  HttpService.post('rest/analysis/efence/trace',filter);
		           result.then(function success(resp){
		           		var list = resp.items;
		           	})
		           return result;
				};
				GridService.refresh($scope);
				ModalService.showModal({
					templateUrl: 'report/templates/trace_log_showMap.html',
					controller: 'ShowMapCtrl',
					inputs: {
						title: '新建设备',
						userInfo: {}
					}
				}).then(function(modal) {
					modal.close.then(function(result) {
						GridService.refresh($scope);
					});
				});
			}
		}
	}
});