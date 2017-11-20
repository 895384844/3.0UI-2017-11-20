define(['../../common/utils/md5'],function (md5) {
       
    return ['$scope', '$location','$interval', 'MENU_GROUPS', 'HttpService', 'ModalService', 'DialogService','SessionService', 'localSession','SectionsService', HeaderCtrl];
	
	function HeaderCtrl($scope, $location, $interval, menuGroups, HttpService, ModalService, DialogService,SessionService, localSession,SectionsService) {


		//Alarm statistics 
		$scope.alarm_count={};
		$scope.username = sessionStorage.getItem('username');

		var getNewAlarmCount=function(){
			if($scope.page.type!='edit'){
				return;
			}
			HttpService.get('device/alarm/getNewAlarmCount').then(function (data) {
				$scope.alarm_count=data;
			});
		};
		getNewAlarmCount();
		var intervalGetNewAlarmCount=$interval(getNewAlarmCount,1000*10);
		 $scope.$on("$destroy", function() {
            if(!!intervalGetNewAlarmCount){
                $interval.cancel(intervalGetNewAlarmCount); 
            }
        });
		
		//Log out 
		$scope.logout = function () {
			DialogService.showConfirm(
                '退出',
                '是否退出系统？',
                function() {
                    SessionService.logout();
                }, null
            );
			
		};
		
		SessionService.on('logout:success', function() {
			SectionsService.clearSection();
			$scope.$destroy();
        });

		//$scope.userName = localSession.user.name;

		$scope.addSection = function (section) {
			$location.path('/' + section.id);
		};
		
		var about = {};
		HttpService.post('rest/system/info/showAbout').then(function success(resp){					
			about = resp;
			return about;
		})

		$scope.lockScreen = function () {
			ModalService.showModal({
				templateUrl: 'app/templates/about.html',
				controller: 'AboutCtrl',
				inputs: {
					title: '关于我们',
					query: about
				}
			}).then(function(modal) {
				modal.close.then(function(result) {
				//	GridService.refresh($scope);
				});
				
			});
		};
		$scope.showChangePwd = function () {
			$scope.pwd = {};
			ModalService.show(
				{
					title: '修改密码',
					template: 'js/modules/app/templates/change_password.html',
					scope: $scope

				}
			);
		};


		$scope.changePassword = function () {
			var pwd={
				'old':md5[0]($scope.pwd.old).toUpperCase(),
				'new':md5[0]($scope.pwd.new).toUpperCase()
			};
			HttpService.post('/system/user/changepwd', pwd).then(function () {
				SessionService.logout();
			});
		};
		$scope.clear = function () {
			$scope.pwd = {};
		};


		$scope.showSystemInfo = function () {
			OverlayService.show(
				{
					title: '系统信息',
					template: 'js/modules/app/templates/sysinfo.html',
					scope: $scope

				}
			);
		};
		if (sessionStorage.length > 0) {
			localSession.user = JSON.parse(sessionStorage.getItem('user'));
			localSession.token = sessionStorage.getItem('token');
			localSession.role = JSON.parse(sessionStorage.getItem('role'));
			localSession.monitor = JSON.parse(sessionStorage.getItem('monitor'));
		}
		$scope.localSession = localSession;
		$scope.menuGroups = menuGroups;

	}
});