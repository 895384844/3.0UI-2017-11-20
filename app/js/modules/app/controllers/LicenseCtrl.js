define(function() {
    return ['$scope', '$location', 'MENU_GROUPS', 'HttpService','localSession',LicenseCtrl];

    function LicenseCtrl($scope, $location, menuGroups,HttpService,localSession) {
        
        $scope.onFileSelect = function($file) { 
            if(!$file){
                return;
            }   
            var file = $file;
            HttpService.upload('system/license/update',{
                data: {fileName: $scope.licenseFile},
                file: file
            }).progress(function(evt) {       
                $scope.isWaiting=true;
            }).success(function(data,status,headers,config){ 
                 $scope.license=data;
                if(!!data&&data.status===-1){
                    $scope.showWarning=true;
                    return;
                }
                $scope.showWarning=false;
               
            }).error(function(data,status,headers,config){ 
               // console.info(data);
            }).finally(function(){
                $scope.isWaiting=false;
            });   
    
        };

        (function(){
            HttpService.post('system/license/get',{}).then(function success(data){
                if(!!data){
                	$scope.license=data;
                }
            });

        })();


    }
});