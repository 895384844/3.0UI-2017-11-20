define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','EmptyInput','delEmptyInput', PartnerAnalysisCtrl];

	function PartnerAnalysisCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,EmptyInput,delEmptyInput) {
		$scope.btn = {
	        status : true
	    }
		$scope.showDel = false;
		$scope.showLoading = false;
		EmptyInput($scope.query);
		$scope.gridItemData = {};
		EmptyInput($scope.query);
		$scope.imsi = '';		
		$scope.atype = 'known';
	    $scope.query = [
	    	{
		        domainGroup : '',
		        startTime : '',
		        endTime : ''
	    	}
	    ];
	    var cacheQuery = {};
	    
	    var field = {
			'imei' : 'IMEI',
			'imsi' : 'IMSI',
			'attributeName' : '归属地',
			'resident' : '是否为常住人口',
			'mobileNetCarrier' : '网络运营商',
			'percent' : '轨迹相似度'
		}
	    
	    var mobileNetCarrier = {
			0 : '移动',
			1 : '联通',
			2 : '电信',
			3 : '其它',
			4 : '境外'
		}
	    
	    HttpService.get('rest/system/domain/allgroup').then(function success(data) {
			for(var i=0; i<data.length; i++){
				data[i].fullPath = data[i].fullPath.split('•');
				var str = data[i].fullPath[2]+"•"+data[i].fullPath[3]
				data[i].fullPath = str;
			}
            $scope.vendorChoice = data;
        });
	    
	    $scope.unknow = {
	    	startTime : '',
	    	endTime : ''
	    }
		$scope.selectData = {};
		
		$scope.currentW = true;
	    $scope.changeW = false;
	    $scope.toogleLeftState = function(){
	    	$scope.currentW = !$scope.currentW;
	    	$scope.changeW = !$scope.changeW;
	    }
	    
	    $scope.list = [];	    	    	    
	    $scope.addCondition = function(){
	    	if($('.lis2').length >= 1){
	    		$scope.showDel = true;
	    	}
	    	var obj={addElement:"addElement"};
			$scope.list.push(obj);
			if($scope.list.length > 13){
				$scope.list = $scope.list.slice(0,13);				
			}
			$scope.query = $scope.query.slice(0,1);
			$scope.query = $scope.query.concat($scope.list);
	    }
		
		$scope.delEle=function(idx){
			if($('.lis2').length <= 2){
				$scope.showDel = false;
			}
		    $scope.list.splice(idx,1);
		    $scope.query.splice(idx+1,1);
		    if($scope.list.length == 0){
		    	$scope.query = $scope.query.slice(0,1);
		    }
		}

		$scope.delEle1 = function(){
	    	if($('.lis2').length <= 2){
				$scope.showDel = false;
			}
    		$scope.query.splice(0,1);
    		$('#rm1').find('.lis')[0].remove();
	    	$scope.query.splice(0,1);
	    }		

		var add = function() {
			ModalService.showModal({
				templateUrl: 'system/templates/user_form.html',
				controller: 'SystemUserEditCtrl',
				inputs: {
					title: '新建用户',
					userInfo: {}
				}
			}).then(function(modal) {
				modal.close.then(function(result) {
					GridService.refresh($scope);
				});
			});
		};

		var exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "手机侦码伴随分析-"+times,
			    fields: field,
			    fileName: "PartnerAnalysisPageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    param: {
			        //complexQuery: $scope.query
			    }
			}
			if($scope.atype == 'known'){
				filter.param.complexQuery = angular.copy(cacheQuery);	
				filter.param.imsi = $scope.imsi+'';
				filter.param.type = 'know';
				filter.param.spanTime = $scope.spanTime;
            	angular.forEach(filter.param.complexQuery, function(data,index,array){
					if(filter.param.complexQuery[index].startTime){
        				filter.param.complexQuery[index].startTime = DateFormat(filter.param.complexQuery[index].startTime);
            		}
					if(filter.param.complexQuery[index].endTime){
						filter.param.complexQuery[index].endTime = DateFormat(filter.param.complexQuery[index].endTime);
					}
				});
			}else if($scope.atype == 'unknown'){
				filter.param.type = 'unknow';
				filter.param.imsi = $scope.imsi+'';
				filter.param.spanTime = $scope.spanTime;
				if($scope.unknow.startTime){
					var startTime = DateFormat($scope.unknow.startTime);
					filter.param.startTime = startTime;
				}
				if($scope.unknow.endTime){
					var endTime = DateFormat($scope.unknow.endTime);
					filter.param.endTime = endTime;
				}										
			}
			HttpService.post('rest/analysis/efence/accompany_export',filter).then(function success(resp) {
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
		
		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
			{ field: 'imei',displayName: 'IMEI',enableSorting:false,enableColumnMenu: false },
            { field: 'imsi',displayName: 'IMSI',enableSorting:false,enableColumnMenu:false  },
            { field: 'attributeName',displayName: '归属地',enableSorting:false,enableColumnMenu: false },
            { field: 'resident',displayName: '是否为常住人口',enableSorting:false,enableColumnMenu:false  },
            { field: 'mobileNetCarrier',displayName: '网络运营商',enableHiding: false,enableSorting:false,enableColumnMenu:false },
            { field: 'percent',displayName: '轨迹相似度',enableHiding: false,enableSorting:false,enableColumnMenu:false },
            { 
            	field: 'operation',
            	displayName: '详情查询',
            	enableSorting:false,
            	enableColumnMenu:false,
            	cellTemplate: '<a class="fa fa-fw fa-search btn-edit" href ng-click="grid.appScope.searchDetails(row.entity)" style="margin-left:15px;color:#31708f;" uib-tooltip="详情查询" tooltip-placement="left"></a>'
            	
            }
			],
			btnTools:[
		    	{
			    	//css:'fa fa-fw fa-refresh',
			    	src: 'images/refresh.png',
			    	tooltip:'刷新',
			    	method:function(){
			    		GridService.refresh($scope);
			    	}
		    	},
		    	{
			    	//css:'fa fa-fw fa-share-square-o',
			    	src: 'images/exports.png',
			    	tooltip:'导出',
			    	method:exports
		    	}
		    ]
		});
		
		$scope.search = function() {
			cacheQuery = angular.copy($scope.query);
			$scope.toogleLeftState();
			delEmptyInput($scope.query);			
			var postData = {};
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.getPagingList = function(currentPage, pageSize, sort) {
				$scope.showLoading = true;
				var filter = {
					page_size: pageSize,
					page_no: currentPage
				};
				if($scope.query) {							
					if($scope.atype == 'known'){
						filter.complexQuery = angular.copy(cacheQuery);	
						filter.imsi = $scope.imsi+'';
						filter.type = 'know';
						filter.spanTime = $scope.spanTime;
		            	angular.forEach(filter.complexQuery, function(data,index,array){
							if(filter.complexQuery[index].startTime){
	            				filter.complexQuery[index].startTime = DateFormat(filter.complexQuery[index].startTime);
		            		}
							if(filter.complexQuery[index].endTime){
								filter.complexQuery[index].endTime = DateFormat(filter.complexQuery[index].endTime);
							}					
							delEmptyInput(filter.complexQuery[index]);
						});
					}else if($scope.atype == 'unknown'){
						filter.type = 'unknow';
						filter.imsi = $scope.imsi+'';
						filter.spanTime = $scope.spanTime;
						if($scope.unknow.startTime){
							var startTime = DateFormat($scope.unknow.startTime);
							filter.startTime = startTime;
						}
						if($scope.unknow.endTime){
							var endTime = DateFormat($scope.unknow.endTime);
							filter.endTime = endTime;
						}										
					}
				}
				var result = HttpService.post('rest/analysis/efence/accompany', filter);
				result.then(function success(resp){
					$scope.showLoading = false;
					if(resp.count == 0){
						DialogService.showMessage(
			                '提示',
			                '没有查询结果！',null)
						return;
					}else{
						var postData = filter;					
						var list = resp.items;
		           		for(var i=0; i<list.length; i++){
		           			list[i].percent = list[i].percent+'%' ;
		           			list[i].mobileNetCarrier = mobileNetCarrier[list[i].mobileNetCarrier];
			            }
		           		$scope.searchDetails = function(row){
							ModalService.showModal({
					            templateUrl: 'report/templates/partnerDetail.html',
					            controller: 'PartnerDetailCtrl',
					            inputs: { 
					            	row : row,
					                data : postData
					            }
					        }).then(function(modal) {
					            //modal.element.modal();
					            modal.close.then(function() { 
					            	//GridService.refresh($scope);
					            });
					        });
						}
		           	}
				},function error(err){
					$scope.showLoading = false;
				})
				return result;
			};
			GridService.refresh($scope);
		};		
		
		$scope.showCondition = function(){
	        ModalService.showModal({
	            templateUrl: 'modals/collisionAnalysis/filter.html',
	            controller: 'collisionFilterModalCtrl'
	        }).then(function(modal) {
	            modal.element.modal();
	            modal.close.then(function(result) {     
	                if(typeof(result) !== 'undefined'){
	                    $scope.conditionArray.push(result);
	                }
	            });
	        });
	    }
	
	    $scope.removeCondition = function(index) {
	        $scope.conditionArray.splice(index,1); 
	        angular.element('.grid').trigger('resize')
	    }
	
	    $scope.known = true;
	    $scope.unknown = false;
	    $scope.tab = function() {
	        $scope.known = !$scope.known;
	        $scope.unknown = !$scope.unknown;
	    }
	}
});