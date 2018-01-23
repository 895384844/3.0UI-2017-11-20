define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'EmptyInput','GetLocalTime','delEmptyInput', 'groupSelect', WarningBlacklistCtrl];

	function WarningBlacklistCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, EmptyInput, GetLocalTime,delEmptyInput, groupSelect) {
		
		$scope.query = {};
		$scope.gridItemData = {};
		$scope.blackList = {};
		$scope.selectData = {};
		EmptyInput($scope.query);
		var cacheQuery = {};
		$scope.showLoading = false;
		
		var field = {
			'name' : '姓名',
			'fullPath' : '域组信息',
			'imei' : 'IMEI',
			'imsi' : 'IMSI',
			'deviceName' : '采集设备名称',
			'timestamp' : '捕获时间'
		};
		
		HttpService.get('rest/system/domain/allgroup').then(function success(data) {
			for(var i=0; i<data.length; i++){
				data[i].fullPath = data[i].fullPath.split('•');
				var str = data[i].fullPath[2]+"•"+data[i].fullPath[3]
				data[i].fullPath = str;
			}
			data.splice(0,0,{fullPath:"全部"})
            $scope.vendorChoice = data;
        });
        

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			$scope.showLoading = true;
			var filter={page_size:pageSize,page_no:currentPage,order_by:['-timestamp']};
            if($scope.query){
            	filter.query = angular.copy(cacheQuery);
            	delete filter.query.deviceID;
            	if(filter.query.domainGroup == 'all' || !filter.query.domainGroup){
            		delete filter.query.domainGroup;
            	}
            }
            var result = HttpService.post('rest/alarm/efence/search',filter);
            result.then(function success(resp){     
            	$scope.showLoading = false;
	           	var list = resp.items;
           		for(var i=0; i<list.length; i++){
           			list[i].timestamp = GetLocalTime(list[i].timestamp) ;
	            }	           	
            },function error(err){
            	$scope.showLoading = false;
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

		var exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "IMSI告警-"+times,
			    fields: field,
			    fileName: "WarningBlacklistPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: $scope.query
			    }			    
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	delete filter.pager.query.deviceID;
            	if(filter.pager.query.domainGroup == 'all' || !filter.pager.query.domainGroup){
            		delete filter.pager.query.domainGroup;
            	}
            }
			HttpService.post('rest/alarm/efence/export',filter).then(function success(resp) {
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
		
		GridService.create($scope, {
			fetchData: true,
			columnDefs: [{
					field: 'name',
					displayName: '姓名',
					enableSorting: false,
					enableColumnMenu: false
				},
				{ 
					field: 'fullPath',
					displayName: '域组信息',
					enableSorting:false,
					enableColumnMenu:false 
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
					//css: 'fa fa-fw fa-refresh',
					src : 'images/refresh.png',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				}, 
				/*{
					//css: 'fa fa-fw fa-minus-circle',
					src : 'images/remove.png',
					tooltip: '删除',
					method: remove
				},*/
				{
					//css: 'fa fa-fw fa-share-square-o',
					src : 'images/exports.png',
					tooltip: '导出',
					method: exports
				}
			]
		});
		
		$scope.search = function() {
			delEmptyInput($scope.query);
			cacheQuery = angular.copy($scope.query);						
			GridService.refresh($scope);
		};

	}
});