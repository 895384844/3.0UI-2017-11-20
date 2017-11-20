define(function () {
	return ['$scope', 'HttpService', 'AlertService','GridService','DialogService', 'ModalService','delEmptyInput','EmptyInput','delEmptyInput',BusUserCtrl];

	function BusUserCtrl($scope, HttpService, AlertService,GridService,DialogService,ModalService,delEmptyInput,EmptyInput,delEmptyInput) {
		$scope.query = {};
		EmptyInput($scope.query);
		$scope.isActive = true;
		$scope.isShow = true;
		
		var type = {
				1 : '公安干警',
				2 : '设备管理人员'
			}
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		
		$scope.getPagingList=function(currentPage, pageSize,sort){
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.query = $scope.query;
            	filter.order_by = ['type'];
            	if(filter.query.phone){
            		filter.query.phone = String(filter.query.phone);
            	}
            }
            var result = HttpService.post('rest/surveillance/staff/search',filter);
            result.then(function success(data){
           		var list = data.items;
           		for(var i=0; i<list.length; i++){
           			list[i].type = type[list[i].type];
           		}	
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
		            DialogService.showConfirm(
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
	            DialogService.showConfirm(
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

		GridService.create($scope,{
				fetchData:true,
				columnDefs:[
			        { field: 'name',displayName: '人员名称',enableSorting:false,enableColumnMenu:false },
			        { field: 'phone',displayName: '电话号码',enableSorting:false,enableColumnMenu:false }
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