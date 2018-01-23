define(
function() {
	return ['$scope', 'HttpService', 'close', 'DialogService', BusUserImportCtrl];

	function BusUserImportCtrl($scope, HttpService, close, DialogService) {		
		$scope.close = close;
		$scope.onFileSelect = function($file) { 
            if(!$file){
                return;
            }   
            var file = $file;
            HttpService.upload('rest/surveillance/staff/import',{
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
				return;
            }).finally(function(){
                $scope.isWaiting=false;
            });   
    
        };
	}
})
