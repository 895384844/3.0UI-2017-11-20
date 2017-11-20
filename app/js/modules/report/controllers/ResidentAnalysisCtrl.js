define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'MENU_GROUPS', 'SystemService', 'SectionsService', 'EmptyInput', 'delEmptyInput',ResidentAnalysisCtrl];

	function ResidentAnalysisCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, menuGroups,SystemService,SectionsService,EmptyInput,delEmptyInput) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		$scope.calculation = false;
		EmptyInput($scope.query);
		var menus = menuGroups[3].subMenus[2];
		var str = "'hidden'";
		var mobileNetCarrier = {
			0 : '移动',
			1 : '联通',
			2 : '电信',
			3 : '其它',
			4 : '境外'
		}

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter = {
				page_size: pageSize,
				page_no: currentPage
			};
			if($scope.query){
				filter.mapQuery = angular.copy($scope.query);
			}
			if(!filter.mapQuery){
				delete filter.mapQuery;
			}
			var result = HttpService.post('rest/information/efence/resident', filter);
			result.then(function success(resp){
				if(resp.items.length == 0){
					$scope.calculation = false;
					DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		            return;
				}else{
					var list = resp.items;
					for(var i=0; i<list.length; i++){
						list[i].mobileNetCarrier = mobileNetCarrier[list[i].mobileNetCarrier];
						if(list[i].status == 'Pending'){
							$scope.calculation = true;
							list.length = 0;
						}else{
							$scope.calculation = false;
						}
					}
				}
			})
			return result;
		};
		
		$scope.set = function(row) {
			ModalService.showModal({
	            templateUrl: 'report/templates/resident_detail.html',
	            controller: 'ResidentDetailCtrl',
	            inputs: { 
	                row : row
	            }
	        }).then(function(modal) {
	            //modal.element.modal();
	            modal.close.then(function() { 
	            	GridService.refresh($scope);
	            });
	        });
		};
		
		$scope.addSection = function(row) {
			menus.data = row.id;
			SectionsService.addActiveSection(menus);
		};

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
				{
					field: 'id',
					displayName: '终端IMSI',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'imei',
					displayName: '终端IMEI',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'count',
					displayName: '命中次数',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'attributeName',
					displayName: '归属地',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'mobileNetCarrier',
					displayName: '终端网络提供商',
					enableSorting: false,
					enableColumnMenu: false
				},
				{ 
		        	field: 'btnGroup',
		        	displayName: '常住人口详情',
		        	enableSorting : false,
		        	enableColumnMenu : false,
		        	cellTemplate: '<a class="fa fa-gear btn-edit" style="margin-left:15px;color:#31708f;" href ng-class="{ ' + str + ' : grid.appScope.isOpen(row.entity) }" ng-click="grid.appScope.set(row.entity)" uib-tooltip="设置" tooltip-placement="left"></a>'
		        },
		        { 
		        	field: 'btnGroup',
		        	displayName: '查看终端轨迹',
		        	enableSorting : false,
		        	enableColumnMenu : false,
		        	cellTemplate: '<a class="fa fa-gear btn-edit" style="margin-left:15px;color:#31708f;" href ng-class="{ ' + str + ' : grid.appScope.isOpen(row.entity) }" ng-click="grid.appScope.addSection(row.entity)" uib-tooltip="设置" tooltip-placement="left"></a>'
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
					method: function() {
						GridService.refresh($scope);
					}
				},
				{
					css: 'fa fa-fw fa-download',
					tooltip: '下载',
					method: function() {
						GridService.refresh($scope);
					}
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