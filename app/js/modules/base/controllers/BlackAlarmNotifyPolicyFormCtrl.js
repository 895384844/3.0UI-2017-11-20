define(
	function () {
		return ['$scope', 'HttpService', 'title','userInfo','close', BlackAlarmNotifyPolicyFormCtrl];
		function BlackAlarmNotifyPolicyFormCtrl($scope, HttpService,title, userInfo,close) {


			$scope.userInfo = angular.copy(userInfo);
			$scope.title = title;
			

			

			$scope.reset = function () {
				$scope.userInfo = angular.copy(userInfo);
				
			};

			$scope.close=close;

			$scope.togglePassword = function (id, span) {
				var pwd = $('#' + id);
				if (pwd.attr('type') == 'password') {
					pwd.attr('type', 'text');
					span.target.textContent = '~#_#';
				} else {
					pwd.attr('type', 'password');
					span.target.textContent = '~0_0';
				}
			};
			

			

		}
	});
