define(
function() {
	return ['$scope', 'HttpService', 'row', 'close', 'SystemService', SystemUserSet];

	function SystemUserSet($scope, HttpService, row, close, SystemService) {
		$scope.close = close;
		$scope.loc = [];
		$scope.locations = [];
		$scope.groupID = [];
		var query = {};
		var filter = {};
		query.adCode = '00';
		
		if(row.domainList){
			$scope.groupID = row.domainList;
		}else if(row.domainList == ""){
			$scope.groupID = ['00'];
		}
		
		pathList = row.pathList;
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
		
		$scope.setDomain = function(){
			filter.id = row.id;
			filter.account = row.account;
			filter.password = row.password;
			filter.telNumber = row.telNumber;
			filter.domainList = $scope.groupID;
			if(row.locked == '正常'){
				row.locked = 0;
			}
			filter.locked = row.locked;
			filter.misTimes = row.misTimes;
			SystemService.saveOrUpdateUser('rest/system/user/edit', filter).then(function success(data){
				close();
			});
		}
	}
})
