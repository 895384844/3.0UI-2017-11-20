define(['../../common/utils/md5'],function(md5) {
		return ['$scope', 'HttpService', 'user','SystemService','SectionsService','close', SystemUserEditCtrl];
		function SystemUserEditCtrl($scope, HttpService,user,SystemService,SectionsService,close) {
			var query = {};
			$scope.loc = [];
			query.adCode = '00';
			$scope.groupID = [];
			// 最简单数组去重法 
			function unique1(array){ 
				var n = []; //一个新的临时数组 
				//遍历当前数组 
				for(var i = 0; i < array.length; i++){ 
					//如果当前数组的第i已经保存进了临时数组，那么跳过， 
					//否则把当前项push到临时数组里面 
					if (n.indexOf(array[i]) == -1) n.push(array[i]); 
				} 
				return n; 
			}
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
			if(!obj.CASE_MANAGEMENT){obj.CASE_MANAGEMENT = '1'};

			var permissions = JSON.parse(sessionStorage.getItem('permissions'));
			var options = [
				{code: "0", description: "不可见"},
				{code: "1", description: "可读"},
				{code: "2", description: "读写"}
			];
			$scope.getOptions = function(code) {
				var a = permissions[code] * 1;
				var b = obj[code] * 1;
				var index = Math.max(a, b);
				var result = options.slice(0, index + 1);
				return result;
			}
			
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
				$scope.groupID = unique1($scope.groupID);
				$scope.loc = unique1($scope.loc);
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
