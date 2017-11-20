define(function () {
	return ['$scope', 'HttpService', 'AlertService', 'GridService','DialogService', 'ModalService','EmptyInput','delEmptyInput',DeviceAlarmNotifyPolicyCtrl];

	function DeviceAlarmNotifyPolicyCtrl($scope, HttpService, AlertService,GridService,DialogService,ModalService,EmptyInput,delEmptyInput) {
		$scope.query = {};
		$scope.isActive = true;
		$scope.isShow = true;
		
		EmptyInput($scope.query);
		
		$scope.getPagingList=function(currentPage, pageSize,sort){
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.mapQuery = angular.copy($scope.query);
            }
            if($scope.search){
                angular.extend(filter,$scope.search);
            }
            if(!!sort){
            	filter.order_by=sort;
            }
            var result = HttpService.post('rest/surveillance/devicepolicy/search',filter);
            result.then(function success(resp){
           		var list = resp.items;
           		for(var i=0; i<list.length; i++){
           			list[i].number = list[i].device.deviceID;
           			list[i].peopleName = list[i].people.name;
           			list[i].phone = list[i].people.phone;
           		}
           		if(resp.count == 0){
           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		            return;
           		}
            })
            return result;
   		};

		var add = function () {
				ModalService.showModal({
                    templateUrl: 'base/templates/device_alarm_notify_policy_form.html',
                    controller: 'DeviceAlarmNotifyPolicyFormCtrl',
                    inputs:{
                        title:'新增转发',
                        userInfo:{}
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                        GridService.refresh($scope);
                    });
                });
			};
		var remove=function(){
			var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection == null || selection.length < 1){
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
		                    HttpService.get('rest/surveillance/devicepolicy/delete',{id:ids}).then(function success(data){
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
		        	selection=$scope.gridApi.selection.getSelectedRows();
                	var rid = selection[0];
					ModalService.showModal({
	                    templateUrl: 'base/templates/device_alarm_notify_policy_edit.html',
	                    controller: 'DeviceAlarmNotifyPolicyEditCtrl',
	                    inputs:{
	                        title:'修改转发',
	                        userInfo:rid
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
			        { field: 'number',displayName: '设备编号',maxWidth:450,minWidth:200,enableSorting:false,enableColumnMenu:false },			       
			        { field: 'peopleName',displayName: '告警接收人',maxWidth:450,minWidth:200,enableSorting:false,enableColumnMenu:false },
			        { field: 'phone',displayName: '告警接收人电话' ,maxWidth:450,minWidth:200,enableSorting:false,enableColumnMenu:false}
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