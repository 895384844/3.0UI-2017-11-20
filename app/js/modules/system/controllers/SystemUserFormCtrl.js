define(['../../common/utils/md5'],function(md5) {
		return ['$scope', 'HttpService', 'user','SystemService','SectionsService','close',SystemUserFormCtrl];
		function SystemUserFormCtrl($scope, HttpService,user,SystemService,SectionsService,close) {
			$scope.user = user;				
			$scope.loc = [];
			$scope.locations = [];
			$scope.groupID = [];
			var query = {};
			var filter = {};
			$scope.permission = {
				DEVICE_MANAGEMENT : '1',
				INFORMATION_RETRIEVAL : '1',
				DATA_ANALYSIS : '1',
				SURVEILLANCE : '1',
				ALARM : '1',
				GEOGRAPHIC_INFORMATION : '1',
				DOMAIN_MANAGEMENT : '0',
				USER_MANAGEMENT : '0',
				SYSTEM_MANAGEMENT : '1',
				AUDIT_TRAIL : '0',
				SYSTEM_TOOL : '0',
				CASE_MANAGEMENT : '1'
			};
			var permissions = JSON.parse(sessionStorage.getItem('permissions'));
			var options = [
				{code: "0", description: "不可见"},
				{code: "1", description: "可读"},
				{code: "2", description: "读写"}
			];
			$scope.getOptions = function(code) {
				var index = permissions[code] * 1;
				var result = options.slice(0, index + 1);

				var defaultValue = $scope.permission[code] * 1;
				if (defaultValue > index) {
					$scope.permission[code] = index + '';
				}

				return result;
			}

			query.adCode = '00';
			
			if(user.domainList){
				$scope.groupID = user.domainList;
			}else if(user.domainList == ""){
				$scope.groupID = ['00'];
			}
			
			pathList = user.pathList;
			var str = [];
			if(pathList){
				pathList = pathList.split(';')
				for(var i=0; i<pathList.length; i++){
					str.push(pathList[i].split('.').pop());
				}
				if(str != ''){
					$scope.loc = str;
				}	
			}
			HttpService.get('rest/system/domain/gettree',query).then(function success(resp){
		    	$scope.data = [];
		    	$scope.data.push(resp);
		    })
			
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
			
			$scope.con = function(scope){
				var data = scope.$modelValue;
				$scope.loc.push(data.name);
				$scope.groupID.push(data.adCode);
				$scope.groupID = unique1($scope.groupID);
				$scope.loc = unique1($scope.loc);
			}
			
			$scope.removeGroup = function(idx){
				$scope.groupID.splice(idx,1);
				$scope.loc.splice(idx,1);
			}

			$scope.sure = function () {
				var permission = {
					'DEVICE_MANAGEMENT' : $scope.permission.DEVICE_MANAGEMENT,
					'INFORMATION_RETRIEVAL' : $scope.permission.INFORMATION_RETRIEVAL,
					'DATA_ANALYSIS' : $scope.permission.DATA_ANALYSIS,
					'SURVEILLANCE' : $scope.permission.SURVEILLANCE,
					'ALARM' : $scope.permission.ALARM,
					'GEOGRAPHIC_INFORMATION' : $scope.permission.GEOGRAPHIC_INFORMATION,
					'DOMAIN_MANAGEMENT' : $scope.permission.DOMAIN_MANAGEMENT,
					'USER_MANAGEMENT' : $scope.permission.USER_MANAGEMENT,
					'SYSTEM_MANAGEMENT' : $scope.permission.SYSTEM_MANAGEMENT,
					'AUDIT_TRAIL' : $scope.permission.AUDIT_TRAIL,
					'SYSTEM_TOOL' : $scope.permission.SYSTEM_TOOL,
					'CASE_MANAGEMENT' : $scope.permission.CASE_MANAGEMENT
				};
				
				$scope.user.password = md5[0](user.password).toUpperCase();
				$scope.user.domainList = $scope.groupID;				
				$scope.user.permissionList = permission;
				SystemService.saveOrUpdateUser('rest/system/user/save', $scope.user).then(function success(data) {
					close();
				});
			};

			$scope.close = function(){
				close();
			}
		}
	});
