define(function() {
	return ['$scope', '$element', 'localSession', 'HttpService', 'DialogService', 'GridService', 'DateFormat', 'EmptyInput', 'delEmptyInput', 'GetLocalTime',WarningSystemCtrl];

	function WarningSystemCtrl($scope, $element, localSession, HttpService, DialogService, GridService, DateFormat, EmptyInput, delEmptyInput,GetLocalTime) {

		$scope.query = {};
		var cacheQuery = {};
		EmptyInput($scope.query);
		$scope.showLoading = false;
		var type = {
			1 : '后台服务',
			2 : '系统资源',
			3 : '授权文件'
		}
		$scope.query.type = '0';
		
		var field = {
			'type' : '告警分类',
			'cause' : '告警原因',
			'timestamp' : '告警时间'
		};
		
		$scope.getPagingList = function(currentPage, pageSize, sort) {
			$scope.showLoading = true;
			var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.query = angular.copy(cacheQuery);
            	filter.order_by = ['-timestamp'];
            	if($scope.query.type == '0'){
            		delete filter.query.type;
            	}
            	if(filter.query.type){
            		filter.query.type = filter.query.type * 1;
            	}
            	if(filter.query.timestamp__ge){
            		filter.query.timestamp__ge = DateFormat(filter.query.timestamp__ge);
            	}
            	if(filter.query.timestamp__lt){
            		filter.query.timestamp__lt = DateFormat(filter.query.timestamp__lt);
            	}	            	
            }
            var result = HttpService.post('rest/alarm/system/search',filter);
            result.then(function success(resp){
            	$scope.showLoading = false;
           		var list = resp.items;
           		for(var i=0; i<list.length; i++){
           			list[i].timestamp = GetLocalTime(list[i].timestamp);
           			list[i].type = type[list[i].type]
	            }
            },function error(err){
            	$scope.showLoading = false;
            })
            return result;
		};
		
		var exports = function(){
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "系统告警-"+times,
			    fields: field,
			    fileName: "WarningDevicePageList-"+times+".xlsx",
			    sheetName: "Sheet1",
			    pager: {
			        //query: $scope.query
			    }			    
			}
			if($scope.query){
            	filter.pager.query = angular.copy(cacheQuery);
            	if($scope.query.type == '0'){
            		delete filter.pager.query.type;
            	}
            	if(filter.pager.query.type){
            		filter.pager.query.type = filter.pager.query.type * 1;
            	}
            	if(filter.pager.query.timestamp__ge){
            		filter.pager.query.timestamp__ge = DateFormat(filter.pager.query.timestamp__ge);
            	}
            	if(filter.pager.query.timestamp__lt){
            		filter.pager.query.timestamp__lt = DateFormat(filter.pager.query.timestamp__lt);
            	}	            	
            }
			HttpService.post('rest/alarm/system/export',filter).then(function success(resp) {
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
		
		GridService.create($scope, {
			fetchData: true,
			columnDefs: [{
					field: 'type',
					displayName: '告警分类',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'cause',
					displayName: '告警原因',
					enableSorting: false,
					enableColumnMenu: false
				},
				{
					field: 'timestamp',
					displayName: '告警时间',
					enableHiding: false,
					enableSorting: false,
					enableColumnMenu: false
				}
			],
			btnTools: [{
					//css: 'fa fa-fw fa-refresh',
					src : 'images/refresh.png',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				}, 
				{
					src: 'images/exports.png',
					tooltip: '导出',
					method: exports
				}
			]
		});

		$scope.remove = function() {
			WarningService.remove($scope.gridapi.getSelectedRows(), $scope);
		};

		$scope.search = function() {
			cacheQuery = angular.copy($scope.query);
			delEmptyInput($scope.query);
			GridService.refresh($scope);
		};
	}
});