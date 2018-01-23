define(
	function () {
		return ['$scope', 'HttpService','$http', 'SystemService','row','data','GridService','GetLocalTime','close', AccompanyImsiDetailCtrl];
		function AccompanyImsiDetailCtrl($scope, HttpService,$http,SystemService,row,data,GridService, GetLocalTime,close) {			
			
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
				        { field: 'mac', displayName: 'MAC地址',enableSorting:false,enableColumnMenu:false},
				        { field: 'fullPath', displayName: '域组信息',enableSorting:false,enableColumnMenu:false},
				        { field: 'timestamp', displayName: '采集时间',enableSorting:false,enableColumnMenu:false}
				    ]
				});
		    }else if(data.mac){
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
