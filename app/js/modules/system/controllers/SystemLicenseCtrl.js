define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', SystemLicenseCtrl];

	function SystemLicenseCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter = {
				page_size: pageSize,
				page_no: currentPage,
				order_by: ['importTime']
			};
			return HttpService.post('rest/system/license/search', filter);
		};
		
		$scope.onFileSelect = function($file) { 
            if(!$file){
                return;
            }   
            var file = $file;
            HttpService.upload('rest/system/license/upload',{
            	data: {filename: file.name},
                file: file
            }).progress(function(evt) {       
                $scope.isWaiting=true;
            }).success(function(data,status,headers,config){ 
            	GridService.refresh($scope);
                $scope.license=data;
                if(!!data&&data.status===-1){
                    $scope.showWarning=true;
                    return;
                }
                $scope.showWarning=false;
               
            }).error(function(data,status,headers,config){
                DialogService.showMessage(
	                '提示',
	                '导入失败！',null)
				return;
            }).finally(function(){
                $scope.isWaiting=false;
            });   
    
        };

        /*(function(){
            HttpService.post('system/license/get',{}).then(function success(data){
                if(!!data){
                	$scope.license=data;
                }
            });

        })();*/

		$scope.imports = function(){
	        ModalService.showModal({
	            templateUrl: 'device/templates/license_import.html',
	            controller: 'SystemLicenseImportCtrl'
	        }).then(function(modal) {
				modal.close.then(function(result) {
					GridService.refresh($scope);
			});/*.then(function(modal) {
	            modal.element.modal();
	            modal.close.then(function() {
	                $scope.promise = gridServices.promiseDefault('/device/deviceAction!getScopeDevice.action');
	                $scope.getPage($scope.promise);
	            });*/
	        });
	    };

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
			{ field: 'id',displayName: 'ID',enableSorting:false,enableColumnMenu:false },
	        { field: 'userName',displayName: '用户名',enableSorting:false,enableColumnMenu:false },
	        { field: 'startTime',displayName: '时间从',enableHiding:false,enableSorting:false,enableColumnMenu:false },
	        { field: 'endTime',displayName: '时间到',enableHiding:false,enableSorting:false,enableColumnMenu:false },
	        { field: 'deviceCount',displayName: '设备数量',enableHiding:false,enableSorting:false,enableColumnMenu:false },
	        { field: 'hardware',displayName:'硬件信息',enableSorting:false,enableColumnMenu: false},
	        { field: 'sign',displayName: '密钥',enableSorting:false,enableColumnMenu:false },
	        { field: 'importTime',displayName: '导入日期',enableHiding:false,enableSorting:false,enableColumnMenu:false }
			]
		});
	}
});