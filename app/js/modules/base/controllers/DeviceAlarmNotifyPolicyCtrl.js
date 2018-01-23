define(function () {
	return ['$scope', 'HttpService', 'AlertService','DialogService', 'ModalService','EmptyInput','delEmptyInput',DeviceAlarmNotifyPolicyCtrl];

	function DeviceAlarmNotifyPolicyCtrl($scope, HttpService, AlertService,DialogService,ModalService,EmptyInput,delEmptyInput) {
		$scope.query = {};
		$scope.isActive = true;
		$scope.isShow = true;
		var cacheQuery = {};
		$scope.showLoading = false;
		$scope.pageSize = '10';
		$scope.pageNo = 1;
		$scope.count = 0;
		
		EmptyInput($scope.query);
		
		$scope.getData = function(){
			$scope.showLoading = true;
			var filter = {
				page_size: $scope.pageSize*1,
				page_no: $scope.pageNo
			};
			filter.query = cacheQuery;
			var result = HttpService.post('rest/surveillance/devicepolicy/search',filter);
			result.then(function success(resp){
				$scope.showLoading = false;
				$scope.gridData = resp.items;
				
			})
			return result;
		}
		
		$scope.getData();
		
		/*$scope.getPagingList=function(currentPage, pageSize,sort){
			$scope.showLoading = true;
            var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.mapQuery = angular.copy(cacheQuery);
            }
            var result = HttpService.post('rest/surveillance/devicepolicy/search',filter);
            result.then(function success(resp){
            	$scope.showLoading = false;
           		var list = resp.items;
           		for(var i=0; i<list.length; i++){
           			list[i].number = list[i].device.deviceID;
           			list[i].peopleName = list[i].people.name;
           			list[i].phone = list[i].people.phone;
           		}          		
            },function error(err){
            	$scope.showLoading = false;
            })
            return result;
   		};
*/
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
                        $scope.getData();
                    });
                });
			};
		var remove=function(){
			var selection = $scope.gridApi.selection.getSelectedRows();
		        if( selection == null || selection.length < 1){
		            DialogService.showMessage(
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
		                        $scope.getData();
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
	                        $scope.getData();
	                    });
	                });
	           }
			};
		
		$scope.search = function() {
			delEmptyInput($scope.query);
			cacheQuery = angular.copy($scope.query);
			$scope.getData();
		};
	}
})