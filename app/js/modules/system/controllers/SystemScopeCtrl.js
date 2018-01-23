define(
	function () {
		return ['$scope', 'HttpService', 'GridService', 'DialogService', 'ModalService', 'SystemService',SystemScopeCtrl];

		function SystemScopeCtrl($scope, HttpService, GridService, DialogService, ModalService, SystemService) {
			
			$scope.addDomain = false;
			$scope.query = {};	
			$scope.group = {};
			var parentID = '';
			var postData = {};
			$scope.toggle = function (scope) {
		        scope.toggle();
		    };
		    var filter = {};
		    filter.adCode = '00';
		    
		    
		    
		    HttpService.get('rest/system/domain/gettree',filter).then(function success(resp){
		    	$scope.data = [];
		    	$scope.data.push(resp);
		    })
		    var groupAdd = function(scope){
		    	ModalService.showModal({
                    templateUrl: 'system/templates/scope_form.html',
                    controller: 'SystemScopeFormCtrl',
                    inputs:{
                        title:'添加组',
                        parentID:parentID
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                        GridService.refresh($scope);
                    });
                });
		    }
		    
		    var remove = function(){
		    	var selection = $scope.gridApi.selection.getSelectedRows();
				if (selection.length <= 0) {
					DialogService.showMessage(
		                '提示',
		                '请至少选择一条进行操作！',null)
					return;
				}else{
					ids=[];
                    for (var i in selection){
                        ids.push(selection[i].adCode);
                    }
					ModalService.showModal({
	                    templateUrl: 'system/templates/scope_delete.html',
	                    controller: 'SystemScopeDeleteCtrl',
	                    inputs:{
	                        title:'删除域组',
	                        parentID:ids
	                    }
	                }).then(function(modal) {
	                    modal.close.then(function(result) {
	                        GridService.refresh($scope)
	                    });
	                });
				}
		    };
		    var edit = function(){
		    	var selection = $scope.gridApi.selection.getSelectedRows();
				if (selection.length <= 0 || selection.length >1) {
					DialogService.showMessage(
		                '提示',
		                '请选择一条进行编辑！',null)
					return;
				}else{
					var rid = selection[0];
					ModalService.showModal({
	                    templateUrl: 'system/templates/scope_form.html',
	                    controller: 'SystemScopeEditCtrl',
	                    inputs:{
	                        title:'编辑组',
	                        user:rid
	                    }
	                }).then(function(modal){
	                	modal.close.then(function(result){
	                		GridService.refresh($scope);
	                	})
	                })
				}
		    };
		    
		    $scope.add = function(scope){		    	
		    	var data = scope.$modelValue;		    	
		    	if(data.adCode == ''){
		    		data.adCode = '00'
		    	}
		    	postData.adCode = data.adCode;		    	
		    	if(data.adCode.length < 6){
		    		$scope.addDomain = true;
		    		$scope.addGroup = false;
		    		HttpService.get('rest/system/domain/getlist',postData).then(function success(resp){
			    		$scope.list = resp;
			    	});
			    	return;
		    	}else{
		    		$scope.addDomain = false;
		    		$scope.addGroup = true;
		    		parentID = data.adCode;
		    		
		    		$scope.getPagingList = function(currentPage, pageSize, sort) {
		    			var filter = {};
						filter = {
							page_size: pageSize,
							page_no: currentPage,
							order_by:['adCode']
						};
						if(postData){
							filter.query = postData;
						}
						var result = HttpService.post('rest/system/domain/grouplist', filter);
						result.then(function success(resp){
						})
						return result;
					};
					
					GridService.create($scope, {
						fetchData: true,
						columnDefs: [
							{
								field: 'name',
								displayName: '组名称',
								enableSorting: false,
								enableColumnMenu: false
							},
							{
								field: 'center',
								displayName: '中心点',
								enableSorting: false,
								enableColumnMenu: false
							},
							{
								field: 'description',
								displayName: '描述信息',
								enableSorting: false,
								enableColumnMenu: false
							}
						],
						btnTools: [
							{
						    	//css:'fa fa-fw fa-plus-circle',
						    	src : 'images/add.png',
						    	tooltip:'添加',
						    	method:groupAdd
						    },
							{
						    	//css:'fa fa-fw fa-minus-circle',
						    	src : 'images/remove.png',
						    	tooltip:'删除',
						    	method:remove
					    	},
					    	{
						    	//css:'fa fa-fw fa-pencil',
						    	src : 'images/edit.png',
						    	tooltip:'编辑',
						    	method:edit
					    	}
						]			
					});	
		    		GridService.refresh($scope);
		    	}
		    }		    
		    $scope.domainAdd = function(){
		    	var oRadio=document.getElementsByName("choose");
		    	var data = {};
				for(var i=0;i<oRadio.length;i++){
				  if(oRadio[i].checked){
				  		var code = oRadio[i].nextSibling.nextSibling.attributes.value.value;
				  		data.adCode = code;
				  	};
				}
				SystemService.saveOrUpdateUser('rest/system/domain/adddomain',data).then(function success(resp){
					HttpService.get('rest/system/domain/gettree',filter).then(function success(resp){
						$scope.data = [];
				    	$scope.data.push(resp);
				    	$scope.addDomain = false;
		    			$scope.addGroup = false;
				    })
				})
		    }
		    
		    $scope.delete = function(scope){
		    	var data = scope.$modelValue;
		    	ModalService.showModal({
                    templateUrl: 'system/templates/scope_delete.html',
                    controller: 'SystemScopeDeleteCtrl',
                    inputs:{
                        title:'删除域组',
                        parentID:data.adCode,
                        row : {}
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                        HttpService.get('rest/system/domain/gettree',filter).then(function success(resp){
				    		$scope.data = [];
				    		$scope.data.push(resp);
				    	});
                    });
                });
		    }
		    
		    
		   
		}
	});
