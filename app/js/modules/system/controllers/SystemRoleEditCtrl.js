define(
	function () {
		return ['$scope', 'HttpService', 'SystemService','close', SystemRoleEditCtrl];
		function SystemRoleEditCtrl($scope, HttpService,SystemService,close) {


			/*$scope.userInfo = angular.copy(userInfo);
			
			

			$scope.save = function () {
				SystemService.saveOrUpdateUser('system/user/save', $scope.userInfos).then(function success(data) {
					close();
				});
			};

			$scope.reset = function () {
				$scope.userInfo = angular.copy(userInfo);
				
			};*/
			
			$scope.title = "编辑角色";

			$scope.close=close;

			/*$scope.togglePassword = function (id, span) {
				var pwd = $('#' + id);
				if (pwd.attr('type') == 'password') {
					pwd.attr('type', 'text');
					span.target.textContent = '~#_#';
				} else {
					pwd.attr('type', 'password');
					span.target.textContent = '~0_0';
				}
			};
			

			SystemService.getScopes({}).then(function success(data) {
				$scope.scopesChoice = data.items;
			});

			SystemService.getRoles().then(function (data) {
				$scope.rolesChoice = data;
			});*/

		}
	});
