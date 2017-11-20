define(
	function () {
		return ['$scope', 'HttpService', 'row','close', SystemEditCtrl];
		function SystemEditCtrl($scope, HttpService,  row, close) {
			/*			 
			$scope.name = row.account;
		    $scope.realName = row.name;
		    $scope.mail = row.email;
		    $scope.desc = row.describle;
		    $scope.genderselected = row.male;
		    $scope.tel = row.mobile;
		
		    $scope.checkName = function(){
		    	$http({
		            method : 'POST',
		            url : '/system/userAction!checkAccount.action',
		            params : {
		                account: $scope.name
		            }
		        }).then(function(resp){
		            if(resp.data.status == 'failed'){
		               alert(resp.data.info); 
		            }
		        });
		    };
		
		    $scope.sure = function(){
		
		        var obj = {
		            enable : String(1),
		            id : row.id,
		            account : $scope.name,
		            password : row.password,
		            name : $scope.realName,
		            male : String($scope.genderselected == '男' ? 1 : 2),
		            mobile : $scope.tel,
		            email : $scope.mail,
		            describle : $scope.desc
		        };
		
		        httpServices.promise('/system/userAction!updateUser.action', obj ).then(function(resp){
				
					if(resp.data.flag){
						var result = '我是要带过去的数据！';
					    close(result,500); 
					}else{
		                alert('编辑失败！！');
					}
				});
		
		    };
		
			$scope.clear = function(){
		    	$scope.name = $scope.psw = $scope.realName = $scope.genderselected = 
		    	$scope.tel = $scope.mail = $scope.desc = null;
		    };
		
			$scope.close = function(result) {
		 	    close(result, 500); 
		    };*/
			$scope.close=close;


		}
	});
