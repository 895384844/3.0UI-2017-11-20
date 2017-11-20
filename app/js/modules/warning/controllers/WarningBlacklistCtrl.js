define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'EmptyInput','GetLocalTime','delEmptyInput', 'groupSelect', WarningBlacklistCtrl];

	function WarningBlacklistCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, EmptyInput, GetLocalTime,delEmptyInput, groupSelect) {
		
		$scope.query = {};
		$scope.gridItemData = {};
		$scope.blackList = {};
		$scope.selectData = {};
		EmptyInput($scope.query);
		
		HttpService.get('rest/system/domain/allgroup').then(function success(data) {
			data.splice(0,0,{adCode: 'all',fullPath: '全部'});
            $scope.vendorChoice = data;
        });
        groupSelect("#divselect2");
        $('#cite3').text('全部');
        
        $scope.groupName = function(scope){
        	$scope.query.deviceID = '';
        	var a = scope.group.fullPath;
        	$scope.query.domainGroup = scope.group.adCode;
        	a = a.substring(a.lastIndexOf("•")+1);
        	$('#cite3').text(a);
        	var data = $scope.query.domainGroup * 1;
        	if($scope.query.domainGroup == 'all'){
        		$scope.isDeviceID = false;
        		$scope.isShow = false;
        	}else{
        		$scope.isDeviceID = true;
        		if(window.outerWidth <= 1367){
        			$scope.isShow = true;
        		}       		
        		HttpService.get('rest/device/efence/get',{group:data}).then(function success(resp){
        			resp.splice(0,0,{deviceID:"全部"})
					$scope.deviceID = resp;
					$scope.query.deviceID = '全部';
				});
        	}
        }

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.query = angular.copy($scope.query);
            	filter.order_by = ['timestamp'];
            	delete filter.query.deviceID;
            	if(filter.query.domainGroup == 'all' || !filter.query.domainGroup){
            		delete filter.query.domainGroup;
            	}
            }
            var result = HttpService.post('rest/alarm/efence/search',filter);
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
				templateUrl: 'warning/templates/warning_blacklist_form.html',
				controller: 'WarningBlacklistEditCtrl',
				inputs: {
					title: '新建黑名单',
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
							HttpService.get('rest/alarm/efence/delete', {id: ids}).then(function success(data) {
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
			columnDefs: [{
					field: 'name',
					displayName: '姓名',
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
					field: 'imsi',
					displayName: 'IMSI',
					enableSorting:false,
					enableColumnMenu: false
				},
				{
					field: 'deviceName',
					displayName: '采集设备名称',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'timestamp',
					displayName: '捕获时间',
					enableSorting: false,
					enableColumnMenu: false
				}
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
			GridService.refresh($scope);
		};

	}
});