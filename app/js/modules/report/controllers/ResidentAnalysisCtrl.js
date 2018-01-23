define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'MENU_GROUPS', 'SystemService', 'SectionsService', 'EmptyInput', 'delEmptyInput',ResidentAnalysisCtrl];

	function ResidentAnalysisCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, menuGroups,SystemService,SectionsService,EmptyInput,delEmptyInput) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		var cacheQuery = {};
		$scope.calculation = false;
		$scope.showLoading = false;
		EmptyInput($scope.query);
		$scope.menus = menuGroups;
		$scope.addSections = function(section) {
			SectionsService.addActiveSection(section);
		};
		
		var menus = menuGroups[3].subMenus[2].subMenus[0];
		var str = "'hidden'";
		var mobileNetCarrier = {
			0 : '移动',
			1 : '联通',
			2 : '电信',
			3 : '其它',
			4 : '境外'
		}
		
		var field = {
			'id' : '终端IMSI',
			'imei' : '终端IMEI',
			'count' : '命中次数',
			'attributeName' : '归属地',
			'mobileNetCarrier' : '网络运营商',
			'traceCount' : '查询结果总数',
			'deviceCount' : '经过设备点位个数',
			'address' : '设备点位详情'
		}

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			$scope.showLoading = true;
			var filter = {
				page_size: pageSize,
				page_no: currentPage
			};
			if($scope.query){
				filter.mapQuery = angular.copy(cacheQuery);
			}
			if(!filter.mapQuery){
				delete filter.mapQuery;
			}
			var result = HttpService.post('rest/information/efence/resident', filter);
			result.then(function success(resp){
				$scope.showLoading = false;
				if(resp.items.length == 0){
					$scope.calculation = false;
					DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		            return;
				}else{
					var list = resp.items;
					for(var i=0; i<list.length; i++){
						list[i].info.mobileNetCarrier = mobileNetCarrier[list[i].info.mobileNetCarrier];
						if(list[i].status == 'Pending'){
							$scope.calculation = true;
							list.length = 0;
						}else{
							$scope.calculation = false;
						}
						for(var j in list[i].activeAreas){							
							list[i].activeAreas[j].fullPath = list[i].activeAreas[j].fullPath.split('•');
							if(list[i].activeAreas[j].fullPath.length != 1){
								var str = list[i].activeAreas[j].fullPath[2]+"•"+list[i].activeAreas[j].fullPath[3];
								list[i].activeAreas[j] = str;
							}else{
								list[i].activeAreas[j] = list[i].activeAreas[j].fullPath.join();
							}
							
						}
						for(var k in list[i].residentAreas){
							var pathArray = list[i].residentAreas[k].fullPath.split('•');
							var str = pathArray[2];
							list[i].residentAreas[k] = str;
						}
						for(j in list[i].residentAreas){
							if(!list[i].residentAreas[j]){
								list[i].residentAreas.splice(j,1);
							}
						};
						
						list[i].activeAreas = list[i].activeAreas.join('; ');
						list[i].residentAreas = list[i].residentAreas.join('; ');
					}
				}
			},function error(err){
				$scope.showLoading = false;
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
	            	//GridService.refresh($scope);
	            });
	        });
		};
		
		var exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "常住人口查询-"+times,
			    fields: field,
			    fileName: "ResidentAnalysisPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    param: {
			        mapQuery: angular.copy(cacheQuery)
			    }
			}
			HttpService.post('rest/information/efence/resident_export',filter).then(function success(resp) {
				$scope.showLoading = false;
            	var filter={fileName: resp.file};
            	var anchor = angular.element('<a/>');
		        anchor.attr({
		            href: 'EFS/core/system/file/download_file?fileName=' + resp.file
		        })[0].click();
			},function error(err){
				$scope.showLoading = false;
			})
		}
		
		$scope.addSection = function(row) {
			menus.data = row.id;	
			SectionsService.addActiveSection(menus);
			$scope.$emit('to-parent', row.id);
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
					field: 'info.imei',
					displayName: '终端IMEI',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'residentAreas',
					displayName: '常住地',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'activeAreas',
					displayName: '经常活动区域',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'info.attributeName',
					displayName: '归属地',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'info.mobileNetCarrier',
					displayName: '网络运营商',
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
		        	cellTemplate: '<a class="fa fa-arrow-right btn-edit" style="margin-left:15px;color:#31708f;" href ng-class="{ ' + str + ' : grid.appScope.isOpen(row.entity) }" ng-click="grid.appScope.addSection(row.entity)" uib-tooltip="设置" tooltip-placement="left"></a>'
		        }
			],
			btnTools: [{
					//css: 'fa fa-fw fa-refresh',
					src: 'images/refresh.png',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				}/*,
				{
					//css: 'fa fa-fw fa-share-square-o',
					src: 'images/exports.png',
					tooltip: '导出',
					method: exports
				}*/
			]

		});
		
		$scope.search = function() {
			cacheQuery = angular.copy($scope.query);
			delEmptyInput($scope.query);
			GridService.refresh($scope);
		};

	}
});