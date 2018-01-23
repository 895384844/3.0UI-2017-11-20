define(
	function () {
		return ['$scope', 'HttpService','SystemService','close', 'postData', CaseListEditCtrl];
		function CaseListEditCtrl($scope, HttpService,SystemService,close, postData) {
			HttpService.get('rest/system/domain/alldomain').then(function success(resp){
				$scope.list = resp;
			})
			$scope.case = postData;
			$scope.case.timeString = postData.time;
			$scope.save = function(){
				if(!$scope.case.domainGroup){
					$scope.case.domainGroup = "00";
				}
				SystemService.saveOrUpdateUser('rest/case/case/save',$scope.case).then(function success(data){
					close();
				})
			}
			$scope.clear = function(){
				$scope.case = {};
			}

			$scope.close=close;
		}
	});
