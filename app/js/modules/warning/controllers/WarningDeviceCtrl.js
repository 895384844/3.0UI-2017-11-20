define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat', 'EmptyInput', 'delEmptyInput','GetLocalTime', WarningDeviceCtrl];

	function WarningDeviceCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat, EmptyInput, delEmptyInput,GetLocalTime) {

		$scope.query = {};
		$scope.gridItemData = {};
		$scope.deviceAlarm = {};
		$scope.selectData = {};
		EmptyInput($scope.query);
		var cacheQuery = {};
		$scope.showLoading = false;
		$scope.isDeviceID = false;
		
		$scope.isActive = true;
		$scope.isShow = false;
		
		var field = {
			'deviceName' : '告警设备编号',
			'fullPath' : '域组信息',
			'cause' : '告警原因',
			'timestamp' : '告警时间'
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
		
		$scope.groupName = function(scope){
        	var data = $scope.query.domainGroup * 1;
        	if(data == 0){
        		$scope.isDeviceID = false;
        		return;
        	}else{
        		$scope.isDeviceID = true;     		
        		HttpService.get('rest/device/efence/get',{type:'efence',group:data}).then(function success(resp){
        			resp.splice(0,0,{deviceID:"全部"})
					$scope.deviceID = resp;
					$scope.query.deviceID = '全部';
				});
        	}
        }
		
		var toogle = document.getElementsByClassName('sidebar-toggle')[0];		
		
		toogle.onclick = function(){			
			var winWid = window.outerWidth;
			var sidebarWid = $(".main-sidebar").width();
			if(winWid <= 1280){
				if(sidebarWid = 230){
					$scope.isShow = !$scope.isShow;
				}
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

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			$scope.showLoading = true;
			var filter={page_size:pageSize,page_no:currentPage,order_by:['-timestamp']};
            if($scope.query){
            	filter.query = angular.copy(cacheQuery);
            	if($scope.query.cause == "全部"){
            		delete filter.query.cause;
            	}
            	if($scope.query.deviceName == '全部'){
            		delete filter.query.deviceName;
            	}           	
            	if(filter.query.timestamp__ge){
            		filter.query.timestamp__ge = DateFormat(filter.query.timestamp__ge);
            	}
            	if(filter.query.timestamp__lt){
            		filter.query.timestamp__lt = DateFormat(filter.query.timestamp__lt);
            	}
            }
            var result = HttpService.post('rest/alarm/device/search',filter);
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
				templateUrl: 'warning/templates/warning_device_form.html',
				controller: 'WarningDeviceEditCtrl',
				inputs: {
					title: '添加意见',
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
							HttpService.remove('rest/alarm/device/delete', {id: ids}).then(function success(data) {
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
				title: "设备告警-"+times,
			    fields: field,
			    fileName: "WarningDevicePageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: $scope.query
			    }			    
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	if($scope.query.cause == "全部"){
            		delete filter.pager.query.cause;
            	}
            	if($scope.query.deviceName == '全部'){
            		delete filter.pager.query.deviceName;
            	}           	
            	if(filter.pager.query.timestamp__ge){
            		filter.pager.query.timestamp__ge = DateFormat(filter.pager.query.timestamp__ge);
            	}
            	if(filter.pager.query.timestamp__lt){
            		filter.pager.query.timestamp__lt = DateFormat(filter.pager.query.timestamp__lt);
            	}
            }
			HttpService.post('rest/alarm/device/export',filter).then(function success(resp) {
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
			columnDefs: [
			{ field: 'deviceName',displayName: '告警设备编号',enableSorting:false,enableColumnMenu:false },
			{ field: 'fullPath',displayName: '域组信息',enableSorting:false,enableColumnMenu:false },
	        { field: 'cause',displayName: '告警原因',enableSorting:false,enableColumnMenu:false },
	        { field: 'timestamp',displayName: '告警时间',enableHiding:false,enableSorting:false,enableColumnMenu: false }
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
				}]

		});

		$scope.search = function() {
			cacheQuery = angular.copy($scope.query);
			delEmptyInput($scope.query);
			GridService.refresh($scope);
		};

	}
});