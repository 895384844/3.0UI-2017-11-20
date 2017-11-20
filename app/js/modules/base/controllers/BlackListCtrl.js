define(function () {
	return ['$scope', 'HttpService', 'AlertService', 'GridService','DialogService','ModalService', 'EmptyInput','delEmptyInput',BlackListCtrl];

	function BlackListCtrl($scope, HttpService, AlertService,GridService,DialogService,ModalService,EmptyInput,delEmptyInput) {
		
		$scope.query = {};
		EmptyInput($scope.query);
		$scope.isActive = true;
		$scope.isShow = true;
		
		$scope.getPagingList=function(currentPage, pageSize,sort){
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	if($scope.query.imsi){
            		$scope.query.imsi = String($scope.query.imsi);
            	}
            	if($scope.query.imei){
            		$scope.query.imei = String($scope.query.imei);
            	}
            	filter.query = angular.copy($scope.query);
            }
           return HttpService.post('rest/surveillance/efence/search',filter);
   		};
   		
		var add = function () {
				ModalService.showModal({
                    templateUrl: 'base/templates/black_list_form.html',
                    controller: 'BlackListFormCtrl',
                    inputs:{
                        title:'新建黑名单',
                        addBlacklist:{}
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                           GridService.refresh($scope);
                    });
                });
			};
		var remove=function(){
			var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection.length <= 0){
		            DialogService.showConfirm(
		                '提示',
		                '请至少选择一条进行操作！',null)
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
	                    HttpService.get('rest/surveillance/efence/delete',{id:ids}).then(function success(data){
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
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
		        	var rid = selection[0];
					ModalService.showModal({
	                    templateUrl: 'base/templates/black_list_edit.html',
	                    controller: 'BlacklistEditCtrl',
	                    inputs:{
	                        title:'编辑黑名单',
	                        addBlacklist:rid
	                    }
	                }).then(function(modal) {
	                    modal.close.then(function(result) {
	                           GridService.refresh($scope);
	                    });
	                });
	           }
			};

		GridService.create($scope,{
				fetchData:true,
				columnDefs:[
			        { field: 'name', displayName: '姓名',maxWidth:600,minWidth:200,enableSorting:false,enableColumnMenu:false },
			        { field: 'imei', displayName: 'IMEI',maxWidth:600,minWidth:200,enableSorting:false,enableColumnMenu:false },
			        { field: 'imsi', displayName: 'IMSI',maxWidth:600,minWidth:200,enableSorting:false,enableColumnMenu:false }
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
				    	css:'fa fa-fw fa-pencil',
				    	tooltip:'编辑',
				    	method:edit
				    },
			    	{
				    	css:'fa fa-fw fa-minus-circle',
				    	tooltip:'删除',
				    	method:remove
			    	},
			    	{
				    	css:'fa fa-fw fa-share-square-o',
				    	tooltip:'导出',
				    	method:remove
			    	},
			    	{
				    	css:'fa fa-fw fa-download',
				    	tooltip:'下载',
				    	method:remove
			    	}
			    ]
		});	
		$scope.search = function() {
			delEmptyInput($scope.query);			
			GridService.refresh($scope);
		};
	}
})