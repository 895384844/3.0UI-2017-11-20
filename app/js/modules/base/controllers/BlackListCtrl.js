define(function() {
	return ['$scope', 'HttpService', 'AlertService', 'DialogService', 'ModalService', 'EmptyInput', 'delEmptyInput', BlackListCtrl];

	function BlackListCtrl($scope, HttpService, AlertService, DialogService, ModalService, EmptyInput, delEmptyInput) {

		$scope.query = {};
		EmptyInput($scope.query);
		$scope.isActive = true;
		$scope.isShow = true;
		$scope.isChoose = false;
		var cacheQuery = {};
		$scope.showLoading = false;
		$scope.pageSize = '10';
		$scope.pageNo = 1;
		$scope.count = 0;
		$scope.hasNext = true;
		$scope.hasPrevious = true;
		$scope.type = 'imsi';
		var box = document.getElementsByClassName('boxs');
		
		HttpService.get('rest/case/case/get').then(function success(resp){
			resp.splice(0,0,{name:"全部",code:''},{name:"未指定",code:'0'});
			$scope.caseList = resp;
			$scope.query.caseCode = '';
		})
		
		$scope.clearVal = function(){
			$scope.val = '';
		}
		
		$scope.getData = function() {
			$scope.showLoading = true;
			var filter = {
				page_size: $scope.pageSize*1,
				page_no: $scope.pageNo,
				order_by:['-_id']
			};
			filter.query = cacheQuery;
			if($scope.val){
				if($scope.type == 'imsi'){
					filter.query.imsi = $scope.val;
				}else if($scope.type == 'imei'){
					filter.query.imei = $scope.val;
				}else if($scope.type == 'mac'){
					filter.query.mac = $scope.val;
				}else if($scope.type == 'plate'){
					filter.query.plate = $scope.val;
				}
			}
			var result = HttpService.post('rest/surveillance/target/search', filter);
			result.then(function success(resp) {
				$scope.showLoading = false;
				$scope.pageNo = resp.page_no;
				$scope.count = resp.count;
				$scope.gridData = resp.items;
				if($scope.pageSize * $scope.pageNo < resp.count){
					$scope.hasNext = false;
				}else{
					$scope.hasNext = true;
				}
				if($scope.pageNo == 1){
					$scope.hasPrevious = true;
				}else{
					$scope.hasPrevious = false;
				}
				//console.log(resp)
			}, function error(err) {
				$scope.showLoading = false;
			});
			return result;
		}

		$scope.getData();

		function addClasses(ele, cName) {
			var arr = ele.className.split(' ').concat(cName.split(" "));
			for(var i = 0; i < arr.length; i++) {
				for(var k = arr.length - 1; k > i; k--) {
					(arr[k] === "") && arr.splice(k, 1);
					(arr[i] === arr[k]) && arr.splice(k, 1);
				}
			}
			ele.className = arr.join(" ");
		}

		function removeClasses(ele, cName) {
			var arr1 = ele.className.split(' ');
			var arr2 = cName.split(" ");
			for(var i = 0; i < arr2.length; i++)
				for(var j = arr1.length - 1; j >= 0; j--)(arr2[i] === arr1[j]) && arr1.splice(j, 1)
			ele.className = arr1.join(" ")
		}

		function contains(arr, obj) {
			var i = arr.length;
			while(i--) {
				if(arr[i] === obj) {
					return true;
				}
			}
			return false;
		}

		function removeByValue(arr, val) {
		  	for(var i=0; i<arr.length; i++) {
			    if(arr[i] == val) {
				    arr.splice(i, 1);
				    break;
			    }
		  	}
		}
		var delObj = [];
		$scope.choose = function(idx) {
			var classes = box[idx].classList;	
			if(contains(classes, 'active-box')) {
				removeClasses(box[idx], 'active-box');
				removeByValue(delObj,$scope.gridData[idx].id);
				console.log(delObj)
			} else {
				addClasses(box[idx], 'active-box');
				delObj.push($scope.gridData[idx].id);
			};
		}

		var field = {
			'name': '姓名',
			'imsi': 'IMSI',
			'imei': 'IMEI'
		};
		
		$scope.nextPage = function(){
			$scope.pageNo += 1;
			$scope.getData();
		}
		
		$scope.previousPage = function(){
			if($scope.pageNo <= 1){
				$scope.hasPrevious = true;
			}else{
				$scope.pageNo -= 1;
				$scope.getData();
			}
		}

		$scope.add = function() {
			ModalService.showModal({
				templateUrl: 'base/templates/black_list_form.html',
				controller: 'BlackListFormCtrl',
				inputs: {
					title: '新建黑名单',
					datas: {}
				}
			}).then(function(modal) {
				modal.close.then(function(result) {
					$scope.getData();
				});
			});
		};
		$scope.remove = function() {
			if(delObj.length <= 0) {
				DialogService.showMessage(
					'提示',
					'请至少选择一条进行操作！', null)
				return;
			} else {
				DialogService.showConfirm(
					'确认信息',
					'确定要删除吗？',
					function() {
						HttpService.get('rest/surveillance/target/delete', {
								id: delObj
							}).then(function success(data) {
									delObj = [];
									$scope.getData();
								},
								function failure(errorResponse) {

								})
							.finally(function() {

							});
					}, null);
			}
		};
		$scope.edit = function(idx) {
			ModalService.showModal({
				templateUrl: 'base/templates/black_list_edit.html',
				controller: 'BlacklistEditCtrl',
				inputs: {
					title: '编辑黑名单',
					datas: $scope.gridData[idx] //rid
				}
			}).then(function(modal) {
				modal.close.then(function(result) {
					$scope.getData();
				});
			});
		};

		var imports = function() {
			ModalService.showModal({
				templateUrl: 'device/templates/device_import.html',
				controller: 'BlackListImportCtrl'
			}).then(function(modal) {
				modal.close.then(function(result) {
					$scope.getData();
				});
			})
		};
		
		$scope.setPageSize = function(){
			$scope.getData();
		}

		var exports = function() {
			$scope.showLoading = true;
			var myDate = new Date();
			var times = myDate.toLocaleString();
			times = times.replace(/\s|:|\//g, "_");
			var filter = {
				title: "重点人员布控-" + times,
				fields: field,
				fileName: "BlackListPageList-" + times + ".xlsx",
				sheetName: "Sheet1",
				pager: {
					//query: $scope.query
				}
			}
			HttpService.post('rest/surveillance/efence/export', filter).then(function success(resp) {
				$scope.showLoading = false;
				var filter = {
					fileName: resp.file
				};
				var anchor = angular.element('<a/>');
				anchor.attr({
					href: 'EFS/core/system/file/download_file?fileName=' + resp.file
				})[0].click();
			}, function error(err) {
				$scope.showLoading = false;
			})
		}

		$scope.search = function() {
			delEmptyInput($scope.query);
			cacheQuery = angular.copy($scope.query);			
			$scope.getData();
		};
	}
})