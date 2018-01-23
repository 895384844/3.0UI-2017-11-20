define(function () {
	return ['$scope', 'HttpService', 'AlertService','GridService','DialogService', 'ModalService','delEmptyInput','EmptyInput','delEmptyInput',BusUserCtrl];

	function BusUserCtrl($scope, HttpService, AlertService,GridService,DialogService,ModalService,delEmptyInput,EmptyInput,delEmptyInput) {
		$scope.query = {};
		EmptyInput($scope.query);
		$scope.isActive = true;
		$scope.isShow = true;
		var cacheQuery = {};
		$scope.showLoading = false;
		
		var type = {
				1 : '公安干警',
				2 : '设备管理人员'
			}
		
		var field = {
			'name' : '人员名称',
			'phone' : '电话号码'
		};
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		
		$scope.getPagingList=function(currentPage, pageSize,sort){
			$scope.showLoading = true;
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.query = angular.copy(cacheQuery);
            	filter.order_by = ['type'];
            	if(filter.query.phone){
            		filter.query.phone = String(filter.query.phone);
            	}
            }
            var result = HttpService.post('rest/surveillance/staff/search',filter);
            result.then(function success(data){  
            	$scope.showLoading = false;
           		var list = data.items;
           		for(var i=0; i<list.length; i++){
           			list[i].type = type[list[i].type];
           		}	           	
            },function error(err){
            	$scope.showLoading = false;
            })
            return result;
   		};
   		
		var add = function () {
				ModalService.showModal({
                    templateUrl: 'base/templates/bus_user_form.html',
                    controller: 'BusUserListCtrl',
                    inputs:{
                        title:'新建人员',
                        person:{}
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                           GridService.refresh($scope);
                    });
                });
			};
		var remove=function(){
			var selection = $scope.gridApi.selection.getSelectedRows();
		        if(selection.length <= 0){
		            DialogService.showMessage(
		                '提示',
		                '至少选择一条进行操作！',null)
					return;
		        }else{
		    		DialogService.showConfirm(
		                '确认信息',
						'确定要删除吗？',
		                function() {
		                    ids=[];
		                    selection=$scope.gridApi.selection.getSelectedRows();
		                    for (var i in selection){
		                        ids.push(selection[i].id);
		                    }
		                    HttpService.get('rest/surveillance/staff/delete',{id:ids}).then(function success(data){
		                        GridService.refresh($scope);
		                    },
		                    function failure(errorResponse){
		                        
		                    })
		                    .finally(function(){
		
		                    });
		                }, null);
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
	        	if(rid.type == "公安干警"){
						rid.type = "1";
					}else{
						rid.type = "2";
					}
				ModalService.showModal({
                    templateUrl: 'base/templates/bus_user_edit.html',
                    controller: 'BusUserEditCtrl',
                    inputs:{
                        title : '编辑人员',
                        person : rid
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                           GridService.refresh($scope);
                    });
                });
           }
		};
		
		var imports = function(){
	        ModalService.showModal({
	            templateUrl: 'device/templates/device_import.html',
	            controller: 'BusUserImportCtrl'
	        }).then(function(modal) {
				modal.close.then(function(result) {
					GridService.refresh($scope);
				});
	    	})
	    };

		var exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "通知人员-"+times,
			    fields: field,
			    fileName: "BusUserPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: $scope.query
			    }			    
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	if(filter.pager.query.phone){
            		filter.pager.query.phone = String(filter.pager.query.phone);
            	}
            }
			HttpService.post('rest/surveillance/staff/export',filter).then(function success(resp) {
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
		
		GridService.create($scope,{
				fetchData:true,
				columnDefs:[
			        { field: 'name',displayName: '人员名称',enableSorting:false,enableColumnMenu:false },
			        { field: 'phone',displayName: '电话号码',enableSorting:false,enableColumnMenu:false },
			        { field: 'periodStart',displayName: '接收开始时间',enableSorting:false,enableColumnMenu:false },
			        { field: 'periodEnd',displayName: '接收结束时间',enableSorting:false,enableColumnMenu:false },
			        { field: 'interval',displayName: '通知间隔',enableSorting:false,enableColumnMenu:false }
			        
			    ],
			    btnTools:[
			    	{
				    	//css:'fa fa-fw fa-refresh',
				    	src: 'images/refresh.png',
				    	tooltip:'刷新',
				    	method:function(){
				    		GridService.refresh($scope);
				    	}
			    	},
			    	{
				    	//css:'fa fa-fw fa-plus-circle',
				    	src: 'images/add.png',
				    	tooltip:'添加',
				    	method:add
				    },
			    	{
				    	//css:'fa fa-fw fa-pencil',
				    	src: 'images/edit.png',
				    	tooltip:'编辑',
				    	method:edit
				    },
			    	{
				    	//css:'fa fa-fw fa-minus-circle',
				    	src: 'images/remove.png',
				    	tooltip:'删除',
				    	method:remove
			    	},
			    	{
						//css: 'fa fa-fw fa-arrow-circle-down',
						src: 'images/imports.png',
						tooltip: '批量导入',
						method: imports
					},
			    	{
				    	//css:'fa fa-fw fa-share-square-o',
				    	src: 'images/exports.png',
				    	tooltip:'导出',
				    	method:exports
			    	},
			    	{
				    	//css:'fa fa-fw fa-download',
				    	src: 'images/download.png',
				    	tooltip:'批量导入模板下载',
				    	method: function(){
							var anchor = angular.element('<a/>');
					        anchor.attr({
					            href: 'docs/通知人员批量导入模板.xlsx',
					            target: '_blank'
					        })[0].click();
						}
			    	}
			    ]

			});
		$scope.search = function() {
			cacheQuery = angular.copy($scope.query);
			delEmptyInput($scope.query);			
			GridService.refresh($scope);
		};
	}
})