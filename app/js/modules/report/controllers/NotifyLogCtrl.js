define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','EmptyInput','delEmptyInput', NotifyLogCtrl];

	function NotifyLogCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,EmptyInput,delEmptyInput) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		EmptyInput($scope.query);

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter={page_size:pageSize,page_no:currentPage-1};
            if($scope.query){
            	filter.query = angular.copy($scope.query);
            	if(filter.query.timestamp__ge){
            		filter.query.timestamp__ge = DateFormat(filter.query.timestamp__ge);
            	}
            	if(filter.query.timestamp__lt){
            		filter.query.timestamp__lt = DateFormat(filter.query.timestamp__lt);
            	}
            	filter.order_by = ["timestamp"];
            }
            if($scope.search){
                angular.extend(filter,$scope.search);
            }
            if(!!sort){
            	filter.order_by=sort;
            }
            var result = HttpService.post('rest/alarm/message/search',filter);
            result.then(function success(resp){
           		if(resp.count == 0){
           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		            return;
           		}
            })
           return result;
		};

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
		var remove = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection.length == 0){
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
							HttpService.get('rest/alarm/message/delete', {
									id: ids
								}).then(function success(data) {
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
					field: 'address',
					displayName: '接收地址',
					maxWidth: 500,
					minWidth: 200,
					enableSorting:false,
					enableColumnMenu: false
				},
				{
					field: 'content',
					displayName: '发送内容',
					maxWidth: 500,
					minWidth: 200,
					enableSorting:false,
					enableColumnMenu: false
				},
				{
					field: 'timestamp',
					displayName: '发送时间',
					maxWidth: 500,
					minWidth: 200,
					enableHiding: false,
					enableSorting: false,
					enableCulumnMenu: false
				},
				{
					field: 'result',
					displayName: '发送结果',
					maxWidth: 500,
					minWidth: 200,
					enableSorting:false,
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
					css: 'fa fa-fw fa-minus-circle',
					tooltip: '删除',
					method: remove
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
			GridService.refresh($scope);
		};

		$scope.showCondition = function() {
			ModalService.showModal({
				templateUrl: 'modals/collisionAnalysis/filter.html',
				controller: 'collisionFilterModalCtrl'
			}).then(function(modal) {
				modal.element.modal();
				modal.close.then(function(result) {
					if(typeof(result) !== 'undefined') {
						$scope.conditionArray.push(result);
					}
				});
			});
		}

		$scope.removeCondition = function(index) {
			$scope.conditionArray.splice(index, 1);
			angular.element('.grid').trigger('resize')
		}

		$scope.known = true;
		$scope.unknown = false;
		$scope.tab = function() {
			$scope.known = !$scope.known;
			$scope.unknown = !$scope.unknown;
		}

	}
});