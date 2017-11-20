define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', SweepLogCtrl];

	function SweepLogCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService) {

		$scope.gridItemData = {};
		$scope.query = {};
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
			return HttpService.post('warning/warning_blacklist/get', filter);
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

		GridService.create($scope, {
			fetchData: true,
			columnDefs : [
	        { field: 'deviceNumber',displayName: '设备编号', width: 100,maxWidth:200,minWidth:100 },
	        { field: 'creationTimestamp',displayName: '采集时间', width: 150,maxWidth:200,minWidth:100 },
	        { field: 'URxlv',width: 100,maxWidth:200,minWidth:100 },
	        { field: 'M2Rxlv',width: 100,maxWidth:200,minWidth:100 },
	        { field: 'U6Arfcn',width: 100,maxWidth:200,minWidth:100 },
	        { field: 'M6Rxlv',width: 100,maxWidth:200,minWidth:100 },
	        { field: 'U5Arfcn',width: 100,maxWidth:200,minWidth:100 },
	        { field: 'U4Arfcn',width: 100,maxWidth:200,minWidth:100 },
	        { field: 'U3Rxlv',width: 100,maxWidth:200,minWidth:100 },
	        { field: 'MArfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'M6Arfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'M3Arfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'M2Arfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'M4Rxlv', width: 100,maxWidth:200,minWidth:100 },
            { field: 'M3Rxlv',width: 100,maxWidth:200,minWidth:100 },
            { field: 'M5Arfcn', width: 100,maxWidth:200,minWidth:100 },
            { field: 'M4Arfcn', width: 100,maxWidth:200,minWidth:100 },
            { field: 'U3Arfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'U2Rxlv',width: 100,maxWidth:200,minWidth:100 },
            { field: 'M5Rxlv',width: 100,maxWidth:200,minWidth:100 },
            { field: 'U5Rxlv',width: 100,maxWidth:200,minWidth:100 },
            { field: 'U2Arfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'M1Arfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'U4Rxlv',width: 100,maxWidth:200,minWidth:100 },
            { field: 'UArfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'U1Rxlv',width: 100,maxWidth:200,minWidth:100 },
            { field: 'M1Rxlv', width: 100,maxWidth:200,minWidth:100 },
            { field: 'U1Arfcn',width: 100,maxWidth:200,minWidth:100 },
            { field: 'MRxlv',width: 100,maxWidth:200,minWidth:100 },
            { field: 'U6Rxlv', width: 100,maxWidth:200,minWidth:100 }
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
			GridService.refresh($scope);
		};

	}
});