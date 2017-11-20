define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', SystemRoleCtrl];

	function SystemRoleCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService) {

		$scope.gridItemData = {};
		$scope.role = {};
		$scope.selectData = {};

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter = {
				page_size: pageSize,
				page_no: currentPage - 1
			};
			if($scope.search) {
				angular.extend(filter, $scope.search);
			}
			if(!!sort) {
				//filter.sort=sort;
			}
			return HttpService.post('system/user/get', filter);
		};

		var add = function() {
			ModalService.showModal({
				templateUrl: 'system/templates/role_form.html',
				controller: 'SystemUserEditCtrl',
				inputs: {
					title: '新增角色',
					userInfo: {}
				}
			}).then(function(modal) {
				modal.close.then(function(result) {
					GridService.refresh($scope);
				});
			});
		};
		var remove = function() {
			DialogService.showConfirm(
				'确认信息',
				'确定要删除吗？',
				function() {
					ids = [];
					selection = $scope.gridApi.selection.getSelectedRows();
					for(var i in selection) {
						ids.push(selection[i].id);
					}
					HttpService.remove('users/', {
							ids: ids
						}).then(function success(data) {
								GridService.refresh($scope);
							},
							function failure(errorResponse) {

							})
						.finally(function() {

						});
				}, null);
		};
		var exports = function(){
	        var obj = {name : $scope.role.name};
	       // document.location.href = gridServices.exportAction('/system/roleAction!exportExcel.action',obj);
	    };
		var edit = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
			if(selection.length <= 0) {				
				DialogService.showConfirm(
	                '提示',
	                '请选择需要编辑的选项',null)
				return;
			}

			if(selection.length > 1) {
				DialogService.showConfirm(
	                '提示',
	                '最多选择一项！',null)
				return;
			}
			ModalService.showModal({
                templateUrl: 'system/templates/role_form.html',
                controller: 'SystemRoleEditCtrl',
                inputs: {  // 将$scope.row以参数名row注入到 editUserCtrl
                    row: $scope.row
                }
            })
			/*var rid = selection[0];
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
			});*/
		};
		var menuManage = function(){
	    	var selection = $scope.gridApi.selection.getSelectedRows();
	        if( selection == null || selection.length != 1){
	            alert('请选择其中一条处理！');
	        }else{
	            ModalService.showModal({
	                templateUrl: 'system/templates/role_menu.html',
	                controller: 'SystemRoleMenuCtrl',
	                inputs: {  // 将$scope.row以参数名row注入到 editUserCtrl
	                    row: $scope.row
	                }
	            })/*.then(function(modal) {
	                modal.element.modal();
	                modal.close.then(function() {
	                    $scope.promise = gridServices.promiseNew('/system/roleAction!listRole.action',{
	                        page: $scope.newPage ? $scope.newPage : 1,
	                        rows: 20,
	                        sort : 'id',
	                        order: 'desc'
	                    });
	                    $scope.getPage($scope.promise);
	                });
	            });*/
	        }
	    };
	    var powerManage = function(){
	    	var selection = $scope.gridApi.selection.getSelectedRows();
	        if( selection == null || selection.length != 1){
	            alert('请选择其中一条处理！');
	        }else{
	            ModalService.showModal({
	                templateUrl: 'system/templates/role_power.html',
	                controller: 'SystemRolePowerCtrl',
	                inputs: {  // 将$scope.row以参数名row注入到 editUserCtrl
	                    row: $scope.row
	                }
	            })/*.then(function(modal) {
	                modal.element.modal();
	                modal.close.then(function(result) {
	                    $scope.promise = gridServices.promiseNew('/system/roleAction!listRole.action',{
	                        page: $scope.newPage ? $scope.newPage : 1,
	                        rows: 20,
	                        sort : 'id',
	                        order: 'desc'
	                    });
	                    $scope.getPage($scope.promise);
	                });
	            });*/
	        }
	    };

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
			{ field: 'name',displayName: '角色' },
	        { field: 'isDefaultRole',displayName: '是否为缺省角色' },
	        { field: 'describle',displayName: '备注' }
			],
			btnTools: [
				{
					css: 'fa fa-fw fa-refresh',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				}, {
					css: 'fa fa-fw fa-plus-circle',
					tooltip: '添加',
					method: add
				}, {
					css: 'fa fa-fw fa-minus-circle',
					tooltip: '删除',
					method: remove
				}, {
					css: 'fa fa-fw fa-pencil',
					tooltip: '编辑',
					method: edit
				}, {
					css: 'fa fa-fw fa-file-text-o',
					tooltip: '菜单分配',
					method: menuManage
				}, {
					css: 'fa fa-fw fa-key',
					tooltip: '权限分配',
					method: powerManage
				}, {
					css: 'fa fa-fw fa-share-square-o',
					tooltip: '导出',
					method: exports
				}, {
					css: 'fa fa-fw fa-download',
					tooltip: '下载',
					method: add
				}				
			]
		});
		

		

		$scope.search = function() {
			GridService.refresh($scope);
		};

	}
});