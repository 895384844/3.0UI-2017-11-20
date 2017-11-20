define(function() {
	return ['$scope', 'i18nService', '$lt', '$filter', 'GridService', 'ModalService', '$element', 'localSession', 'HttpService', 'DialogService', 'SystemService', 'DateFormat','EmptyInput','delEmptyInput', 'groupSelectMore',PartnerAnalysisCtrl];

	function PartnerAnalysisCtrl($scope, i18nService, $lt, $filter, GridService, ModalService, $element, localSession, HttpService, DialogService, SystemService, DateFormat,EmptyInput,delEmptyInput,groupSelectMore) {
		$scope.btn = {
	        status : true
	    }
		groupSelectMore();
		$scope.showDel = false;
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
	    var mobileNetCarrier = {
			0 : '移动',
			1 : '联通',
			2 : '电信',
			3 : '其它',
			4 : '境外'
		}
	    
	    HttpService.get('rest/system/domain/allgroup').then(function success(data) {
            $scope.vendorChoice = data;
        });
	    
	    $scope.unknow = {
	    	startTime : '',
	    	endTime : ''
	    }
		$scope.selectData = {};
		
		$scope.forText = function(event,scope){
        	var adCode = scope.group.adCode;
        	var target = angular.element(event.target); 
        	var txt = scope.group.name;
        	target.parent().prev().text(txt);
        	var idx = target.parents('.lis2').index();
        	$scope.query[idx].domainGroup = adCode;
        }
        $scope.forText1 = function(event,scope){
        	var adCode = scope.group.adCode       	
        	var target = angular.element(event.target); 
        	var txt = scope.group.name;
        	target.parent().prev().text(txt);
        	var options = $('.option');
        	var idx = target.parents('.lis2').index();
        	$scope.query[idx].domainGroup = adCode;
        	for(var i=0; i<options.length; i++){
        		options[i].style.cssText = 'display:none';       		
        	}
        }
        
        $scope.selectBox = function(event,scope){
        	event.stopPropagation();
        	var target = angular.element(event.target);
        	target.context.nextElementSibling.style.cssText = 'display:block'
        }
		
		$scope.currentW = true;
	    $scope.changeW = false;
	    $scope.toogleLeftState = function(){
	    	$scope.currentW = !$scope.currentW;
	    	$scope.changeW = !$scope.changeW;
	    }
	    
	    $scope.list = [];	    	    	    
	    $scope.addCondition = function(){
	    	if($('.lis').length >= 1){
	    		$scope.showDel = true;
	    	}
	    	var obj={
			        domainGroup : '',
			        startTime : '',
			        endTime : ''
		    };
			$scope.list.push(obj);
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

		$scope.delEle1 = function(event,idx){
	    	if($('.lis2').length <= 2){
				$scope.showDel = false;
			}
    		$scope.query.splice(0,1);
    		$('#rm1').find('.lis')[0].remove();
	    	
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

		GridService.create($scope, {
			fetchData: true,
			columnDefs: [
			{ field: 'imei',displayName: 'IMEI',enableSorting:false,enableColumnMenu: false },
            { field: 'imsi',displayName: 'IMSI',enableSorting:false,enableColumnMenu:false  },
            { field: 'attributeName',displayName: '归属地',enableSorting:false,enableColumnMenu: false },
            { field: 'resident',displayName: '是否为常住人口',enableSorting:false,enableColumnMenu:false  },
            { field: 'mobileNetCarrier',displayName: '终端网络提供商',enableSorting:false,enableColumnMenu: false },
            { field: 'percent',displayName: '轨迹相似度',enableHiding: false,enableSorting:false,enableColumnMenu:false },
            { 
            	field: 'operation',
            	displayName: '详情查询',
            	enableSorting:false,
            	enableColumnMenu:false,
            	cellTemplate: '<a class="fa fa-fw fa-search btn-edit" href ng-click="grid.appScope.searchDetails(row.entity)" style="margin-left:15px;color:#31708f;" uib-tooltip="详情查询" tooltip-placement="left"></a>'
            	
            }
			]
		});
		
		$scope.export = function() {
			var filter = {
				"fields": [
					"name",
					"id"
				]
			};
			HttpService.download('action/group/exportxml', filter);
		};

		$scope.edit = function() {
			var selection = $scope.gridapi.getSelectedRows();
			if(selection.length <= 0) {
				$scope.showNoItemDialog(
					$lt('提示'),
					$lt('请选择需要编辑的选项')
				);
				return;
			}

			if(selection.length > 1) {
				$scope.showNoItemDialog(
					$lt('提示'),
					$lt('最多选择一项')
				);
				return;
			}
			var rid = selection[0];
			$scope.selectData = $scope.gridapi.getSelectedData(rid);
			$scope.getgridData = $scope.gridapi.getgridData();
			var dataArray = $scope.getgridData.items;
			$.each(dataArray, function(n, data) {
				if($scope.selectData.id == data.id) {
					$scope.gridItemData = data;
					$scope.gridItemData.confirm = $scope.gridItemData.password;
				}
			});
			//$scope.gridItemData.isEdit = 'true';
			OverlayService.show({
				title: $lt('编辑用户信息'),
				template: 'js/modules/warning/templates/warning_blacklist_form.html',
				scope: $scope
			});
		};		
		
		$scope.search = function() {
			$scope.toogleLeftState();
			delEmptyInput($scope.query);			
			var postData = {};
			$scope.gridOptions.paginationCurrentPage = 1;
			$scope.getPagingList = function(currentPage, pageSize, sort) {
				var filter = {
					page_size: pageSize,
					page_no: currentPage
				};
				if($scope.query) {							
					if($scope.atype == 'known'){
						filter.complexQuery = angular.copy($scope.query);	
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
					if(resp.count == 0){
						DialogService.showConfirm(
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
					            	GridService.refresh($scope);
					            });
					        });
						}
		           	}
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