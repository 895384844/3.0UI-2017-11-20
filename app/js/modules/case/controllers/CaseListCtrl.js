define(
	function() {
		return ['$scope', 'i18nService', '$lt', '$filter', 'localSession', 'GridService', 'DialogService', 'ModalService', 'HttpService', 'SystemService', '$http', 'EmptyInput', 'delEmptyInput', CaseListCtrl];

		function CaseListCtrl($scope, i18nService, $lt, $filter, localSession, GridService, DialogService, ModalService, HttpService, SystemService, $http, EmptyInput, delEmptyInput) {

		$scope.gridItemData = {};
		$scope.query = {};
		$scope.selectData = {};
		var cacheQuery = {};
		var toogle = document.getElementsByClassName('sidebar-toggle')[0];

		$scope.isActive = true;
		$scope.isShow = false;
		
		onWinResize();
		
		function onWinResize(){
			var winWid = window.outerWidth;
			if(winWid > 1900){
				$scope.isShow = false;
			}else{
				$scope.isShow = true;
			}		
		}
		window.addEventListener("resize",onWinResize);
		
		$scope.toogleH = function(){			
			$scope.isActive = !$scope.isActive;
		}

		EmptyInput($scope.query);

		var field = {
			'code': '案件编号',
			'name': '案件名',
			'fullPath': '所属域',
			'reference': '业务编号',
			'time': '案发时间',
			'location': '案发地点',
			'type': '案件类型',
			'description': '备注'
		};

		$scope.getPagingList = function(currentPage, pageSize, sort) {
			var filter = {
				page_size: pageSize,
				page_no: currentPage,
				order_by: ['-created']
			};
			if($scope.query) {
				filter.query = angular.copy(cacheQuery);
			}
			var result = HttpService.post('rest/case/case/search', filter);
			result.then(function success(data) {
				var list = data.items;
			})
			return result;
		};

		var remove = function() {
	var selection = $scope.gridApi.selection.getSelectedRows();
	if(selection.length <= 0) {
		DialogService.showMessage(
			'提示',
			'请至少选择一条进行操作！', null)
		return;
	} else {
		DialogService.showConfirm(
			'确认信息',
			'确定要删除吗？',
			function() {
				ids = [];
				selection = $scope.gridApi.selection.getSelectedRows();
				for(var i in selection) {
					ids.push(selection[i].id);
				}
				HttpService.get('rest/case/case/delete', {
						id: ids
					}).then(function success(data) {
							GridService.refresh($scope);
						},
						function failure(errorResponse) {

						})
					.finally(function() {

					});
			}, null);
	}
};

var add = function() {
	ModalService.showModal({
		templateUrl: 'case/templates/case_list_form.html',
		controller: 'CaseListFormCtrl',
		inputs: {}
	}).then(function(modal) {
		modal.close.then(function(result) {
			GridService.refresh($scope);
		});
	});
};
var edit = function() {
	var selection = $scope.gridApi.selection.getSelectedRows();
	if(selection.length <= 0 || selection.length > 1) {
		DialogService.showMessage(
			'提示',
			'请选择一条进行编辑！', null)
		return;
	} else {
		var rid = selection[0];
		ModalService.showModal({
			templateUrl: 'case/templates/case_list_form.html',
			controller: 'CaseListEditCtrl',
			inputs: {
				title: '编辑用户',
				postData: rid
			}
		}).then(function(modal) {
			modal.close.then(function(result) {
				GridService.refresh($scope);
			})
		})
	}
};

var exports = function() {
	var myDate = new Date();
	var times = myDate.toLocaleString();
	times = times.replace(/\s|:|\//g, "_");
	var filter = {
		title: "案件管理-" + times,
		fields: field,
		fileName: "CaseListPageList-" + times + ".xlsx",
		sheetName: "Sheet1",
		pager: {
			query: angular.copy(cacheQuery)
		}
	}
	HttpService.post('rest/case/case/export', filter).then(function success(resp) {
		var filter = {
			fileName: resp.file
		};
		var anchor = angular.element('<a/>');
		anchor.attr({
			href: 'EFS/core/system/file/download_file?fileName=' + resp.file
		})[0].click();
	})
}

GridService.create($scope, {
	fetchData: true,
	columnDefs: [

		{
			field: 'code',
			displayName: '案件编号',
			enableSorting: false,
			enableColumnMenu: false
		},
		{
			field: 'name',
			displayName: '案件名',
			enableSorting: false,
			enableColumnMenu: false
		},
		{
			field: 'fullPath',
			displayName: '所属域',
			enableSorting: false,
			enableColumnMenu: false
		},
		{
			field: 'reference',
			displayName: '业务编号',
			enableSorting: false,
			enableColumnMenu: false
		},
		{
			field: 'time',
			displayName: '案发时间',
			enableSorting: false,
			enableColumnMenu: false
		},
		{
			field: 'location',
			displayName: '案发地点',
			enableSorting: false,
			enableColumnMenu: false
		},
		{
			field: 'type',
			displayName: '案件类型',
			enableSorting: false,
			enableColumnMenu: false
		},
		{
			field: 'description',
			displayName: '备注',
			enableSorting: false,
			enableColumnMenu: false
		}
	],
	btnTools: [{
			//css:'fa fa-fw fa-refresh',
			src: 'images/refresh.png',
			tooltip: '刷新',
			method: function() {
				GridService.refresh($scope);
			}
		},
		{
			//css:'fa fa-fw fa-plus-circle',
			src: 'images/add.png',
			tooltip: '添加',
			method: add
		},
		{
			//css:'fa fa-fw fa-minus-circle',
			src: 'images/remove.png',
			tooltip: '删除',
			method: remove
		},
		{
			//css:'fa fa-fw fa-pencil',
			src: 'images/edit.png',
			tooltip: '编辑',
			method: edit
		},
		{
			//css:'fa fa-fw fa-share-square-o',
			src: 'images/exports.png',
			tooltip: '导出',
			method: exports
		}
	]

});

$scope.search = function() {
	delEmptyInput($scope.query);
	cacheQuery = angular.copy($scope.query);
	GridService.refresh($scope);
};
		}
	});