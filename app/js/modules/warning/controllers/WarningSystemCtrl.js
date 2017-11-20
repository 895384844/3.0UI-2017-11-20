define(function() {
	return ['$scope', '$element', 'localSession', 'HttpService', 'DialogService', 'GridService', 'DateFormat', 'EmptyInput', 'delEmptyInput', 'GetLocalTime',WarningSystemCtrl];

	function WarningSystemCtrl($scope, $element, localSession, HttpService, DialogService, GridService, DateFormat, EmptyInput, delEmptyInput,GetLocalTime) {

		$scope.query = {};
		EmptyInput($scope.query);
		var type = {
			1 : '后台服务',
			2 : '系统资源',
			3 : '授权文件'
		}
		$scope.query.type = '0';
		
		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter={page_size:pageSize,page_no:currentPage};
            if($scope.query){
            	filter.query = angular.copy($scope.query);
            	filter.order_by = ['timestamp'];
            	if($scope.query.type == '0'){
            		delete filter.query.type;
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
           		var list = resp.items;
           		for(var i=0; i<list.length; i++){
           			list[i].timestamp = GetLocalTime(list[i].timestamp);
           			list[i].type = type[list[i].type]
	            }
            })
            return result;
		};
		
		$scope.export = function() {

			var filter = {
				sheetName: '当前告警',
				title: '当前告警',
				fields: [],
				headers: $scope.config.colNames,
				query: $scope.gridapi.getSearchInfo().query,
				fileType: "xlsx"
			};
			for(var index in $scope.config.colModel) {
				filter.fields.push($scope.config.colModel[index].name);
			}
			var uri = 'device/alarm/export';
			HttpService.download(uri, filter).then(function(data) {
				$('#download_file').attr('src', 'rest/files/download?fileName=' + data.file);
			});
		};
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
					css: 'fa fa-fw fa-refresh',
					tooltip: '刷新',
					method: function() {
						GridService.refresh($scope);
					}
				}
				/*, 
								{
									css: 'fa fa-fw fa-minus-circle',
									tooltip: '删除',
									method: remove
								},
								{
									css: 'fa fa-fw fa-share-square-o',
									tooltip: '导出',
									method: remove
								},
								{
									css: 'fa fa-fw fa-download',
									tooltip: '下载',
									method: remove
								}*/
			]
		});

		$scope.remove = function() {
			WarningService.remove($scope.gridapi.getSelectedRows(), $scope);
		};

		$scope.search = function() {
			delEmptyInput($scope.query);
			GridService.refresh($scope);
		};
	}
});