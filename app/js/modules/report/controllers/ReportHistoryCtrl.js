define(['datetimepicker'],function(datetimepicker) {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','EmptyInput','delEmptyInput','GetLocalTime','groupSelect',ReportHistoryCtrl];

	function ReportHistoryCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,EmptyInput,delEmptyInput,GetLocalTime,groupSelect) {

		$scope.gridItemData = {};
		$scope.query = {};
		EmptyInput($scope.query);
		$scope.selectData = {};
		$scope.isActive = true;
		$scope.isShow = true;
		
		var mobileNetCarrier = {
			0 : '移动',
			1 : '联通',
			2 : '电信',
			3 : '其它',
			4 : '境外'
		}
		
		var mobileNetSystem = {
			0 : 'GSM',
			1 : 'CDMA',
			2 : 'W-CDMA',
			3 : 'TD-CDMA',
			4 : 'FDD-LTE',
			5 : 'TDD-LTE',
			6 : 'WIFI'
		}
		

		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		HttpService.get('rest/system/domain/allgroup').then(function success(data) {
			data.splice(0,0,{adCode: 'all',fullPath: '全部'})
            $scope.vendorChoice1 = data;
        });
        groupSelect("#divselect");
        $('#cite1').text('全部')
        
        $scope.groupNames = function(scope){
        	var a1 = scope.group.fullPath;
        	$scope.query.domainGroup = scope.group.adCode;
        	a1 = a1.substring(a1.lastIndexOf("•")+1);
        	$('#cite1').text(a1)
        }
        
		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter={page_size:pageSize,page_no:currentPage,order_by:['-timestamp']};
            if($scope.query){
            	filter.query = angular.copy($scope.query);
            	if(filter.query.domainGroup == 'all' || !filter.query.domainGroup){
            		delete filter.query.domainGroup;
            	}
            	if(filter.query.timestamp__ge){
            		filter.query.timestamp__ge = DateFormat(filter.query.timestamp__ge);
            	}
            	if(filter.query.timestamp__lt){
            		filter.query.timestamp__lt = DateFormat(filter.query.timestamp__lt);
            	}   
            	if(filter.query.mobileNetCarrier == ' '){
            		delete filter.query.mobileNetCarrier
            	}
            }
           var result = HttpService.post('rest/information/efence/search',filter);
           result.then(function success(data){
           		if(data.count == 0){
           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		                return;
           		}else{
	           		var list = data.items;
	           		for(var i=0; i<list.length; i++){
	           			list[i].mobileNetCarrier = mobileNetCarrier[list[i].mobileNetCarrier];
	           			list[i].timestamp = GetLocalTime(list[i].timestamp);
	           			list[i].mobileNetSystem = mobileNetSystem[list[i].mobileNetSystem];
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

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
				{
					field: 'deviceID',
					displayName: '采集设备编号',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'fullPath',
					displayName: '域组信息',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'timestamp',
					displayName: '采集时间',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'imei',
					displayName: 'IMEI',
					enableSorting:false,
					enableColumnMenu: false
				},
				{
					field: 'imsi',
					displayName: 'IMSI',
					enableSorting:false,
					enableColumnMenu: false
				},
				{
					field: 'attributeName',
					displayName: '归属地',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'mobileNetSystem',
					displayName: '终端网络类型',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'mobileNetCarrier',
					displayName: '终端网络提供商',
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
				}/*,
				{
					css: 'fa fa-fw fa-share-square-o',
					tooltip: '导出',
					method: add
				},
				{
					css: 'fa fa-fw fa-download',
					tooltip: '下载',
					method: add
				}*/
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