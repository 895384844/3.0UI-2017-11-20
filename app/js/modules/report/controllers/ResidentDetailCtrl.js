define(
	function () {
		return ['$scope', 'HttpService','$http', 'SystemService','row','GridService','GetLocalTime','close', ResidentDetailCtrl];
		function ResidentDetailCtrl($scope, HttpService,$http,SystemService,row,GridService, GetLocalTime,close) {			
			
			$scope.close = close;
			
	   		$scope.getPagingList = function(currentPage, pageSize,sort){
	   			var filter={page_size:pageSize,page_no:currentPage};
	   			filter.query = {
	   				imsi : row.id
	   			};
	            return HttpService.post('rest/information/efence/residentdetail',filter);	
	   		}
			GridService.create($scope,{
				fetchData:true,
				columnDefs:[
			        { field: 'fullPath', displayName: '域组信息',enableSorting:false,enableColumnMenu:false},
			        { field: 'total', displayName: '上号总量',enableSorting:false,enableColumnMenu:false},
			        { field: 'days', displayName: '有效上号天数',enableSorting:false,enableColumnMenu:false},
			        { field: 'average', displayName: '平均上上号量',enableSorting:false,enableColumnMenu:false}
			    ]
			});
		    
		}
	});
