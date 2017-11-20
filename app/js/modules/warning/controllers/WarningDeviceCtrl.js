define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat', 'EmptyInput', 'delEmptyInput','GetLocalTime', WarningDeviceCtrl];

	function WarningDeviceCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat, EmptyInput, delEmptyInput,GetLocalTime) {

		$scope.query = {};
		$scope.gridItemData = {};
		$scope.deviceAlarm = {};
		$scope.selectData = {};
		EmptyInput($scope.query);
		
		$scope.isActive = true;
		$scope.isShow = false;
		
		var toogle = document.getElementsByClassName('sidebar-toggle')[0];		
		
		toogle.onclick = function(){			
			var winWid = window.outerWidth;
			var sidebarWid = $(".main-sidebar").width();
			if(winWid <= 1280){
				if(sidebarWid = 230){
					$scope.isShow = !$scope.isShow;
				}
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

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter={page_size:pageSize,page_no:currentPage,order_by:['timestamp']};
            if($scope.query){
            	filter.query = angular.copy($scope.query);
            	if($scope.query.cause == "全部"){
            		delete filter.query.cause;
            	}
            	if($scope.query.deviceName == '全部'){
            		delete filter.query.deviceName;
            	}           	
            	if(filter.query.timestamp__ge){
            		filter.query.timestamp__ge = DateFormat(filter.query.timestamp__ge);
            	}
            	if(filter.query.timestamp__lt){
            		filter.query.timestamp__lt = DateFormat(filter.query.timestamp__lt);
            	}
            }
            var result = HttpService.post('rest/alarm/device/search',filter);
            result.then(function success(resp){
           		var list = resp.items;
           		for(var i=0; i<list.length; i++){
           			list[i].timestamp = GetLocalTime(list[i].timestamp) ;
	            }
            })
           return result;
		};

		var add = function() {
			ModalService.showModal({
				templateUrl: 'warning/templates/warning_device_form.html',
				controller: 'WarningDeviceEditCtrl',
				inputs: {
					title: '添加意见',
					userInfo: {}
				}
			}).then(function(modal) {
				modal.close.then(function(result) {
					GridService.refresh($scope);
				});
			});
		};
		var remove = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection.length == 0 || selection.length == null){
		            DialogService.showConfirm(
		                '提示',
		                '至少选择一条进行操作！',null)
					return;
		        }else{
					DialogService.showConfirm(
						'确认信息',
						'确定要删除吗？',
						function() {
							ids = [];
							selection = $scope.gridApi.selection.getSelectedRows();
							for(var i in selection) {
								ids.push(selection[i].id);
							}
							HttpService.remove('rest/alarm/device/delete', {id: ids}).then(function success(data) {
										GridService.refresh($scope);
									},
									function failure(errorResponse) {
		
									})
								.finally(function() {
		
								});
						}, null);
				}
		};

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
			{ field: 'deviceName',displayName: '告警设备编号',enableSorting:false,enableColumnMenu:false },
	        { field: 'cause',displayName: '告警原因',enableSorting:false,enableColumnMenu:false },
	        { field: 'timestamp',displayName: '告警时间',enableHiding:false,enableSorting:false,enableColumnMenu: false }
			],
			btnTools: [
				{
					css: 'fa fa-fw fa-refresh',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				}, 
				{
					css: 'fa fa-fw fa-minus-circle',
					tooltip: '删除',
					method: remove
				},
				{
					css: 'fa fa-fw fa-share-square-o',
					tooltip: '导出',
					method: remove
				},
				{
					css: 'fa fa-fw fa-download',
					tooltip: '下载',
					method: remove
				}]

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
			GridService.refresh($scope);
		};

	}
});