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
