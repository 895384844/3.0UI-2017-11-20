/**
 * Created by zhaoyang on 16/7/25.
 */
define(['moment'], function(moment) {
	return ['$scope', 'AlertService', 'HttpService', 'GridService', 'DialogService', 'ModalService', 'EmptyInput','delEmptyInput',DeviceListCtrl];

	function DeviceListCtrl($scope, AlertService, HttpService, GridService, DialogService, ModalService,EmptyInput,delEmptyInput) {
		$scope.query = {};
		$scope.isActive = true;
		$scope.isShow = false;
		EmptyInput($scope.query);
		var green = "'btnGreen'";
   		var gray = "'btnGray'";		
		var str = "'hidden'";
		var domain = 'all';
		
		
		var gettree = {};
		gettree.adCode = '00';
		
		HttpService.get('rest/system/domain/getgrouptree',gettree).then(function success(resp){
	    	$scope.data = [];
	    	$scope.data.splice(0,0,{adCode: "all",name: "全部",isdefault:true});
	    	$scope.data.splice(1,0,{adCode: "0",name: "游离设备"}); 
	    	$scope.data.push(resp);
	    })
		
		var network = {
			1 : 'CDMA',
			2 : 'W-CDMA',
			3 : 'TD-CDMA',
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
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.query = angular.copy($scope.query);
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
           		var list = resp.items;
           		for(var i=0; i<list.length; i++){
           			list[i].network = network[list[i].network];
           		}
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
		
		var edit =function(value){
			ModalService.showModal({
	            templateUrl: 'device/templates/device_list_set.html',
	            controller: 'DeviceListEditCtrl',
	            inputs: { 
	                row : value
	            }
	        }).then(function(modal) {
	            //modal.element.modal();
	            modal.close.then(function() { 
	            	GridService.refresh($scope);
	            });
	        });
		};

		var startCapture = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection == null || selection.length != 1){
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
					ModalService.showModal({
						templateUrl: 'device/templates/device_list_add_task_form.html',
						controller: 'DeviceListAddTaskFormCtrl',
						inputs: {
							title: '启动捕获程序',
							userInfo: {}
						}
					}).then(function(modal) {
						modal.close.then(function(result) {
							GridService.refresh($scope);
						});
					});
				}
		};

		var restartCapture = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
			if( selection == null || selection.length != 1){
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
					ModalService.showModal({
						templateUrl: 'device/templates/device_list_add_task_form.html',
						controller: 'RestartCaptureCtrl',
						inputs: {
							title: '重启捕获程序',
							userInfo: {}
						}
					}).then(function(modal) {
						modal.close.then(function(result) {
							GridService.refresh($scope);
						});
					});
				}
		};

		var closeCapture = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
			if( selection == null || selection.length != 1){
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
					ModalService.showModal({
						templateUrl: 'device/templates/device_list_add_task_form.html',
						controller: 'CloseCaptureCtrl',
						inputs: {
							title: '关闭捕获程序',
							userInfo: {}
						}
					}).then(function(modal) {
						modal.close.then(function(result) {
							GridService.refresh($scope);
						});
					});
				}
		};

		var catchPoint = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
			if( selection == null || selection.length != 1){
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
					ModalService.showModal({
						templateUrl: 'device/templates/device_list_add_task_form.html',
						controller: 'CatchPointCtrl',
						inputs: {
							title: '捕获近设备频点',
							userInfo: {}
						}
					}).then(function(modal) {
						modal.close.then(function(result) {
							GridService.refresh($scope);
						});
					});
				}
		};

		var sameClock = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
			if( selection == null || selection.length != 1){
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
					ModalService.showModal({
						templateUrl: 'device/templates/device_list_add_task_form.html',
						controller: 'SameClockCtrl',
						inputs: {
							title: '同步设备时钟',
							userInfo: {}
						}
					}).then(function(modal) {
						modal.close.then(function(result) {
							GridService.refresh($scope);
						});
					});
				}
		};

		var restartSystem = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
			if( selection == null || selection.length != 1){
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
					ModalService.showModal({
						templateUrl: 'device/templates/device_list_add_task_form.html',
						controller: 'RestartSystemCtrl',
						inputs: {
							title: '重启设备系统',
							userInfo: {}
						}
					}).then(function(modal) {
						modal.close.then(function(result) {
							GridService.refresh($scope);
						});
					});
				}
		};
		
		var move = function(){
			var selection = $scope.gridApi.selection.getSelectedRows();
			if(selection.length <= 0){
				DialogService.showConfirm(
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
		}

		var remove = function() {
			var selection = $scope.gridApi.selection.getSelectedRows();
				if (selection.length <= 0) {
					DialogService.showConfirm(
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
			});/*.then(function(modal) {
	            modal.element.modal();
	            modal.close.then(function() {
	                $scope.promise = gridServices.promiseDefault('/device/deviceAction!getScopeDevice.action');
	                $scope.getPage($scope.promise);
	            });*/
	        });
	    };

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
				{ 
		        	field: 'btnGroup',
		        	displayName: '设备操作',
		        	width:70,
		        	enableSorting : false,
		        	enableColumnMenu : false,
		        	cellTemplate: '<a class="fa fa-gear btn-edit" style="margin-left:15px;color:#31708f;" href ng-class="{ ' + str + ' : grid.appScope.isOpen(row.entity) }" ng-click="grid.appScope.set(row.entity)" uib-tooltip="设置" tooltip-placement="left"></a>'
		        },
		        { field: 'deviceID',displayName: '设备编号',enableSorting:false,enableHiding:false,enableColumnMenu:false },
		        { field: 'fullPath',displayName: '域组信息',enableSorting:false,enableColumnMenu:false }	,
		        { 
		            field: 'online',
		            displayName: '设备心跳状态', 
		            enableHiding:false,
		            cellTemplate: '<span class="btnIcon" ng-class="{ ' + gray + ' : !row.entity.isonLine,' + green + ': !!row.entity.isonLine}"></span>'
		        },
		        { 
		            field: 'btsStatus',
		            displayName: 'BTS在线状态', 
		            enableHiding:false,
		            cellTemplate: '<div ng-if="!row.entity.bts&&!row.entity.isonLine" class="bts-status">N/A</div> <span ng-if="!!row.entity.isonLine" class="btnIcon" ng-class="{ ' + gray + ' : !row.entity.bts,' + green + ': !!row.entity.bts}"></span>'
		        },
		        { field: 'lastUpdate',displayName: '最后一次上号时间',enableHiding:false },
		        { field: 'network',displayName: '设备网络制式',enableSorting:false,enableColumnMenu:false }	        
			],
			btnTools: [
				{
					css: 'fa fa-fw fa-refresh',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				},
				{
					css: 'fa fa-fw fa-plus-circle',
					tooltip: '添加',
					method: add
				},
				{
					css: 'fa fa-fw fa-arrow-circle-down',
					tooltip: '批量导入',
					method: imports
				},
				{
					css: 'fa fa-fw fa-minus-circle',
					tooltip: '删除',
					method: remove
				},
				{
					css: 'fa fa-fw fa-external-link-square',
					tooltip: '批量移动',
					method: move
				},
				{
					css: 'fa fa-fw fa-play-circle-o',
					tooltip: '启动捕获程序',
					//method: noWifiLte(0, 'StartCaptureCtrl')
					method: startCapture
				},
				{
					css: 'fa fa-fw fa-repeat',
					tooltip: '重启捕获程序',
					method: restartCapture
				},
				{
					css: 'fa fa-fw fa-times-circle-o',
					tooltip: '关闭捕获程序',
					method: closeCapture
				},
				{
					css: 'fa fa-fw fa-power-off',
					tooltip: '重启设备系统',
					method: restartSystem
				},
				{
					css: 'fa fa-fw fa-share-square-o',
					tooltip: '导出',
					method: edit
				},
				{
					css: 'fa fa-fw fa-download',
					tooltip: '批量导入模板下载',
					method: remove
				}
			]

		});
		
		$scope.doSearch = function() {
			$scope.gridapi.refresh();
		};

		$scope.edit = function(row) {
			ModalService.showModal({
	            templateUrl: 'device/templates/device_list_edit.html',
	            controller: 'DeviceListEditCtrl',
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
		
		$scope.set = function() {
			ModalService.showModal({
	            templateUrl: 'device/templates/device_list_set.html',
	            controller: 'DeviceListEditCtrl',
	            inputs: { 
	                row : ''
	            }
	        }).then(function(modal) {
	            //modal.element.modal();
	            modal.close.then(function() { 
	            	GridService.refresh($scope);
	            });
	        });
		};

		$scope.add = function() {
			openData();
		};

		$scope.delete = function() {
			if($scope.gridapi.getSelectedRows().length === 0) {
				return;
			}
			HttpService.post('device/info/delete', {
					ids: $scope.gridapi.getSelectedRows()
				})
				.then(function success() {
						AlertService.show('删除成功');
						$scope.gridapi.refresh();
					},
					function failure(errorResponse) {
						AlertService.show(errorResponse);
					});
		};

		var openData = function(id) {
			$mdDialog.show({
				controller: function($scope, $mdDialog, HttpService, AlertService, BaseService, SystemService, id) {
					$scope.data = {};
					if(id) {
						HttpService.post('device/info/get', {
								query: {
									id: id
								}
							})
							.then(function success(data) {
									$scope.data = data.items[0];
									$scope.data.upgrading = 1;
									console.dir($scope.data);
								},
								function failure(errorResponse) {
									AlertService.show(errorResponse);
								});
					} else {
						$scope.data = {
							upgrading: 0
						};
					}
					BaseService.getVendors().then(function(data) {
						$scope.vendors = data.items;
					});

					BaseService.getDevicetypes().then(function(data) {
						$scope.deviceTypes = data.items;
					});

					BaseService.getFirmwares().then(function(data) {
						$scope.firmwares = data.items;
					});

					SystemService.getScopes().then(function(data) {
						$scope.domains = data.items;
					});

					$scope.apply = function() {
						$scope.validate().then(function() {
							HttpService.post('device/info/save', $scope.data)
								.then(function success(data) {
										console.dir(data);
										AlertService.show('保存成功');
										$mdDialog.hide(true);
									},
									function failure(errorResponse) {
										AlertService.show(errorResponse);
									});
						});
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};
				},
				templateUrl: 'js/modules/device/templates/tpl.device.info.html',
				clickOutsideToClose: true,
				fullscreen: false,
				locals: {
					id: id
				}
			}).then(function(result) {
				if(result) {
					$scope.gridapi.refresh();
				}
			});
		};

		$scope.config = {
			colNames: ['ID', '在线状态', '小区状态', '管理域', 'PCI', 'CELLID', 'IP', '设备Key', '软件版本', '设备类型', '设备告警', '设备描述', '升级状态'],
			colModel: [{
					name: 'id',
					index: 'id',
					width: 100,
					sorttype: 'int'
				},
				{
					name: 'status',
					index: 'status',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'provision_status',
					index: 'provision_status',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'adminDomain.name',
					index: 'adminDomain.name',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'pci',
					index: 'pci',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'cellid',
					index: 'cellid',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'ip',
					index: 'ip',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'dkey',
					index: 'dkey',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'fwVersion',
					index: 'fwVersion',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'deviceType.name',
					index: 'deviceType.name',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'alarmCount',
					index: 'alarmCount',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'desc',
					index: 'desc',
					width: 100,
					sortable: true,
					align: 'center'
				},
				{
					name: 'upgrading',
					index: 'upgrading',
					width: 100,
					sortable: true,
					align: 'center'
				}
			],
			formatter: 'actions',
			formatoptions: {
				keys: true,
				editformbutton: true
			},
			uri: 'device/info/get'
		};

		$scope.export = function() {
			var filter = {
				"fields": [
					"name",
					"type",
					"description",
					"reportItems#id,name"
				]
			};
			HttpService.download('device/info/download', filter);
		};

		$scope.import = function() {
			$mdDialog.show({
				controller: function($scope, $mdDialog) {
					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.onFileSelect = function($file) {
						if(!$file) {
							return;
						}
						var file = $file;
						HttpService.upload('device/info/upload', {
							data: {
								fileName: $scope.file
							},
							file: file
						}).progress(function(evt) {
							$scope.isWaiting = true;
						}).success(function(data, status, headers, config) {
							$scope.license = data;
							if(!!data && data.status === -1) {
								$scope.showWarning = true;
								return;
							}
							$scope.showWarning = false;

						}).error(function(data, status, headers, config) {
							// console.info(data);
						}).finally(function() {
							$scope.isWaiting = false;
							$mdDialog.hide();
						});

					};
				},
				templateUrl: 'js/modules/device/templates/tpl.device.import.html',
				clickOutsideToClose: true,
				fullscreen: false
			}).then(function() {

			});
		};
		
		$scope.search = function() {
			GridService.refresh($scope);
			delEmptyInput($scope.query);
		};	
	}
});