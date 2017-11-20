define(function () {
	return ['$scope', '$rootScope', '$location','i18nService', AppCtrl];

	function AppCtrl($scope, $rootScope, $location,i18nService) {
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