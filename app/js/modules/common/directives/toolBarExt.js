/**
 * Created by zhaoyang on 16/7/30.
 */
define(function () {
	return [toolBarExt];

	function toolBarExt() {
		return {
			require: '^^toolBar',
			restrict: 'E',
			transclude: true,
			templateUrl: 'js/modules/common/templates/toolBarExt.html',
			link: function ($scope, element, attrs, ctrl) {
				$scope.search = function () {
					ctrl.search();
				};
			}
		};
	}
});