define(['datetimepicker'],function(datetimepicker) {
	return ['$scope', 'DialogService', 'i18nService', '$lt', '$filter', 'GridServiceNoCount', 'GridServiceReport', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','EmptyInput','delEmptyInput','GetLocalTime','groupSelect', '$http',VehicleCtrl];

	function VehicleCtrl($scope, DialogService, i18nService, $lt, $filter, GridServiceNoCount, GridServiceReport, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,EmptyInput,delEmptyInput,GetLocalTime,groupSelect,$http) {

		$scope.gridItemData = {};
		$scope.query = {};
		EmptyInput($scope.query);
		var str = "'hidden'";
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
		//$scope.isShow = true;
		$scope.isPlate = false;
		$scope.showLetters = false;
		var cacheQuery = {};
		var condition = document.getElementsByClassName('condition')[0];
		
		$scope.hideUl = function(event){
			if(!event){
				event=window.event;
			}
			event.cancelBubble=true;  
			if(event.target.tagName != 'INPUT'){
				$scope.showLetters = false;
			}
		}
		
		var getprovince = {
			adCode : '00'
		};
		$scope.count = 0;
		
		$scope.clear = function(){
			$scope.query = {};
			$scope.attribute = false;
			$scope.isDeviceID = false;
		}
		
		if(window.outerWidth < 1900){
			$scope.isShow = true;
		}else{
			$scope.isShow = false;
		}
		
		HttpService.get('rest/system/domain/scopelist',getprovince).then(function success(resp){
			resp.splice(0,0,{name:"全国",adCode:'00'},{name:"境外",adCode:'1'});
			$scope.province = resp;
			$scope.query.provinceID = '00';
		});
		
		$scope.refresh = function(){
			GridServiceReport.refresh($scope);
		}
		
		$http.get('testJson/carScope.json').then(function(resp) {
			//$scope.carScope = resp.data
			for(i in resp.data){
				resp.data[i].name = i;
			}
			$scope.carScope = resp.data;	
			$scope.query.provinceID = '00';
		});
		
		/*$scope.plate = function(){
			if($scope.query.provinceID == '00' || !$scope.query.provinceID || $scope.query.provinceID == '0'){
				$scope.isPlate = false;
				$scope.attribute = false;
				if($scope.isPlate || $scope.attribute || $scope.isDeviceID){
					$scope.isShow = true;
				}else{
					$scope.isShow = false;
				}
			}else{
				$http.get('testJson/carScope.json').then(function(resp) {
					var letters = [];
					$scope.isPlate = true;
					$scope.attribute = true;
					$scope.isShow = true;
					for(i in resp.data){
						if($scope.query.provinceID == resp.data[i].root){							
							delete resp.data[i].root;
							for(j in resp.data[i]){
								letters.push(j);
							}
						};
					};
					if(letters.length == 0){
						$scope.showLetters = false;
					}
					$scope.letterList = letters;
					$scope.letterList.splice(0,0,'全部');
					$scope.query.initialLetter = '全部';
				});
			}
		}*/
		
		$scope.chooseLetter = function(val){
			$scope.query.initialLetter = val;
			$scope.showLetters = false;
			if($scope.query.initialLetter != '全部'){
				$scope.query.attributeNo = ''	
			}
		}
		
		$scope.showLetterList = function(){
			$scope.showLetters = true;
		}
		
		$scope.hideLetterList = function(){
			$scope.showLetters = false;
		}
		
		$scope.emptyLetter = function(){
			if($scope.query.attributeNo){
				$scope.query.initialLetter = '全部';
			}
		}
		
		$scope.addActiveClass = function(idx){
			var lis = document.getElementsByClassName('activeLi');
		    for(var i=0;i<lis.length;i++){
				if(i == idx){
					lis[i].classList.add("activeLis");
				}else{
					lis[i].classList.remove("activeLis");
				}
			}
	   	}
		
		$scope.showAttribute = function(){
			$scope.showLetters = false;
			if($scope.query.provinceID == '00' || $scope.query.provinceID == '1'){
				$scope.attribute = false;
				$scope.isPlate = false;
				if($scope.isDeviceID){
					$scope.isShow = true;
				}else{
					$scope.isShow = false;
				}
			}else{
				$scope.attribute = true;
				$scope.isPlate = true;
				$scope.isShow = true;
				var getAttribute = {
					adCode : $scope.query.provinceID
				}
				HttpService.get('rest/system/domain/scopelist',getAttribute).then(function success(resp){
					resp.splice(0,0,{name:"全部",areaCode:''})
					$scope.attribute = resp;
					$scope.attributeNo = '';
				});
				$http.get('testJson/carScope.json').then(function(resp) {
					var letters = [];
					$scope.isPlate = true;
					$scope.attribute = true;
					$scope.isShow = true;
					for(i in resp.data){
						if($scope.query.provinceID == resp.data[i].root){							
							delete resp.data[i].root;
							for(j in resp.data[i]){
								letters.push(j);
							}
						};
					};
					if(letters.length == 0){
						$scope.showLetters = false;
					}
					$scope.letterList = letters;
					$scope.letterList.splice(0,0,'全部');
					$scope.query.initialLetter = '全部';			
				});
			}
		}
		
		var field = {
			'deviceID' : '采集设备编号',
			'timestamp' : '采集时间',
			'plate' : '车牌号',
			'plateColor' : '车牌颜色',
			'vehicleColor' : '车身颜色',
			'attributeName' : '归属地',
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
        		if($scope.isPlate || $scope.attribute){
					$scope.isShow = true;
				}else{
					$scope.isShow = false;
				}
        	}else{
        		$scope.isDeviceID = true;	
        		$scope.isShow = true;
        		HttpService.get('rest/device/efence/get',{type:'vehicle',group:data}).then(function success(resp){
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
				title: "车辆信息查询-"+times,
			    fields: field,
			    fileName: "VehiclePageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: $scope.query
			    }
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	integrative(filter.pager);
            }
			return HttpService.post('rest/information/vehicle/integrative_export',filter).then(function success(resp) {
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
            	if(exportcount.mapQuery.initialLetter){
            		exportcount.mapQuery.initialLetter = exportcount.mapQuery.initialLetter.toUpperCase();
            	}
            	if(exportcount.mapQuery.initialLetter == '全部'){
            		delete exportcount.mapQuery.initialLetter;
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
            	if(filter.query.provinceID){
            		filter.query.provinceID = filter.query.provinceID *1;
            	}
            	if(filter.query.provinceID == '00'){
            		delete filter.query.provinceID;
            		delete filter.query.attributeNo;
            	}
            	if(filter.query.initialLetter){
            		filter.query.initialLetter = filter.query.initialLetter.toUpperCase();
            	}
            	if(filter.query.initialLetter == '全部'){
            		delete filter.query.initialLetter;
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

            var result = HttpService.post('rest/information/vehicle/integrative', filter);
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
	           			list[i].timestamp = GetLocalTime(list[i].timestamp);
	           			list[i].receiveTime = GetLocalTime(list[i].receiveTime);
	           		}
           		}           		
            },function error(err){
           		$scope.showLoading = false;
            })
            return result;
		};
		
		$scope.set = function(row) {
			ModalService.showModal({
	            templateUrl: 'report/templates/vehicle_pic.html',
	            controller: 'VehiclePicCtrl',
	            inputs: { 
	                row : row
	            }
	        }).then(function(modal) {
	            //modal.element.modal();
	            modal.close.then(function() { 
	            	//GridService.refresh($scope);
	            });
	        });
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
					field: 'timestamp',
					displayName: '采集时间',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'plate',
					displayName: '车牌号',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'plateColor',
					displayName: '车牌颜色',
					enableSorting:false,
					enableColumnMenu: false
				},
				{
					field: 'vehicleColor',
					displayName: '车身颜色',
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
					field: 'receiveTime',
					displayName: '报文入库时间',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'fileName',
					displayName: '查看图片',
					enableSorting: false,
					enableColumnMenu: false,
					cellTemplate: '<a class="fa fa-search btn-edit" style="margin-left:15px;color:#31708f;" href ng-class="{ ' + str + ' : grid.appScope.isOpen(row.entity) }" ng-click="grid.appScope.set(row.entity)" uib-tooltip="设置" tooltip-placement="left"></a>'
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
			$scope.showLetters = false;
			delEmptyInput($scope.query);
			cacheQuery = angular.copy($scope.query);
			GridServiceReport.refresh($scope);		
		};
	}
});
