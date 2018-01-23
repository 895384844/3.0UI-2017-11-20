define(['datetimepicker'],function(datetimepicker) {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','EmptyInput','delEmptyInput','GetLocalTime','groupSelect',AuditLogCtrl];

	function AuditLogCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,EmptyInput,delEmptyInput,GetLocalTime,groupSelect) {

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
		
		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter={page_size:pageSize,page_no:currentPage,order_by:['-timestamp']};
            if($scope.query){
            	filter.query = angular.copy($scope.query);
            }
           var result = HttpService.post('rest/information/efence/search',filter);
           result.then(function success(data){
           		
           })
           return result;
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


		$scope.search = function() {
			delEmptyInput($scope.query);
			GridService.refresh($scope);
		};
	}
});