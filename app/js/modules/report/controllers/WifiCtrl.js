define(function () {
	return ['$scope', 'HttpService', 'AlertService', 'GridServiceReport', 'ModalService','DialogService', 'EmptyInput', 'DateFormat', 'delEmptyInput', 'GetLocalTime', WifiCtrl];

	function WifiCtrl($scope, HttpService, AlertService,GridServiceReport,ModalService,DialogService, EmptyInput, DateFormat, delEmptyInput, GetLocalTime) {
		$scope.pageSize = '30';
		$scope.showLoading = false;
		var cacheQuery = {};
		$scope.postData = {};
		EmptyInput($scope.query);
		$scope.isActive = true;
		$scope.isShow = false;
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		
		$scope.clear = function(){
			$scope.query = {};
			$scope.isDeviceID = false;
		}
		
		HttpService.get('rest/system/domain/allgroup').then(function success(data) {
			for(var i=0; i<data.length; i++){
				data[i].fullPath = data[i].fullPath.split('•');
				var str = data[i].fullPath[2]+"•"+data[i].fullPath[3]
				data[i].fullPath = str;
			}
			data.splice(0,0,{fullPath:"全部"})
            $scope.vendorChoice = data;
        });
        
        $scope.groupName = function(scope){
        	var data = $scope.query.domainGroup * 1;
        	if($scope.query.domainGroup == 'all' || data == 0 || !data){
        		$scope.isDeviceID = false;
        		$scope.isShow = false;
        	}else{
        		$scope.isDeviceID = true;
        		if(window.outerWidth <= 1367){
        			$scope.isShow = true;
        		}       		
        		HttpService.get('rest/device/efence/get',{type:'wifi',group:data}).then(function success(resp){
        			resp.splice(0,0,{deviceID:"全部"})
					$scope.deviceID = resp;
					$scope.query.deviceID = '全部';
				});
        	}
        }
        
		$scope.getNoPagingList=function(currentPosition){
			$scope.showLoading = true;
            var filter={
            	pageSize : $scope.pageSize,
            	query : {} 
            };
            if (currentPosition) {
				for (var property in currentPosition) {
					filter[property] = currentPosition[property];
				}
			}
        	if($scope.query){
        		filter.query = angular.copy(catchQuery);
        		if(filter.query.domainGroup == 'all' || !filter.query.domainGroup){
            		delete filter.query.domainGroup;
            		delete filter.query.deviceID;
            	}
            	if(filter.query.deviceID){
            		filter.query.deviceID = filter.query.deviceID.deviceID;
            		if(filter.query.deviceID == '全部' || !filter.query.deviceID){
            			delete filter.query.deviceID;
            		}
            	}
            	if(filter.query.timestamp__ge){
            		filter.query.timestamp__ge = DateFormat(filter.query.timestamp__ge);
            	}
            	if(filter.query.timestamp__lt){
            		filter.query.timestamp__lt = DateFormat(filter.query.timestamp__lt);
            	} 
            	if(filter.query.mac){
            		filter.query.mac = filter.query.mac.toUpperCase();
            	}
        	}           
            var result = HttpService.post('rest/information/wifi/integrative',filter);
            result.then(function success(resp){
            	$scope.showLoading = false;
           		if(!resp.items){
           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		            return;
           		}else{
	           		var list = resp.items;
	           		$scope.postData = resp;
	           		for(var i=0; i<list.length; i++){
	           			list[i].timestamp = GetLocalTime(list[i].timestamp);
	           			list[i].receiveTime = GetLocalTime(list[i].receiveTime);
	           		}
           		}    
            },function error(err){
            	$scope.showLoading = false;
            })
            return result;
   		};
   		
   		$scope.refresh = function(){
			GridServiceReport.refresh($scope);
		}
   		
   		var field = {
			'deviceID' : '采集设备编号',
			'fullPath' : '域组信息',
			'timestamp' : '采集时间',
			'mac' : 'Mac地址',
			'receiveTime' : '报文入库时间'
		};
		
		$scope.exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "终端MAC查询-"+times,
			    fields: field,
			    fileName: "WifiPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {}			    
			}
           if($scope.query){
        		filter.pager.query = angular.copy(catchQuery);
        		if(filter.pager.query.domainGroup == 'all' || !filter.pager.query.domainGroup){
            		delete filter.pager.query.domainGroup;
            		delete filter.pager.query.deviceID;
            	}
            	if(filter.pager.query.deviceID){
            		filter.pager.query.deviceID = filter.pager.query.deviceID.deviceID;
            		if(filter.pager.query.deviceID == '全部' || !filter.pager.query.deviceID){
            			delete filter.pager.query.deviceID;
            		}
            	}
            	if(filter.pager.query.timestamp__ge){
            		filter.pager.query.timestamp__ge = DateFormat(filter.pager.query.timestamp__ge);
            	}
            	if(filter.pager.query.timestamp__lt){
            		filter.pager.query.timestamp__lt = DateFormat(filter.pager.mapQuery.timestamp__lt);
            	} 
            	if(filter.pager.query.mac){
            		filter.pager.query.mac = filter.pager.query.mac.toUpperCase();
            	}
        	}  
			HttpService.post('rest/information/wifi/integrative_export',filter).then(function success(resp) {
				$scope.showLoading = false;
            	var filter={fileName: resp.file}
         	    var anchor = angular.element('<a/>');
		        anchor.attr({
		            href: 'EFS/core/system/file/download_file?fileName=' + resp.file
		        })[0].click();
			},function error(err){
				$scope.showLoading = false;
			})
		}
   		
   		$scope.previousPage = function(){
			var previous = {};
			previous.previousTimeStamp = $scope.postData.previousTimeStamp;
			previous.previousId = $scope.postData.previousId;
			GridServiceReport.refresh($scope, previous);
		}
		$scope.nextPage = function(){
			var next = {};
			next.nextTimeStamp = $scope.postData.nextTimeStamp;
			next.nextId = $scope.postData.nextId;
			GridServiceReport.refresh($scope, next);
		}
		
		$scope.setPageSize = function(){
			var query = {};
			GridServiceReport.refresh($scope, query, $scope.pageSize)
		}
		
		GridServiceReport.create($scope,{
			fetchData:true,
			columnDefs:[
		        { field: 'deviceID',displayName: '采集设备编号',enableHiding: false,enableSorting: false,enableColumnMenu: false},
		        { field: 'fullPath',displayName: '域组信息',enableHiding: false,enableSorting: false,enableColumnMenu: false},
		        { field: 'timestamp',displayName: '采集时间',enableHiding: false,enableSorting: false,enableColumnMenu: false},
		        { field: 'mac',displayName: 'Mac地址',enableHiding: false,enableSorting: false,enableColumnMenu: false},
				{
					field: 'receiveTime',
					displayName: '报文入库时间',
					enableSorting: false,
					enableColumnMenu: false
				}
		    ]
		});
		
		$scope.search = function(){
			delEmptyInput($scope.query);
			catchQuery = angular.copy($scope.query);
			GridServiceReport.refresh($scope)
		}
		
	}
})