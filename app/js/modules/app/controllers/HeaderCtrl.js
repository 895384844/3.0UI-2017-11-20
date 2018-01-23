define(['../../common/utils/md5'],function (md5) {
       
    return ['$scope', '$location','$interval', 'MENU_GROUPS', 'HttpService', 'ModalService', 'DialogService','SessionService', 'localSession','SectionsService', '$interval', HeaderCtrl];
	
	function HeaderCtrl($scope, $location, $interval, menuGroups, HttpService, ModalService, DialogService,SessionService, localSession,SectionsService,$interval) {


		//Alarm statistics 
		$scope.alarm_count={};
		$scope.username = sessionStorage.getItem('username');
		
		$scope.menus = menuGroups;
		$scope.addSection = function(section) {
			SectionsService.addActiveSection(section);
		};
		
		HttpService.get('rest/tool/customization/get').then(function success(resp){
			$scope.appTitle = resp.name;
		})

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
        
        function getSystemTime(){
        	HttpService.get('rest/center/dashboard/clock').then(function success(resp){
	        	$scope.systemTime = resp.now;
	        })
        }
        getSystemTime();
        $interval(getSystemTime,60000);
        
        function checkLicense(){
        	HttpService.get('rest/system/license/check').then(function success(resp){
        		//resp.pass
        		var license = document.getElementById('licenseStatus');
        		if(resp.pass == false){
        			license.style.background = '#f56954';	//红色
        			DialogService.showMessage(
		                '提示',
		                resp.message,null)
        		}else{
        			license.style.background = '#16d37d'	//绿色
        		}
        		
        	})
        }
        checkLicense();
		
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
		
		var about = {};
		HttpService.get('rest/system/info/showAbout').then(function success(resp){					
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