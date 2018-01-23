define(['../../common/utils/md5'],function(md5) {
		return ['$scope', 'HttpService', 'SystemService', 'title', 'DialogService', 'parentID', 'close', VehicleDeleteCtrl];
		function VehicleDeleteCtrl($scope, HttpService, SystemService, title, DialogService, parentID, close) {
			$scope.close = close;
			$scope.title = title;
			$scope.del = {};
			$scope.atype = 'only';
			$scope.sure = function(){
				DialogService.showConfirm(
	                '警告信息',
	                '确认删除后将无法恢复！',function(){
	                	var filter = {};
	                	filter.account = $scope.del.username;
	                	filter.password = md5[0]($scope.del.password).toUpperCase();
	                	var checkInfo = HttpService.post('rest/system/user/auth',filter);
	                	checkInfo.then(function success(resp){
	                		if($scope.atype == 'only'){
	                			HttpService.get('rest/device/vehicle/delete',{id:parentID}).then(function success(data){
	                				var del = {};
		    						del.adCode = '00';
									HttpService.get('rest/system/domain/gettree',del).then(function success(resp){
								    	$scope.data = [];
								    	$scope.data.push(resp);
								    })
									close();
			                    },
			                    function failure(errorResponse){
			                        
			                    })
			                    .finally(function(){
		
			                    });
	                			return;
	                		}else if($scope.atype == 'all'){
	                			HttpService.get('rest/device/vehicle/clean',{id:parentID}).then(function success(data){
	                				var clean = {};
		    						clean.adCode = '00';
									HttpService.get('rest/system/domain/gettree',clean).then(function success(resp){
								    	$scope.data = [];
								    	$scope.data.push(resp);
								   });
								   close();
			                    },
			                    function failure(errorResponse){
			                        
			                    })
			                    .finally(function(){
		
			                    });
	                		}
	                	})	                   
	                },null)
			}
		}
	});
