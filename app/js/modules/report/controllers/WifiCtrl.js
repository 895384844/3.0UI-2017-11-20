define(function () {
	return ['$scope', 'HttpService', 'AlertService', 'GridService', 'ModalService','DialogService',WifiCtrl];

	function WifiCtrl($scope, HttpService, AlertService,GridService,ModalService,DialogService) {
		$scope.getPagingList=function(currentPage, pageSize,sort){
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.search){
                angular.extend(filter,$scope.search);
            }
            if(!!sort){
            	//filter.sort=sort;
            }
           return HttpService.post('system/user/get',filter);
   		};
		var add = function () {
				ModalService.showModal({
                    templateUrl: 'base/templates/backlist_alarm_notify_policy_form.html',
                    controller: 'BacklistAlarmNotifyPolicyFormCtrl',
                    inputs:{
                        title:'新增转发管理',
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
		        if( selection == null || selection.length != 1){
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
		                        ids.push(selection[i].id);
		                    }
		                    HttpService.remove('users/',{ids:ids}).then(function success(data){
		                        GridService.refresh($scope);
		                    },
		                    function failure(errorResponse){
		                        
		                    })
		                    .finally(function(){

		                    });
		                }, null);
		        }
	    	};
	    	var exports = function(){
		        var obj = {
		            terminalName : $scope.target.name,
		            terminalIMEI : $scope.target.imei,
		            terminalIMSI : $scope.target.imsi,
		            dispatcherId : $scope.target.id
		        };
		        document.location.href = gridServices.exportAction('/query/TerminalPeopleRelationAction!exportExcel.action',obj);
		    };
		    var downLoad = function(){
		        $http.get('/system/downloadAction!listFileName.action').then(function(resp){
					if(resp.data){
		                ModalService.showModal({
			                templateUrl: 'modals/downLoad.html',
			                controller: 'downLoadCtrlTargetAlarm',
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
			};
			var edit = function () {
				var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection == null || selection.length != 1){
		            DialogService.showConfirm(
		                '提示',
		                '请选择一条进行操作！',null)
					return;
		        }else{
					ModalService.showModal({
	                    templateUrl: 'base/templates/backlist_alarm_notify_policy_edit.html',
	                    controller: 'BlacklistAlarmNotifyPolicyEditCtrl',
	                    inputs:{
	                        title:'修改转发人员',
	                        userInfo:{}
	                    }
	                }).then(function(modal) {
	                    modal.close.then(function(result) {
	                           GridService.refresh($scope);
	                    });
	                });
	           }
			};
			/*var edit = function(){
		        if( $scope.rows == null || $scope.rows.length != 1){
		            alert('请选择其中一条处理！');
		        }else{
		            ModalService.showModal({
		                templateUrl: 'base/templates/blacklist_alarm_notify_policy_edit.html',
		                controller: 'BlacklistAlarmNotifyPolicyEditCtrl',
		                inputs: { 
		                    row: $scope.row
		                }
		            }).then(function(modal) {
		                modal.element.modal();
		                modal.close.then(function(result) {
		                    $scope.promise = gridServices.promiseNew('/query/TerminalPeopleRelationAction!getDispatchPage.action',{
		                        page: $scope.newPage ? $scope.newPage : 1,
		                        rows: 20,
		                        sort : 'id',
		                        order: 'desc'
		                    });
		                    $scope.getPage($scope.promise);
		                });
		            });
		        }
		    };*/
		
		GridService.create($scope,{
				fetchData:true,
				columnDefs:[
			        { field: 'name',displayName: '目标名称',maxWidth:400,minWidth:200 },
			        { field: 'imei',displayName: 'IMEI',maxWidth:400,minWidth:200 },
			        { field: 'imsi',displayName: 'IMSI',maxWidth:400,minWidth:200 },
			        { field: 'peopleName',displayName: '转发人姓名',maxWidth:400,minWidth:200 },
			        { field: 'contactTel',displayName: '转发人电话',maxWidth:400,minWidth:200 }
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
		
	}
})