define(
function() {
	return ['$scope', 'HttpService', 'close', 'DialogService', VehicleImportCtrl];

	function VehicleImportCtrl($scope, HttpService, close, DialogService) {		
		$scope.close = close;
		$scope.onFileSelect = function($file) { 
            if(!$file){
                return;
            }   
            var file = $file;
            HttpService.upload('rest/device/vehicle/import',{
            	data: {filename: file.name},
                file: file
            }).progress(function(evt) {       
                $scope.isWaiting=true;
            }).success(function(data,status,headers,config){
                if(data.status == -1){
                	DialogService.showMessage(
	                '提示',
	                data.message,null)
                }
                close();
            }).error(function(data,status,headers,config){
                DialogService.showMessage(
	                '提示',
	                '导入失败！',null)
                close();
				return;
            }).finally(function(){
                $scope.isWaiting=false;
            });   
    
        };
	}
})