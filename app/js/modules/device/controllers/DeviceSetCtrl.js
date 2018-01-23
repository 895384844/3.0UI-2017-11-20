define(
	function () {
		return ['$scope', 'HttpService','SystemService','close', 'DialogService', 'delEmptyInput', 'row', DeviceSetCtrl];
		function DeviceSetCtrl($scope, HttpService,SystemService,close,DialogService,delEmptyInput,row) {
			$scope.cellInfo = {};
			$scope.redirectTd = {};
			$scope.redirectFdd = {};
			$scope.redirectWCDMA = {};
			$scope.power = {};
			$scope.redirectCDMA = {};
			
			$scope.fdd = false;
			$scope.gsm = false;
			$scope.tdd = false;
			$scope.wcdma = false;
			$scope.cdma = false;
			$scope.tdcdma = false;
			$scope.isShowBox = true;
			
			$scope.showLoading = false;
			
			row.network == 'FDD-LTE' ? $scope.fdd = true : $scope.fdd = false;
			row.network == 'GSM' ? $scope.gsm = true : $scope.gsm = false;
			row.network == 'TDD-LTE' ? $scope.tdd = true : $scope.tdd = false;
			row.network == 'W-CDMA' ? $scope.wcdma = true : $scope.wcdma = false;
			row.network == 'CDMA' ? $scope.cdma = true : $scope.cdma = false;
			row.network == 'TD-SCDMA' ? $scope.tdcdma = true : $scope.tdcdma = false;
			
			if(row.network == 'GSM' || row.newwork == 'TDD-LTE' || row.network == 'CDMA' || row.network == 'TD-SCDMA'){
				$scope.isShowBox = false;
			}else{
				$scope.isShowBox = true;
			}						
			
			$scope.checkLac = function(){
				if($scope.cellInfo.lac < 0){
					DialogService.showMessage(
		                '提示',
		                '位置区码不能小于0！',null);
				}else if($scope.cellInfo.lac > 65536){
					DialogService.showMessage(
		                '提示',
		                '位置区码不能大于65536！',null);
				}
			}
			
			$scope.checkDlscode = function(){
				if($scope.cellInfo.dlscode < 0){
					DialogService.showMessage(
		                '提示',
		                '下行扰码不能小于0！',null);
				}else if($scope.cellInfo.dlscode > 511){
					DialogService.showMessage(
		                '提示',
		                '下行扰码不能大于511！',null);
				}
			}
			
			$scope.checkScode = function(){
				if($scope.cellInfo.scode < 0){
					DialogService.showMessage(
		                '提示',
		                '扰码不能小于0！',null);
				}else if($scope.cellInfo.scode > 127){
					DialogService.showMessage(
		                '提示',
		                '扰码不能大于127！',null);
				}
			}
			$scope.checkPci = function(){
				if($scope.cellInfo.pci < 0){
					DialogService.showMessage(
		                '提示',
		                '物理小区ID不能小于0！',null);
				}else if($scope.cellInfo.pci > 503){
					DialogService.showMessage(
		                '提示',
		                '物理小区ID不能大于503！',null);
				}
			}
			
			$scope.checkTac = function(){
				if($scope.cellInfo.tac < 0){
					DialogService.showMessage(
		                '提示',
		                'tac不能小于0！',null);
				}else if($scope.cellInfo.tac > 65536){
					DialogService.showMessage(
		                '提示',
		                'tac不能大于65536！',null);
				}
			}
			
			$scope.getArgument = function(type){ 

	            switch(type)
				{
				case 'power':
				    return $scope.power;
				    break;
				case 'cell':
				    return $scope.cellInfo;
				    break;
				case 'redirectTd':
				    return $scope.redirectTd;
				    break;
				case 'redirectFdd':
				    return $scope.redirectFdd;
				    break;
				case 'redirectWCDMA':
				    return $scope.redirectWCDMA;
				    break;
				case 'redirectCDMA':
					return $scope.redirectCDMA
				default:
				  
				}
	    	};
	    	
	    	$scope.creatTask = function(typeId,type){
				$scope.showLoading = true;
			    var argument = null;
				
			    if(typeId==1 || typeId==3 || typeId==5 || typeId==9 || typeId==11 || typeId==13 || typeId==15 || typeId==17 || typeId==19 || typeId==21 || typeId==23 || typeId==25){
			    				    	
	                argument = $scope.getArgument(type);
	                
	                delEmptyInput(argument);
				    var filter = {
				    	method : typeId,
				    	deviceID : row.deviceID,
				    	body : argument
				    };
				    filter.body.deviceID = row.deviceID;
				    if(filter.body.band){
				    	filter.body.band *= 1;
				    }			    
				    if(filter.body.bw){
				    	filter.body.bw *= 1;
				    }
					
			    	if(typeId == 9){
			    		var data = filter.body.move;
			    		filter.body = data;
			    		filter.body.deviceID = row.deviceID;
			    		if($('#gsm_46000').hasClass('active')){
							filter.body.plmn = '46000';
						}
						if($('#gsm_46001').hasClass('active')){
							filter.body.plmn = '46001';
						}
						delete filter.body.move;
			    	}
				    HttpService.post('rest/device/efence/get3diinfo',filter).then(function success(resp){
				    	$scope.showLoading = false;
				    	if(resp.msg == 'ok'){
				    		DialogService.showMessage(
			                '提示',
			                '设置成功！',null);
				    	}else{
				    		DialogService.showMessage(
			                '提示',
			                resp.msg,null);
				    	}				    	
				    },function error(err){
				    	$scope.showLoading = false;
				    })
	                
			    }
			    
			    
			    var data = null;
			    if(typeId == 0 || typeId == 2 || typeId == 4 || typeId == 7 || typeId == 10 || typeId == 12 || typeId == 14 || typeId == 16 || typeId == 18 || typeId == 20 || typeId == 22 || typeId == 24){
			    	data = $scope.getArgument(type);
			    	
			    	delEmptyInput(data);
				    var getData = {
				    	method : typeId,
				    	deviceID : row.deviceID,
				    	body : {}
				    };
				    
				    HttpService.post('rest/device/efence/get3diinfo',getData).then(function success(resp){
				    	$scope.showLoading = false;
				    	if(resp.data['46000']){
				    		resp.data['46000'].band = resp.data['46000'].band + '';
				    	}
				    	if(resp.data['46001']){
				    		resp.data['46001'].band = resp.data['46001'].band + '';
				    	}
				    	if(resp.code != 0){
				    		DialogService.showMessage(
				                '提示',
				                resp.msg,null);
				    	}else{
				    		if(resp.data.plmn && resp.data.plmn.length > 5){
					    		resp.data.plmn = resp.data.plmn.slice(0,5);
					    	}
					    	var result = resp.data;					    	
					    	if(type == 'cell'){
					    		if(typeId != 7){
					    			$scope.cellInfo = result;
					    			if(typeId == 10){
					    				$scope.cellInfo.mode = result.mode+'';
					    			}
					    		}else{
					    			if(result['46000']){
					    				$scope.cellInfo.move = result['46000'];
					    			}
					    			if(result['46001']){
					    				$scope.cellInfo.links = result['46001']
					    			}
					    		}
					    	}else if(type == 'redirectFdd'){
					    		$scope.redirectFdd = result;
					    	}else if(type == 'redirectTd'){
					    		$scope.redirectTd = result;
					    	}else if(type == 'redirectCDMA'){
					    		$scope.redirectCDMA = result;
					    	}else if(type == 'redirectWCDMA'){
					    		$scope.redirectWCDMA = result;
					    	}else if(type == 'power'){
					    		$scope.power = result;
					    	}
				    	}
				    },function error(err){
				    	$scope.showLoading = false;
				    })
			    };	
		};
			
			$scope.close=close;
		}
	});
