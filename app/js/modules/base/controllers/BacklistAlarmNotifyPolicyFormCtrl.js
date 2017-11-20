define(
	function () {
		return ['$scope', 'HttpService','$http', 'SystemService','GridService','GridServices','title','forward','close', BacklistAlarmNotifyPolicyFormCtrl];
		function BacklistAlarmNotifyPolicyFormCtrl($scope, HttpService,$http,SystemService,GridService,GridServices,title, forward,close) {
			$scope.forward = forward;
			$scope.title = title;
			$scope.people = {};
			$scope.terminal = {};
			
			$scope.data = {};
			$scope.reset = function () {
				$scope.forward = forward;				
			};
			
			$scope.sure = function(){
				SystemService.saveOrUpdateUser('rest/surveillance/targetpolicy/save',$scope.forward).then(function success(data){
					close();
				})
			};
			
			$scope.clear = function(){
				$scope.forward = {};
			}
			
			$scope.selTerminal = { show : false };
			$scope.selPeople = { show : false };
		
			$scope.terminaShow = function(){
				$scope.selTerminal.show = true;
				$scope.selPeople.show = false;
				$scope.terminal.name = '';
				$scope.terminal.imei = '';
				$scope.terminal.imsi = '';
				
				if($scope.selPeople.show){					
			   		return false;		   			
				}else{
					$scope.getPagingList=function(currentPage, pageSize,sort){
			            var filter={page_size:pageSize,page_no:currentPage};
			            if($scope.terminal){
			            	filter.query = $scope.terminal;
			            	if(filter.query.imsi){
			            		filter.query.imsi = String(filter.query.imsi);
			            	}
			            	if(filter.query.imei){
			            		filter.query.imei = String(filter.query.imei);
			            	}
			            	if(filter.query.imsi == ''){
			            		delete filter.query.imsi;
			            	}
			            	if(filter.query.imei == ''){
			            		delete filter.query.imei;
			            	}
			            	if(filter.query.name == ''){
			            		delete filter.query.name;
			            	}
			            }
			           return HttpService.post('rest/surveillance/efence/search',filter);
			   		};
					GridService.create($scope,{
						fetchData:true,
						columnDefs:[
					        { field: 'name', displayName: '姓名',enableSorting:false,enableColumnMenu:false},
					        { field: 'imei', displayName: 'IMEI',enableSorting:false,enableColumnMenu:false},
					        { field: 'imsi', displayName: 'IMSI',enableSorting:false,enableColumnMenu:false}
					    ]
					});					
				}
				$scope.gridOptions.multiSelect = false;
				$scope.gridOptions.additionalAction = function(gridApi) {
					gridApi.selection.on.rowSelectionChanged($scope,function(){
			            var selection = $scope.gridApi.selection.getSelectedRows();
			            $scope.terminalName = selection[0].name;
			            $scope.forward.terminalId = selection[0].id;
			        });
				}
			};
		
			$scope.peopleShow = function(){
				$scope.selTerminal.show = false;
				$scope.selPeople.show = true;
				$scope.people.name = '';
				$scope.people.phone = '';
				if($scope.selTerminal.show){				
					return false;							
				}else{
					$scope.getPagingList=function(currentPage, pageSize,sort){
			            var filter={page_size:pageSize,page_no:currentPage};
			            if($scope.people){
			            	filter.query = $scope.people;
			            	filter.order_by = ['type'];
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
			            var result = HttpService.post('rest/surveillance/staff/search',filter);
			            result.then(function success(data){
			            })
			            return result;
			   		};
			   		GridServices.create($scope,{
						fetchData:true,
						columnDefs:[
					        { field: 'name',displayName: '人员名称',enableSorting:false,enableColumnMenu:false},
					        { field: 'phone',displayName: '电话号码',enableSorting: false,enableHiding: false,enableColumnMenu: false}
					    ]
					});					
				}
				$scope.gridOption.multiSelect = false;
				$scope.gridOption.additionalAction = function(gridApi) {
					gridApi.selection.on.rowSelectionChanged($scope,function(){
			            var selection = $scope.gridApi.selection.getSelectedRows();
			            $scope.peopleId = selection[0].name;
			            $scope.forward.peopleId = selection[0].id;
			        });
				}
			};

			$scope.close=close;

		    $scope.searchPeople = function(){
		    	GridServices.refresh($scope);
		    };
		    
		    $scope.searchTerminal = function(){
		    	GridService.refresh($scope);
		    };
		   

		    
		}
	});
