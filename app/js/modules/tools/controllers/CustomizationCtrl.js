define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService','EmptyInput','delEmptyInput', CustomizationCtrl];

	function CustomizationCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService,EmptyInput,delEmptyInput) {
		$scope.query = {};
		$scope.btnStatus = false;
	
		HttpService.get('rest/tool/customization/get').then(function success(resp){
			$scope.query = resp;			
		})
		
		$scope.checkBtn = function(){
			if($scope.query.name == '' || !$scope.query.name){
				$scope.btnStatus = true;
			}else{
				$scope.btnStatus = false;
			}
		}
		
		$scope.sure = function(){
			HttpService.post('rest/tool/customization/save',$scope.query).then(function success(resp){
				document.title = $scope.query.name;
			})
		}
		
	}
});