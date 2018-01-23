define(['moment'], function(moment) {
	return ['$scope', '$http', 'AlertService', 'HttpService', 'GridService', 'DialogService', 'ModalService', 'EmptyInput', 'delEmptyInput', VehicleListCtrl];

	function VehicleListCtrl($scope, $http, AlertService, HttpService, GridService, DialogService, ModalService, EmptyInput, delEmptyInput) {
		$scope.query = {};
		$scope.isActive = true;
		$scope.isShow = false;
		$scope.showLoading = false;
		EmptyInput($scope.query);
		var green = "'btnGreen'";
   		var gray = "'btnGray'";		
		var str = "'hidden'";
		var domain = 'all';
		
		var cacheQuery = {};
		
		var gettree = {};
		gettree.adCode = '00';
		
		var field = {
			'deviceID' : '设备编号',
			'fullPath' : '域组信息',		
			'lastUpdate' : '最后一次上号时间',
			'lane' : '车道号',
			'online' : '设备状态',
			'ip' : 'IP地址'
		};
		
		HttpService.get('rest/system/domain/getgrouptree',gettree).then(function success(resp){
	    	$scope.data = [];
	    	$scope.data.splice(0,0,{adCode: "all",name: "全部",isdefault:true});
	    	$scope.data.splice(1,0,{adCode: "0",name: "游离设备"}); 
	    	$scope.data.push(resp);
	    })
		
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
		
		var exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "摄像头设备-"+times,
			    fields: field,
			    fileName: "VehiclelistPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: $scope.query
			    }			    
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	if(domain != 'all'){
            		filter.pager.query.domainGroup = domain;
            	}
            	if(filter.pager.query.domainGroup == 'all' || !filter.pager.query.domainGroup){
            		delete filter.pager.query.domainGroup;
            	}
            }
			HttpService.post('rest/device/vehicle/export',filter).then(function success(resp) {
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
		
		$scope.getList = function(scope){			
			$('.tree-node').removeClass('device-page-active');
			scope.$element.addClass('device-page-active')
			if(scope.$modelValue){
				domain = scope.$modelValue.adCode;
			}else{
				domain = scope;
			}
			GridService.refresh($scope);
		}
		
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
		$scope.getPagingList=function(currentPage, pageSize,sort){
			$scope.showLoading = true;
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.query = angular.copy(cacheQuery);
            	if(filter.query.domainGroup == 'all' || !filter.query.domainGroup){
            		delete filter.query.domainGroup;
            	}
            	if(domain != 'all'){
            		filter.query.domainGroup = domain;
            	}
            }
            var result = HttpService.post('rest/device/vehicle/search',filter);
            result.then(function success(resp){  
            	$scope.showLoading = false;           	
            },function error(err){
            	$scope.showLoading = false;
            })
           return result;
   		};

		var add = function() {
			ModalService.showModal({
				templateUrl: 'device/templates/vehicle_list_form.html',
				controller: 'VehicleListFormCtrl',
				inputs: {
					title: '新建设备',
					device: {}
				}
			}).then(function(modal) {
				modal.close.then(function(result) {
					GridService.refresh($scope);
				});
			});
		};
		
		var move = function(){
			var selection = $scope.gridApi.selection.getSelectedRows();
			if(selection.length <= 0){
				DialogService.showMessage(
					'提示',
					'至少选择一条进行操作!',null)
				return;
			}else{
				ids = [];
				selection = $scope.gridApi.selection.getSelectedRows();
				for(var i in selection) {
					ids.push(selection[i].deviceID);
				}
				ModalService.showModal({
		            templateUrl: 'device/templates/device_move.html',
		            controller: 'VehicleMoveCtrl',
		            inputs: { 
		                row : ids
		            }
		        }).then(function(modal) {
		            //modal.element.modal();
		            modal.close.then(function() { 
		            	GridService.refresh($scope);
		            });
		        });
			}
		};
		
		var edit = function () {
    		var selection = $scope.gridApi.selection.getSelectedRows();
	        if( selection == null || selection.length != 1){
	            DialogService.showMessage(
	                '提示',
	                '请选择一条进行操作！',null)
				return;
	        }else{
	        	var rid = selection[0];
				ModalService.showModal({
		            templateUrl: 'device/templates/vehicle_list_edit.html',
		            controller: 'VehicleListEditCtrl',
		            inputs: { 
		                row : rid
		            }
		        }).then(function(modal) {
		            modal.close.then(function() { 
		            	GridService.refresh($scope);
		            });
		        });
           }
		};

		var remove = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
				if (selection.length <= 0) {
					DialogService.showMessage(
		                '提示',
		                '请至少选择一条进行操作！',null)
					return;
				}else{
					ids=[];
                    selection=$scope.gridApi.selection.getSelectedRows();
                    for (var i in selection){
                        ids.push(selection[i].id);
                    }
					ModalService.showModal({
	                    templateUrl: 'device/templates/device_delete.html',
	                    controller: 'VehicleDeleteCtrl',
	                    inputs:{
	                        title:'删除设备',
	                        parentID:ids
	                    }
	                }).then(function(modal) {
	                    modal.close.then(function(result) {
	                        GridService.refresh($scope)
	                    });
	                });
				}
			};
		
		var imports = function(){
	        ModalService.showModal({
	            templateUrl: 'device/templates/device_import.html',
	            controller: 'VehicleImportCtrl'
	        }).then(function(modal) {
				modal.close.then(function(result) {
					GridService.refresh($scope);
				});
	    	})
	    };
		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
		        { field: 'deviceID',displayName: '设备编号',enableSorting:false,enableHiding:false,enableColumnMenu:false },
		        { field: 'fullPath',displayName: '域组信息',enableSorting:false,enableColumnMenu:false },		        
		        { field: 'lastUpdate',displayName: '最后一次上号时间',enableHiding:false ,enableSorting:false,enableColumnMenu:false},
		        { field: 'lane',displayName: '车道号',enableSorting:false,enableColumnMenu:false },
		        { 
		            field: 'online',
		            displayName: '设备状态', 
		            enableHiding:false,enableSorting:false,enableColumnMenu:false,
		            cellTemplate: '<span class="btnIcon" ng-class="{ ' + gray + ' : !row.entity.online,' + green + ': row.entity.online}"></span>'
		        },
		        { field: 'ip',displayName: 'IP地址',enableSorting:false,enableColumnMenu:false }       
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
				{
					//css: 'fa fa-fw fa-plus-circle',
					src : 'images/add.png',
					tooltip: '添加',
					method: add
				},
				{
					//css: 'fa fa-fw fa-plus-circle',
					src : 'images/edit.png',
					tooltip: '编辑',
					method: edit
				},
				{
					//css: 'fa fa-fw fa-arrow-circle-down',
					src : 'images/imports.png',
					tooltip: '批量导入',
					method: imports
				},
				{
					//css: 'fa fa-fw fa-minus-circle',
					src : 'images/remove.png',
					tooltip: '删除',
					method: remove
				},				
				{
					//css: 'fa fa-fw fa-share-square-o',
					src : 'images/exports.png',
					tooltip: '导出',
					method: exports
				},
				{
					//css: 'fa fa-fw fa-share-square-o',
					src : 'images/move_small.png',
					tooltip: '移动',
					method: move
				},
				{
					//css: 'fa fa-fw fa-download',
					src : 'images/download.png',
					tooltip: '批量导入模板下载',
					method: function(){
						var anchor = angular.element('<a/>');
				        anchor.attr({
				            href: 'docs/车牌采集设备列表批量导入模板.xlsx',
				            target: '_blank'
				        })[0].click();
					}
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
