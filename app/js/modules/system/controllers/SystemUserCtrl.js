define(
	function () {
		return ['$scope', 'i18nService','$lt',  '$filter', 'localSession', 'GridService','DialogService', 'ModalService', 'HttpService', 'SystemService', '$http','EmptyInput', 'delEmptyInput',SystemUserCtrl];
		function SystemUserCtrl($scope, i18nService,$lt, $filter, localSession, GridService,DialogService, ModalService, HttpService, SystemService,$http,EmptyInput,delEmptyInput) {


			$scope.gridItemData = {};
			$scope.query = {};
			$scope.selectData = {};
			
			EmptyInput($scope.query);
			
			var lock = {
				0 : '正常',
				1 : '锁定'
			}

			$scope.getPagingList = function(currentPage, pageSize, sort) {
				var filter={page_size:pageSize,page_no:currentPage};
	            if($scope.query){
	            	filter.query = angular.copy($scope.query);
	            }
	           var result =  HttpService.post('rest/system/user/search',filter);
	           result.then(function success(data){
	           		var list = data.items;
	           		for(var i=0; i<list.length; i++){
						list[i].locked = lock[list[i].locked];
						if(!list[i].pathList){
							
						}else if(list.length == 1){
							list[i].pathList = list[i].pathList.join('');
						}else{
							list[i].pathList = list[i].pathList.join(';');
						}
	           		}
	           })
	           return result;
			};

       		var remove=function(){
       			var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection.length == 0 || selection.length > 1){
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
		    		DialogService.showConfirm(
		                '确认信息',
						'确定要删除吗？',
		                function() {
		                    ids=[];
		                    selection=$scope.gridApi.selection.getSelectedRows();
		                    for (var i in selection){
		                    	if(selection[i].account == "admin"){		                    		
		                    		alert("该用户不可删除")
		                    	}else{
		                    		ids.push(selection[i].id);
		                    		HttpService.get('rest/system/user/delete',{id:ids}).then(function success(data){
				                        GridService.refresh($scope);
				                    },
				                    function failure(errorResponse){
				                        
				                    })
				                    .finally(function(){
		
				                    });
		                    	}		                        
		                    }		                    
		                }, null);
		            }
	    	};

	    	var add = function () {
				ModalService.showModal({
                    templateUrl: 'system/templates/user_form.html',
                    controller: 'SystemUserFormCtrl',
                    inputs:{
                        title:'新增用户',
                        user:{}
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                        GridService.refresh($scope);
                    });
                });
			};
			var edit = function () {
				var selection = $scope.gridApi.selection.getSelectedRows();
				if (selection.length <= 0 || selection.length >1) {
					DialogService.showConfirm(
		                '提示',
		                '请选择一条进行编辑！',null)
					return;
				}else{
					var rid = selection[0];
					ModalService.showModal({
	                    templateUrl: 'system/templates/edit.html',
	                    controller: 'SystemUserEditCtrl',
	                    inputs:{
	                        title:'编辑用户',
	                        user:rid
	                    }
	                }).then(function(modal){
	                	modal.close.then(function(result){
	                		GridService.refresh($scope);
	                	})
	                })
				}				
			};

		    
		    /*var export = function(){
		        if($scope.user.male == '男'){
		            $scope.user.male = 1;
		        }else if($scope.user.male == '女'){
		            $scope.user.male = 2;
		        }else{
		            $scope.user.male = '';
		        }
		
		        var obj = {
		            account: $scope.user.account, 
		            name : $scope.user.name,
		            male : $scope.user.male
		        };
		
		        document.location.href = gridServices.exportAction('/system/userAction!exportExcel.action',obj);
		
		    };
		    
		    var downLoad = function(){
		        $http.get('/system/downloadAction!listFileName.action').then(function(resp){
					if(resp.data){
		                ModalService.showModal({
			                templateUrl: 'system/templates/downLoad.html',
			                controller: 'SystemDownloadCtrl',
			                inputs: { 
			                    rows: resp.data 
			                }
			            }).then(function(modal) {
			                modal.element.modal();
			                modal.close.then(function(result) {
			                });
			            });
					}
				});
			};*/
		    
		    var unLock = function(){
		    	var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection != null && selection.length >0){
		            var ids = selection[0].id;
		            selection=$scope.gridApi.selection.getSelectedRows();		            
		            HttpService.post('rest/system/user/unlock',{id:ids}).then(function success(data){
		            	if(data.status == 0){
		            		DialogService.showConfirm(
				                '提示',
				                '解锁成功！',null)							
		            		GridService.refresh($scope);
		            		return;
		            	}else{
		            		DialogService.showConfirm(
				                '提示',
				                '解锁失败！',null)
		            		return;
		            	}                        
                    },
                    function failure(errorResponse){}).finally(function(){});
		        }else{
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }
		    };
			
			GridService.create($scope,{
				fetchData:true,
				columnDefs:[
					
			        { field: 'account',displayName: '用户名',enableSorting:false,enableColumnMenu:false },			        
			        { field: 'locked',displayName: '账号状态',enableSorting:false,enableColumnMenu:false },
			        { field: 'telNumber',displayName: '手机',enableSorting:false,enableColumnMenu:false },
			        { field: 'pathList',displayName: '管理域',enableSorting:false,enableColumnMenu:false }
			    ],
			    btnTools:[
			    	{
				    	css:'fa fa-fw fa-refresh',
				    	tooltip:'刷新',
				    	method:function(){
				    		GridService.refresh($scope);
				    	}
			    	},
			    	{
				    	css:'fa fa-fw fa-plus-circle',
				    	tooltip:'添加',
				    	method:add
				    },
			    	{
				    	css:'fa fa-fw fa-minus-circle',
				    	tooltip:'删除',
				    	method:remove
			    	},
			    	{
				    	css:'fa fa-fw fa-pencil',
				    	tooltip:'编辑',
				    	method:edit
			    	},
			    	/*{
				    	css:'fa fa-fw fa-repeat',
				    	tooltip:'重置密码',
				    	method:resetPsw
			    	},*/
			    	{
				    	css:'fa fa-fw fa-share-square-o',
				    	tooltip:'导出',
				    	method:add
			    	},
			    	{
				    	css:'fa fa-fw fa-download',
				    	tooltip:'下载',
				    	method:add
			    	},
			    	{
				    	css:'fa fa-fw fa-unlock-alt',
				    	tooltip:'解锁',
				    	method:unLock
			    	}
			    ]

			});
			
			$scope.setDomain = function(row){
				ModalService.showModal({
		            templateUrl: 'system/templates/user_set_domain.html',
		            controller: 'SystemUserSet',
		            inputs: { 
		            	row : row,
		                data : {}
		            }
		        }).then(function(modal) {
		            //modal.element.modal();
		            modal.close.then(function() { 
		            	GridService.refresh($scope);
		            });
		        });
			}

			$scope.search = function () {
				delEmptyInput($scope.query);
				GridService.refresh($scope);
			};
		}
	});
