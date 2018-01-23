define(
	function () {
		return ['$scope', 'HttpService','$http', 'SystemService','row','data','GridService','GetLocalTime','close', 'ModalService', 'DialogService', AccompanyVehicleDetailCtrl];
		function AccompanyVehicleDetailCtrl($scope, HttpService,$http,SystemService,row,data, GridService, GetLocalTime, close , ModalService, DialogService) {			
			
			$scope.close = close;
			var mobileNetSystem = {
				0 : 'GSM',
				1 : 'CDMA',
				2 : 'W-CDMA',
				3 : 'TD-CDMA',
				4 : 'FDD-LTE',
				5 : 'TDD-LTE',
				6 : 'WIFI'
			}
			
			$scope.searchDetails = function(rows){
				if(rows.fileName){
					ModalService.showModal({
			            templateUrl: 'report/templates/vehicle_pic.html',
			            controller: 'VehiclePicCtrl',
			            inputs: { 
			            	row : rows
			            }
			        });
				}else{
					DialogService.showMessage(
		                '提示',
		                '没有车辆图片！',null);
		            return;
				}
				
			}
	   		$scope.getPagingList = function(currentPage, pageSize,sort){
	   			
	   			for(var i=0; i<row.detail.length; i++){
           			row.detail[i].mobileNetSystem = mobileNetSystem[row.detail[i].mobileNetSystem];
           			row.detail[i].timestamp = GetLocalTime(row.detail[i].timestamp) ;
           		}
	   			
	   			$scope.gridOptions.data=row.detail;
	   			$scope.gridOptions.totalItems=row.detail.length;
	   			$scope.gridApi.pagination.isLoading=false;
	   			return null;   			
	   		}
	   		
	   		if(data.imsi){
				GridService.create($scope,{
					fetchData:true,
					columnDefs:[
				        { field: 'deviceID', displayName: '设备编号',enableSorting:false,enableColumnMenu:false},
				        { field: 'plate', displayName: '车牌号',enableSorting:false,enableColumnMenu:false},
				        { field: 'attributeName', displayName: '归属地',enableSorting:false,enableColumnMenu:false},
				        { field: 'fullPath', displayName: '域组信息',enableSorting:false,enableColumnMenu:false},
				        { field: 'timestamp', displayName: '采集时间',enableSorting:false,enableColumnMenu:false},
				        { 
			            	field: 'operation',
			            	displayName: '详情查询',
			            	enableSorting:false,
			            	enableColumnMenu:false,
			            	cellTemplate: '<a class="fa fa-fw fa-search btn-edit" href ng-click="grid.appScope.searchDetails(row.entity)" style="margin-left:15px;color:#31708f;" uib-tooltip="详情查询" tooltip-placement="left"></a>'
			            	
			            }
				    ]
				});
		    }else if(data.plate){
		    	GridService.create($scope,{
					fetchData:true,
					columnDefs:[
				        { field: 'deviceID', displayName: '设备编号',enableSorting:false,enableColumnMenu:false},
				        { field: 'imsi', displayName: 'IMSI',enableSorting:false,enableColumnMenu:false},
				        { field: 'imei', displayName: 'IMEI',enableSorting:false,enableColumnMenu:false},
				        { field: 'timestamp', displayName: '采集时间',enableSorting:false,enableColumnMenu:false},
				        { field: 'fullPath', displayName: '域组信息',enableSorting:false,enableColumnMenu:false},
				        { field: 'mobileNetSystem', displayName: '网络类型',enableSorting:false,enableColumnMenu:false}
				    ]
				});
		    }
		}
	});
