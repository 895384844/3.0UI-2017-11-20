define(['../../common/utils/md5'],function(md5) {
		return ['$scope', 'HttpService', 'user','SystemService','close', SystemUserEditCtrl];
		function SystemUserEditCtrl($scope, HttpService,user,SystemService,close) {
			var query = {};
			$scope.loc = [];
			query.adCode = '00';
			$scope.groupID = [];
			HttpService.get('rest/system/domain/gettree',query).then(function success(resp){
		    	$scope.data = [];
		    	$scope.data.push(resp);
		   });
			$scope.user = user;
			for(k in user.permissionList){
				user.permissionList[k] = String(user.permissionList[k]);				
			}
			var obj = $scope.user.permissionList;
			if(!obj.DEVICE_MANAGEMENT){obj.DEVICE_MANAGEMENT = '0'};
			if(!obj.INFORMATION_RETRIEVAL){obj.INFORMATION_RETRIEVAL = '0'};
			if(!obj.DATA_ANALYSIS){obj.DATA_ANALYSIS = '0'};
			if(!obj.SURVEILLANCE){obj.SURVEILLANCE = '0'};
			if(!obj.ALARM){obj.ALARM = '0'};
			if(!obj.GEOGRAPHIC_INFORMATION){obj.GEOGRAPHIC_INFORMATION = '0'};
			if(!obj.DOMAIN_MANAGEMENT){obj.DOMAIN_MANAGEMENT = '0'};
			if(!obj.USER_MANAGEMENT){obj.USER_MANAGEMENT = '0'};
			if(!obj.SYSTEM_MANAGEMENT){obj.SYSTEM_MANAGEMENT = '0'};
			if(!obj.AUDIT_TRAIL){obj.AUDIT_TRAIL = '0'};
			if(!obj.SYSTEM_TOOL){obj.SYSTEM_TOOL = '0'};
			
			//user.domainList
			for(var j=0; j<user.domainList.length; j++){
				$scope.groupID.push(user.domainList[j]);
			}
			
        	var domain = user.pathList.split(';');
        	for(var k=0; k<domain.length; k++){
        		domain[k] = domain[k].substring(domain[k].lastIndexOf("•")+1);
        		$scope.loc.push(domain[k]);
        	}
			
			$scope.save = function(){
				//$scope.user.permissionList = user.permissionList;
				for (var k in $scope.user.permissionList){
 					if($scope.user.permissionList[k] == '0'){
 						delete $scope.user.permissionList[k];
 					}
    			}
				console.log($scope.user.permissionList)
				
				$scope.user.domainList = $scope.groupID;
								
				if($scope.user.locked == '正常'){
					$scope.user.locked = 0;
				}
				delete $scope.user.pathList;
				SystemService.saveOrUpdateUser('rest/system/user/edit',$scope.user).then(function success(data){
					close();
				})
			}
		    
		    $scope.con = function(scope){
				var data = scope.$modelValue;
				$scope.loc.push(data.name);
				if(!data.adCode){
					data.adCode = "00"
				}
				$scope.groupID.push(data.adCode);
				$scope.groupID = $scope.groupID.unique3();
				$scope.loc = $scope.loc.unique3();
			}
		    Array.prototype.unique3 = function(){
				var res = [];
				var json = {};
				for(var i = 0; i < this.length; i++){
					if(!json[this[i]]){
						res.push(this[i]);
						json[this[i]] = 1;
					}
				}
				return res;
			}
			
			$scope.removeGroup = function(idx){
				$scope.groupID.splice(idx,1);
				$scope.loc.splice(idx,1);
			}
			
			$scope.clear = function(){
				$scope.user = {};
			}

			$scope.close = function(){
				close();
			}
		}
	});
