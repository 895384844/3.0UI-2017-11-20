define(
function() {
	return ['$scope', 'HttpService', SetMsgCtrl];

	function SetMsgCtrl($scope, HttpService) {		
		$scope.sureMsg = function(){
			var filter={};
            if($scope.msg){
            	filter = $scope.msg;          	           	
            }
            var result = HttpService.post('rest/system/setting/save',filter);
            return result;
		}
	}
})
