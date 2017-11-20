define(['../../common/utils/md5'],function(md5) {
		return ['$scope', 'HttpService', 'user','SystemService','close', SystemUserFormCtrl];
		function SystemUserFormCtrl($scope, HttpService,user,SystemService,close) {
			$scope.close = close;
			$scope.user = user;				
			$scope.loc = [];
			$scope.locations = [];
			$scope.groupID = [];
			var query = {};
			var filter = {};
			$scope.permission = {
				device : '1',
				mes : '1',
				data : '1',
				warning : '1',
				query : '1',
				maps : '1',
				domain : '0',
				user : '0',
				system : '1',
				log : '0',
				tool : '0'				
			};			
			
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
			
			$scope.removeGroup = function(idx){
				$scope.groupID.splice(idx,1);
				$scope.loc.splice(idx,1);
			}

			$scope.sure = function () {
				var permission = {
					'DEVICE_MANAGEMENT' : $scope.permission.device,
					'INFORMATION_RETRIEVAL' : $scope.permission.mes,
					'DATA_ANALYSIS' : $scope.permission.data,
					'SURVEILLANCE' : $scope.permission.warning,
					'ALARM' : $scope.permission.query,
					'GEOGRAPHIC_INFORMATION' : $scope.permission.maps,
					'DOMAIN_MANAGEMENT' : $scope.permission.domain,
					'USER_MANAGEMENT' : $scope.permission.user,
					'SYSTEM_MANAGEMENT' : $scope.permission.system,
					'AUDIT_TRAIL' : $scope.permission.log,
					'SYSTEM_TOOL' : $scope.permission.tool
				};
				
				for (var k in permission){
 					if(permission[k] == 0){
 						delete permission[k];
 					}
    			}
				
				$scope.user.password = md5[0](user.password).toUpperCase();
				$scope.user.domainList = $scope.groupID;
				$scope.user.permissionList = permission;
				SystemService.saveOrUpdateUser('rest/system/user/save', $scope.user).then(function success(data) {
					close();
				});
			};
		}
	});
