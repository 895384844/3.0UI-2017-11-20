define(
function() {
	return ['$scope', 'HttpService', 'DialogService', SetMsgCtrl];

	function SetMsgCtrl($scope, HttpService, DialogService) {		
		$scope.sureMsg = function(){
			var filter={};
            if($scope.msg){
            	if($scope.msg.msgTestTel){
            		$scope.msg.msgTestTel = $scope.msg.msgTestTel + '';
            	}
            	filter = $scope.msg;          	           	
            }
            var result = HttpService.post('rest/system/setting/save',filter);
            return result;
		};
		$scope.testMsg = function(){
			var filter={};
            if($scope.msg){
            	if($scope.msg.msgTestTel){
            		$scope.msg.msgTestTel = $scope.msg.msgTestTel + '';
            	}
            	filter = $scope.msg;          	           	
            }
            var result = HttpService.post('rest/system/setting/save',filter);
            result.then(function success(){
            	var data = {};
				HttpService.post('rest/system/setting/test',data).then(function success(resp){
					if(resp.msg == 'ok'){
			    		DialogService.showMessage(
		                '提示',
		                '发送成功！',null);
			    	}else{
			    		DialogService.showMessage(
		                '提示',
		                resp.msg,null);
			    	}
				})
            })
            return result;			
		}
	}
})
