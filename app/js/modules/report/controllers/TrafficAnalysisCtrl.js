define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat', 'EmptyInput', 'delEmptyInput','groupSelect', TrafficAnalysisCtrl];

	function TrafficAnalysisCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat, EmptyInput, delEmptyInput,groupSelect) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		$scope.btn = {};
		$scope.btn.status = true;
		EmptyInput($scope.query);
		$scope.data = [];
		$scope.isDeviceID = false;	
		$scope.query.timeSpan = '1h';
		
		$scope.isActive = true;
		$scope.isShow = false;
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		
		var toogle = document.getElementsByClassName('sidebar-toggle')[0];
		
		HttpService.get('rest/system/domain/allgroup').then(function success(data) {
			data.splice(0,0,{adCode: 'all',fullPath: '全部'});
            $scope.vendorChoice = data;
        });
        groupSelect("#divselect1");
        $('#cite2').text('全部')
        
        $scope.groupName = function(scope){
        	$scope.query.deviceID = '';
        	var a = scope.group.fullPath;
        	$scope.query.domainGroup = scope.group.adCode;
        	a = a.substring(a.lastIndexOf("•")+1);
        	$('#cite2').text(a);
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
		
		toogle.onclick = function(){			
			var winWid = window.outerWidth;
			var sidebarWid = $(".main-sidebar").width();
			if(winWid <= 1280){
				if(sidebarWid = 230){
					$scope.isShow = !$scope.isShow;
				}
			}
		}
		
		$scope.emptyDatetime = function(){
			$scope.isShow = true;
			$('.datetimes').val('');
			delete $scope.query.startTime;
			delete $scope.query.endTime;
		}
		
		$scope.checkInput = function(){
			if(!$scope.query.startTime){
				delete $scope.query.startTime;
				$scope.btn.status = true;
			}
			if(!$scope.query.endTime){
				delete $scope.query.endTime;
				$scope.btn.status = true;
			}
		}
		
		onWinResize();
		
		function onWinResize(){
			var winWid = window.outerWidth;
			if(winWid > 1176){
				$scope.isShow = false;
			}else{
				$scope.isShow = true;
			}		
		}
		
		window.addEventListener("resize",onWinResize);
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}

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
			columnDefs: [{
					field: 'start',
					displayName: '开始时间',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'end',
					displayName: '结束时间',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'count',
					displayName: '终端数量',
					enableHiding: false,
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
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.getPagingList = function(currentPage, pageSize, sort) {
				var filter={page_size:pageSize,page_no:currentPage};
	            if($scope.query){
	            	filter.mapQuery = angular.copy($scope.query);
	            	filter.mapQuery.flag = "pager"; 
	            	if(!filter.mapQuery.domainGroup || filter.mapQuery.domainGroup == 'all'){
	            		delete filter.mapQuery.domainGroup;
	            	};
	            	if(filter.mapQuery.deviceID){
	            		filter.mapQuery.deviceID = filter.mapQuery.deviceID.deviceID;
	            	}
	            	if(!filter.mapQuery.deviceID || filter.mapQuery.deviceID == '全部'){
	            		delete filter.mapQuery.deviceID;
	            	} else {
	            		delete filter.mapQuery.domainGroup;
	            	}
	            }
	            if($scope.search){
	                angular.extend(filter,$scope.search);
	            }
	            if(!!sort){
	            	filter.order_by=sort;
	            }
	            var result = HttpService.post('rest/analysis/efence/traffic',filter);
	            result.then(function success(resp){
	           		if(resp.count == 0){
	           			$scope.btn.status = true;           			
	           		}else{
	           			$scope.btn.status = false;
	           		}
	            })
	           return result;
			};
			GridService.refresh($scope);
		};
		$scope.showChar = function(){
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.getPagingList = function(currentPage, pageSize, sort) {
			//	var filter={page_size:pageSize,page_no:currentPage-1};
				var filter = {};
	            if($scope.query){
	            	filter.mapQuery = angular.copy($scope.query);
	            	filter.mapQuery.flag = "list";
	            	filter.mapQuery.deviceID = filter.mapQuery.deviceID.deviceID;
	            	if(!filter.mapQuery.domainGroup || filter.mapQuery.domainGroup == 'all'){
	            		delete filter.mapQuery.domainGroup;
	            	};
	            	filter.mapQuery.deviceID = filter.mapQuery.deviceID.deviceID;
	            	if(!filter.mapQuery.deviceID || filter.mapQuery.deviceID == '全部'){
	            		delete filter.mapQuery.deviceID;
	            	} else {
	            		delete filter.mapQuery.domainGroup;
	            	}    	
	            }
	            var result = HttpService.post('rest/analysis/efence/traffic',filter);
	            result.then(function success(resp){ 
	           		if(resp.length > 0){
	           			ModalService.showModal({
							templateUrl: 'report/templates/traffic_chart.html',
							controller: 'TrafficChartCtrl',
							inputs: {
								title: '',
								list: resp
							}
						}).then(function(modal) {
							modal.close.then(function(result) {
								
							});
						});	   
	           		}else{
	           			alert('无图表显示！')
	           		}
	           })
	           return result;
			};
			GridService.refresh($scope);
			
		}

	}
});