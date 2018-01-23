/**
 * Created by zhaoyang on 16/7/25.
 */
define(['moment'], function(moment) {
	return ['$scope', '$http', 'AlertService', 'HttpService', 'GridService', 'DialogService', 'ModalService', 'EmptyInput', 'delEmptyInput', DeviceListCtrl];

	function DeviceListCtrl($scope, $http, AlertService, HttpService, GridService, DialogService, ModalService, EmptyInput, delEmptyInput) {
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
			'online' : '设备心跳状态',
			'btsStatus' : 'BTS在线状态',
			'lastUpdate' : '最后一次上号时间',
			'network' : '设备网络制式'
		};
		
		HttpService.get('rest/system/domain/getgrouptree',gettree).then(function success(resp){
	    	$scope.data = [];
	    	$scope.data.splice(0,0,{adCode: "all",name: "全部",isdefault:true});
	    	$scope.data.splice(1,0,{adCode: "0",name: "游离设备"}); 
	    	$scope.data.push(resp);
	    })
		
		var network = {
			0 : 'GSM',
			1 : 'CDMA',
			2 : 'W-CDMA',
			3 : 'TD-SCDMA',
			4 : 'FDD-LTE',
			5 : 'TDD-LTE',
			6 : 'WIFI'			
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
		
		var exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "手机热点采集设备-"+times,
			    fields: field,
			    fileName: "DevicelistPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: $scope.query
			    }			    
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	if(filter.pager.query.network == 'all' || !filter.pager.query.network){
            		delete filter.pager.query.network;
            	}else{
            		filter.pager.query.network = filter.pager.query.network*1;
            	};
            	if(domain != 'all'){
            		filter.pager.query.domainGroup = domain;
            	}
            }
			HttpService.post('rest/device/efence/export',filter).then(function success(resp) {
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
            	if(filter.query.network == 'all' || !filter.query.network){
            		delete filter.query.network;
            	}else{
            		filter.query.network = filter.query.network*1;
            	};
            	if(domain != 'all'){
            		filter.query.domainGroup = domain;
            	}
            }
            var result = HttpService.post('rest/device/efence/search',filter);
            result.then(function success(resp){  
            	$scope.showLoading = false;
           		var list = resp.items;
           		for(var i=0; i<list.length; i++){
       				list[i].network = network[list[i].network];
       				if(list[i].port && list[i].ip){
       					list[i].ip = list[i].ip + ':' +list[i].port;
       				};
       				if(list[i].port && !list[i].ip){
       					list[i].ip = list[i].port;
       				};
       				if(list[i].ip && !list[i].port){
       					list[i].ip = list[i].ip;
       				}
           		}	           	
            },function error(err){
            	$scope.showLoading = false;
            })
           return result;
   		};

		var add = function() {
			ModalService.showModal({
				templateUrl: 'device/templates/device_list_form.html',
				controller: 'DeviceListFormCtrl',
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
		
		$scope.move = function(){
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
		            controller: 'DeviceMoveCtrl',
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
		            templateUrl: 'device/templates/device_list_edit.html',
		            controller: 'DeviceListEditCtrl',
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

		$scope.creatTask = function(typeId,type){
			var selection = $scope.gridApi.selection.getSelectedRows();
				if (selection.length != 1) {
					DialogService.showMessage(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
				}else{	
				    if(typeId==6){
				    	if(selection[0].network == 'WIFI'){
				    		DialogService.showMessage(
				                '提示',
				                'WIFI设备不支持此操作！',null)
							return;
				    	}else{
					    	$scope.showLoading = true;
						    var filter = {
						    	method : typeId,
						    	deviceID : selection[0].deviceID,
						    	body : {
						    		deviceID : selection[0].deviceID,
						    		type : type*1
						    	}
						    };	    
						    HttpService.post('rest/device/efence/get3diinfo',filter).then(function success(resp){
						    	$scope.showLoading = false;
						    	if(resp.msg == 'ok'){
						    		DialogService.showMessage(
					                '提示',
					                '设置成功！',null);
						    	}else{
						    		DialogService.showMessage(
					                '提示',
					                resp.msg,null);
						    	}
						    },function error(err){
						    	$scope.showLoading = false;
						    })
					    }
				    }
				}
		}
		
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
	                    controller: 'DeviceDeleteCtrl',
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
	            controller: 'DeviceImportCtrl'
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
		        { 
		            field: 'online',
		            displayName: '设备心跳状态', 
		            enableHiding:false,enableSorting:false,enableColumnMenu:false,
		            cellTemplate: '<span class="btnIcon" ng-class="{ ' + gray + ' : !row.entity.online,' + green + ': row.entity.online}"></span>'
		        },
		        { 
		            field: 'btsStatus',
		            displayName: 'BTS在线状态', 
		            enableHiding:false,enableSorting:false,enableColumnMenu:false,
		            cellTemplate: '<div ng-if="row.entity.btsStatus == -1" class="bts-status">N/A</div> <span ng-if="row.entity.btsStatus != -1" class="btnIcon" ng-class="{ ' + gray + ' : !row.entity.btsStatus,' + green + ': !!row.entity.btsStatus}"></span>'
		        },
		        { field: 'lastUpdate',displayName: '最后一次上号时间',enableHiding:false,enableSorting:false,enableColumnMenu:false },
		        { field: 'network',displayName: '设备网络制式',enableSorting:false,enableColumnMenu:false },
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
					//css: 'fa fa-fw fa-download',
					src : 'images/download.png',
					tooltip: '批量导入模板下载',
					method: function(){
						var anchor = angular.element('<a/>');
				        anchor.attr({
				            href: 'docs/设备列表批量导入模板.xlsx',
				            target: '_blank',
				            download: 'download'
				        })[0].click();
					}
				}
			]
		});
		
		$scope.set = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
			if( selection == null || selection.length != 1){
	            DialogService.showMessage(
	                '提示',
	                '请选择一条进行操作！',null)
				return;
	        }else{
	        	if(!selection[0].network){
	        		DialogService.showMessage(
		                '提示',
		                '未知网络制式，无法设置！',null)
					return;
	        	}else{
	        		if(selection[0].network == 'WIFI'){
			    		DialogService.showMessage(
			                '提示',
			                'WIFI设备不支持此操作！',null)
						return;
			    	}else{
						ModalService.showModal({
				            templateUrl: 'device/templates/device_list_set.html',
				            controller: 'DeviceSetCtrl',
				            inputs: { 
				                row : selection[0]
				            }
				        }).then(function(modal) {
				            modal.close.then(function() { 
				            	//GridService.refresh($scope);
				            });
				        });
				   }
		       }
		    }
		};
		$scope.search = function() {
			delEmptyInput($scope.query);
			cacheQuery = angular.copy($scope.query);
			GridService.refresh($scope);			
		};	
	}
});
