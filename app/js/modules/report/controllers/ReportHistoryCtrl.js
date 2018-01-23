define(['datetimepicker'],function(datetimepicker) {
	return ['$scope', 'DialogService', 'i18nService', '$lt', '$filter', 'GridServiceNoCount', 'GridServiceReport', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','EmptyInput','delEmptyInput','GetLocalTime','groupSelect',ReportHistoryCtrl];

	function ReportHistoryCtrl($scope, DialogService, i18nService, $lt, $filter, GridServiceNoCount, GridServiceReport, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,EmptyInput,delEmptyInput,GetLocalTime,groupSelect) {

		$scope.gridItemData = {};
		$scope.query = {};
		EmptyInput($scope.query);
		$scope.selectData = {};
		//$scope.isActive = true;
		//$scope.isShow = true;
		$scope.showLoading = false;
		$scope.postData = {};
		$scope.hasMore = false;
		$scope.hasNoMore = false;
		$scope.pageSize = '30';
		$scope.attribute = false;
		$scope.isDeviceID = false;
		$scope.isActive = true;
		$scope.isShow = true;
		var cacheQuery = {};
		var getprovince = {
			adCode : '00'
		};
		$scope.count = 0;
		
		$scope.clear = function(){
			$scope.query = {};
			$scope.attribute = false;
			$scope.isDeviceID = false;
		}
		
		HttpService.get('rest/system/domain/scopelist',getprovince).then(function success(resp){
			resp.splice(0,0,{name:"全国",adCode:'00'},{name:"境外",adCode:'1'});
			$scope.province = resp;
			$scope.query.provinceID = '00';
		});
		
		$scope.refresh = function(){
			GridServiceReport.refresh($scope);
		}
		
		$scope.showAttribute = function(){
			if($scope.query.provinceID == '00' || $scope.query.provinceID == '1'){
				$scope.attribute = false;
			}else{
				$scope.attribute = true;
				var getAttribute = {
					adCode : $scope.query.provinceID
				}
				HttpService.get('rest/system/domain/scopelist',getAttribute).then(function success(resp){
					resp.splice(0,0,{name:"全部",areaCode:''})
					$scope.attribute = resp;
					$scope.attributeNo = '';
				})
			}
		}
		
		var mobileNetCarrier = {
			0 : '移动',
			1 : '联通',
			2 : '电信',
			3 : '其它',
			4 : '境外'
		}
		
		var mobileNetSystem = {
			0 : 'GSM',
			1 : 'CDMA',
			2 : 'W-CDMA',
			3 : 'TD-SCDMA',
			4 : 'FDD-LTE',
			5 : 'TDD-LTE',
			6 : 'WIFI'
		}
		
		var field = {
			'deviceID' : '采集设备编号',
			'fullPath' : '域组信息',
			'timestamp' : '采集时间',
			'imei' : 'IMEI',
			'imsi' : 'IMSI',
			'attributeName' : '归属地',
			'mobileNetSystem' : '终端网络类型',
			'mobileNetCarrier' : '网络运营商',
			'receiveTime' : '报文入库时间'
		}
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}
		
        HttpService.get('rest/system/domain/allgroup').then(function success(data) {
       		
			for(var i=0; i<data.length; i++){
				data[i].fullPath = data[i].fullPath.split('•');
				var str = data[i].fullPath[2]+"•"+data[i].fullPath[3];
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
        		//if(window.outerWidth <= 1367){
        			$scope.isShow = true;
        		//}       		
        		HttpService.get('rest/device/efence/get',{type:'efence',group:data}).then(function success(resp){
        			resp.splice(0,0,{deviceID:"全部"})
					$scope.deviceID = resp;
					$scope.query.deviceID = '全部';
				});
        	}
        }
        
        function exportData(){
        	$scope.showLoading = true;
        	var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "手机侦码查询-"+times,
			    fields: field,
			    fileName: "ReportHistoryPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: $scope.query
			    }
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	integrative(filter.pager);
            }
			return HttpService.post('rest/information/efence/integrative_export',filter).then(function success(resp) {
				$scope.showLoading = false;
            	var filter={fileName: resp.file};
            	var anchor = angular.element('<a/>');
		        anchor.attr({
		            href: 'EFS/core/system/file/download_file?fileName=' + resp.file
		        })[0].click();
			},function error(err){
				$scope.showLoading = false;
			})
        }
        
        $scope.exports = function(){
        	$scope.showLoading = true;
        	
        	var exportcount = {
        		type : 'integrative',
        		mapQuery : {
        			//deviceID : ''
        		}
        	};
        	if($scope.query){
        		delEmptyInput(cacheQuery);
            	exportcount.mapQuery = angular.copy(cacheQuery);
            	if(exportcount.mapQuery.domainGroup == 'all' || !exportcount.mapQuery.domainGroup){
            		delete exportcount.mapQuery.domainGroup;
            		delete exportcount.mapQuery.deviceID;
            	}
            	if(exportcount.mapQuery.timestamp__ge){
            		exportcount.mapQuery.timestamp__ge = DateFormat(exportcount.mapQuery.timestamp__ge);
            	}
            	if(exportcount.mapQuery.timestamp__lt){
            		exportcount.mapQuery.timestamp__lt = DateFormat(exportcount.mapQuery.timestamp__lt);
            	}  
            	if(exportcount.mapQuery.deviceID){
            		exportcount.mapQuery.deviceID = exportcount.mapQuery.deviceID.deviceID;
            	}
            	if(exportcount.mapQuery.deviceID == '全部' || !exportcount.mapQuery.deviceID){
            		delete exportcount.mapQuery.deviceID;
            	}
            	if(exportcount.mapQuery.mobileNetCarrier == ' '){
            		delete exportcount.mapQuery.mobileNetCarrier;
            	}
            	if(exportcount.mapQuery.provinceID == '00'){
            		delete exportcount.mapQuery.provinceID;
            		delete exportcount.mapQuery.attributeNo;
            	}
            	if(exportcount.mapQuery.provinceID && exportcount.mapQuery.provinceID != '00'){
            		exportcount.mapQuery.provinceID = exportcount.mapQuery.provinceID * 1;
            	}
            } else {
            	exportcount.mapQuery = {};
            }
        	
        	HttpService.post('rest/common/exportcount',exportcount).then(function success(resp){
        		$scope.showLoading = false;
        		if(resp.hasMore){
        			DialogService.showConfirm(
        				'提示',
        				'只能导出前五千条记录！',
        				function yesCallback(){
        					exportData();
        				},
        				function noCallback(){
        					
        				}
        			);
        			return;
        		}else{
        			exportData();
        		}
        	})
		}
        
        function integrative(filter){
            if($scope.query){
            	delEmptyInput(cacheQuery);
            	filter.query = angular.copy(cacheQuery);
            	if(filter.query.domainGroup == 'all' || !filter.query.domainGroup){
            		delete filter.query.domainGroup;
            		delete filter.query.deviceID;
            	}
            	if(filter.query.deviceID){
            		filter.query.deviceID = filter.query.deviceID.deviceID;
            	}
            	if(filter.query.deviceID == '全部' || !filter.query.deviceID){
            		delete filter.query.deviceID;
            	}
            	if(filter.query.timestamp__ge){
            		filter.query.timestamp__ge = DateFormat(filter.query.timestamp__ge);
            	}
            	if(filter.query.timestamp__lt){
            		filter.query.timestamp__lt = DateFormat(filter.query.timestamp__lt);
            	}   
            	if(filter.query.mobileNetCarrier == ' '){
            		delete filter.query.mobileNetCarrier
            	}
            	if(filter.query.provinceID){
            		filter.query.provinceID = filter.query.provinceID *1;
            	}
            	if(filter.query.provinceID == '00'){
            		delete filter.query.provinceID;
            		delete filter.query.attributeNo;
            	}
            } else {
            	filter.query = {};
            }
        }

		$scope.getNoPagingList = function(currentPosition) {
        	var filter={pageSize:$scope.pageSize};
			$scope.showLoading = true;
			integrative(filter);
			if (currentPosition) {
				for (var property in currentPosition) {
					filter[property] = currentPosition[property];
				}
			}

            var result = HttpService.post('rest/information/efence/integrative', filter);
            result.then(function success(data){
            	$scope.showLoading = false;
           		if(!data.items){
           			DialogService.showMessage(
		                '提示',
		                '没有查询结果！',null);
		            return;
           		}else{
	           		var list = data.items;
	           		$scope.postData = data;
	           		for(var i=0; i<list.length; i++){
	           			list[i].mobileNetCarrier = mobileNetCarrier[list[i].mobileNetCarrier];
	           			list[i].timestamp = GetLocalTime(list[i].timestamp);
	           			list[i].receiveTime = GetLocalTime(list[i].receiveTime);
	           			list[i].mobileNetSystem = mobileNetSystem[list[i].mobileNetSystem];
	           		}
           		}           		
            },function error(err){
           		$scope.showLoading = false;
            })
            return result;
		};
		
		GridServiceReport.create($scope, {
			fetchData: true,
			columnDefs: [
				{
					field: 'deviceID',
					displayName: '采集设备编号',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'fullPath',
					displayName: '域组信息',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'timestamp',
					displayName: '采集时间',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'imei',
					displayName: 'IMEI',
					enableSorting:false,
					enableColumnMenu: false
				},
				{
					field: 'imsi',
					displayName: 'IMSI',
					enableSorting:false,
					enableColumnMenu: false
				},
				{
					field: 'attributeName',
					displayName: '归属地',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'mobileNetSystem',
					displayName: '终端网络类型',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'mobileNetCarrier',
					displayName: '网络运营商',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'receiveTime',
					displayName: '报文入库时间',
					enableSorting: false,
					enableColumnMenu: false
				}
			]
		});

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

		$scope.search = function() {
			delEmptyInput($scope.query);
			cacheQuery = angular.copy($scope.query);
			GridServiceReport.refresh($scope);		
		};
	}
});
