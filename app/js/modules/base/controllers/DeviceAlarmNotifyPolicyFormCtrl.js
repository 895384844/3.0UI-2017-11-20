define(
	function() {
		return ['$scope', 'HttpService', 'SystemService', 'title', 'userInfo', 'close', 'GridService', 'GridServices','$timeout',DeviceAlarmNotifyPolicyFormCtrl];

		function DeviceAlarmNotifyPolicyFormCtrl($scope, HttpService, SystemService, title, userInfo, close, GridService,GridServices,$timeout) {

			$scope.userInfo = angular.copy(userInfo);
			$scope.title = title;
			$scope.forward = {};
			$scope.close = close;
			$scope.device = {};
			$scope.people = {};

			$scope.reset = function() {
				$scope.userInfo = angular.copy(userInfo);
			};

			$scope.selDevice = {
				show: false
			};
			$scope.selPeople = {
				show: false
			};
			
			
			$scope.save = function(){
				SystemService.saveOrUpdateUser('rest/surveillance/devicepolicy/save',$scope.forward).then(function success(data){
					close();
				})
			};

			$scope.deviceShow = function() {
				$scope.selDevice.show = true;
				$scope.selPeople.show = false;
				$scope.getPagingList=function(currentPage, pageSize,sort){
		            var filter={page_size:pageSize,page_no:currentPage,order_by:['domainGroup']};
		            filter.query = {};
		            if($scope.device.deviceID__contains){
		            	filter.query.deviceID__contains = $scope.device.deviceID__contains;
		            }
		            return HttpService.post('rest/device/efence/search',filter);
		   		};
		   		GridService.create($scope, {
					fetchData: true,
					columnDefs: [
			            { field: 'deviceID',displayName: '设备编号',enableSorting:false,enableColumnMenu:false},
			            { field: 'fullPath',displayName: '域组信息',enableSorting:false,enableColumnMenu:false}
					]
				});
				$scope.gridOptions.multiSelect = false;
				$scope.gridOptions.additionalAction = function(gridApi) {
					gridApi.selection.on.rowSelectionChanged($scope,function(){
			            var selection = $scope.gridApi.selection.getSelectedRows();
			            $scope.deviceName = selection[0].deviceID;
			            $scope.forward.deviceId = selection[0].id;
			        });
				}
				$scope.searchDevice = function(){
					GridService.refresh($scope);
				}
			};
			$scope.peopleShow = function() {
				$scope.selDevice.show = false;
				$scope.selPeople.show = true;
				$scope.getPagingList=function(currentPage, pageSize,sort){
		            var filter={page_size:pageSize,page_no:currentPage,order_by:['type']};
		            filter.query = {};
		            if($scope.people){
		            	filter.query = $scope.people;
		            	if(filter.query.name == ''){
		            		delete filter.query.name;
		            	}
		            	if(filter.query.phone == ''){
		            		delete filter.query.phone;
		            	}
		            	if(filter.query.phone){
		            		filter.query.phone = String(filter.query.phone);
		            	}
		            }
		            return HttpService.post('rest/surveillance/staff/search',filter);
		       	}
			   		GridServices.create($scope,{
						fetchData:true,
						columnDefs:[
					        { field: 'name',displayName: '人员名称',enableSorting:false,enableColumnMenu:false},
					        { field: 'phone',displayName: '电话号码',enableSorting: false,enableHiding: false,enableColumnMenu: false}
					    ]
					});
					$scope.gridOption.multiSelect = false;
					$scope.gridOption.additionalAction = function(gridApi) {
						gridApi.selection.on.rowSelectionChanged($scope,function(){
				            var selection = $scope.gridApi.selection.getSelectedRows();
				            $scope.peopleNames = selection[0].name;
				            $scope.forward.peopleId = selection[0].id;
				        });
					}
					$scope.searchPeople = function(){
						GridServices.refresh($scope);
					}
				}								
			};
			
			

	});