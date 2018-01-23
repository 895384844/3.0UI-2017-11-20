define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','EmptyInput','delEmptyInput', 'GetLocalTime', NotifyLogCtrl];

	function NotifyLogCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,EmptyInput,delEmptyInput,GetLocalTime) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		EmptyInput($scope.query);
		var cacheQuery = {};
		
		var field = {
			'address' : '接收地址',
			'content' : '发送内容',
			'timestamp' : '发送时间',
			'result' : '发送结果'
		}

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter={page_size:pageSize,page_no:currentPage-1};
            if($scope.query){
            	filter.query = angular.copy(cacheQuery);
            	if(filter.query.timestamp__ge){
            		filter.query.timestamp__ge = DateFormat(filter.query.timestamp__ge);
            	}
            	if(filter.query.timestamp__lt){
            		filter.query.timestamp__lt = DateFormat(filter.query.timestamp__lt);
            	}
            	filter.order_by = ["-timestamp"];
            }
            var result = HttpService.post('rest/alarm/message/search',filter);
            result.then(function success(resp){
           		if(!resp.items){
           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		            return;
           		}else{
	           		var list = resp.items;
	           		for(var i=0; i<list.length; i++){
	           			list[i].timestamp = GetLocalTime(list[i].timestamp);
	           			if(list[i].result == 1){
	           				list[i].result = '成功';
	           			}else if(list[i].result == 0){
	           				list[i].result = '失败';
	           			}else{
	           				list[i].result = '未知';
	           			}
	           		}
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
		            DialogService.showMessage(
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
		
		var exports = function(){
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "短信通知-"+times,
			    fields: field,
			    fileName: "NotifyLogPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: angular.copy($scope.query)
			    }			    
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	if(filter.pager.query.timestamp__ge){
            		filter.pager.query.timestamp__ge = DateFormat(filter.pager.query.timestamp__ge);
            	}
            	if(filter.pager.query.timestamp__lt){
            		filter.pager.query.timestamp__lt = DateFormat(filter.pager.query.timestamp__lt);
            	}
            }
			HttpService.post('rest/alarm/message/export',filter).then(function success(resp) {
            	var filter={fileName: resp.file}
            	var anchor = angular.element('<a/>');
		        anchor.attr({
		            href: 'EFS/core/system/file/download_file?fileName=' + resp.file
		        })[0].click();
			})		
		}

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
					//css: 'fa fa-fw fa-refresh',
					src: 'images/refresh.png',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				},
				{
					//css: 'fa fa-fw fa-minus-circle',
					src: 'images/remove.png',
					tooltip: '删除',
					method: remove
				},
				{
					//css: 'fa fa-fw fa-share-square-o',
					src: 'images/exports.png',
					tooltip: '导出',
					method: exports
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
			cacheQuery = angular.copy($scope.query);
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