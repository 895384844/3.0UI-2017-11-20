define(function () {
	return ['$scope', 'HttpService', 'AlertService', 'GridService', 'ModalService','DialogService','EmptyInput','delEmptyInput',BacklistAlarmNotifyPolicyCtrl];

	function BacklistAlarmNotifyPolicyCtrl($scope, HttpService, AlertService,GridService,ModalService,DialogService,EmptyInput,delEmptyInput) {
		$scope.query = {};
		$scope.isActive = true;
		$scope.isShow = true;
		EmptyInput($scope.query);
		
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
		
		var person = {
			page_size: 500,
		    page_no: 1,
		    query:{},
		    order_by: ["type"]
		};
		HttpService.post('rest/surveillance/staff/search',person).then(function success(resp){
			$scope.person = resp.items;
			$scope.query.peopleId = '0';
		})
		
		$scope.getPagingList=function(currentPage, pageSize,sort){
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.mapQuery = angular.copy($scope.query);
            	if(filter.mapQuery.imsi){
            		filter.mapQuery.imsi = String(filter.mapQuery.imsi);
            	}
            	if(filter.mapQuery.imei){
            		filter.mapQuery.imei = String(filter.mapQuery.imei);
            	}
            	if(filter.mapQuery.peopleId == '0'){
            		delete filter.mapQuery.peopleId;
            	}
            }
            var result = HttpService.post('rest/surveillance/targetpolicy/search',filter);
            result.then(function success(resp){           		
           		if(resp.count == 0){
           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		            return;
           		}else{
           			var list = resp.items;
	           		for(var i=0; i<list.length; i++){
	           			list[i].name = list[i].terminal.name;
	           			list[i].imei = list[i].terminal.imei;
	           			list[i].imsi = list[i].terminal.imsi;
	           			list[i].peopleName = list[i].people.name;
	           			list[i].phone = list[i].people.phone;
	           		}
           		}
            })
            return result;
   		};
		
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
   		
		var add = function () {
				ModalService.showModal({
                    templateUrl: 'base/templates/backlist_alarm_notify_policy_form.html',
                    controller: 'BacklistAlarmNotifyPolicyFormCtrl',
                    inputs:{
                        title:'新增转发管理',
                        forward:{}
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
		                    HttpService.get('rest/surveillance/targetpolicy/delete',{id:ids}).then(function success(data){
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
                selection=$scope.gridApi.selection.getSelectedRows();
                var rid = selection[0];
				ModalService.showModal({
                    templateUrl: 'base/templates/blacklist_alarm_notify_policy_edit.html',
                    controller: 'BlacklistAlarmNotifyPolicyEditCtrl',
                    inputs:{
                        title:'修改转发人员',
                        forward:rid
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
		        { field: 'name',displayName: '目标名称',enableSorting:false,enableHiding:false,enableColumnMenu:false },
		        { field: 'imei',displayName: 'IMEI',enableSorting:false,enableColumnMenu:false},
		        { field: 'imsi',displayName: 'IMSI',enableSorting:false,enableColumnMenu:false },
		        { field: 'peopleName',displayName: '转发人姓名',enableSorting:false,enableColumnMenu:false },
		        { field: 'phone',displayName: '转发人电话',enableSorting:false,enableColumnMenu:false }
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