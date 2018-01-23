define(function () {
	return ['$scope', '$rootScope', 'HttpService', '$location','i18nService', AppCtrl];

	function AppCtrl($scope, $rootScope, HttpService, $location,i18nService) {
		
		HttpService.get('rest/system/info/showAbout').then(function success(resp){
			$scope.version = resp.version;
		})

        HttpService.get('rest/tool/customization/get').then(function success(resp){
			$scope.copyright = resp.copyright;
		})
		
		$scope.page = {};
		$rootScope.$on('$routeChangeStart', function (event, route, prevRoute) {
			if (route.$$route) {
				$scope.page = {
					type: typeof(route.$$route.pageType) !== 'undefined' ? route.$$route.pageType : 'default'
				};
			}
		});
		i18nService.setCurrentLang("zh-cn");
	}
});