/**
 * Created by zhaoyang on 16/7/30.
 */
define(function () {
	return [toolBar];

	function toolBar() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				doSearch: '&?'
			},
			transclude: {
				'buttonsBar': '?buttonsBar',
				'extBar': '?extBar'
			},
			templateUrl: 'js/modules/common/templates/toolBar.html',
			link: function ($scope, element, attrs, ctrl) {
			},
			controller: ['$scope', '$transclude', function ($scope, $transclude) {
				$scope.extBarExist = $transclude.isSlotFilled('extBar');
				$scope.hideExtToolbar = true;
				$scope.toggleExtToolbar = function () {
					this.hideExtToolbar = !this.hideExtToolbar;
				};

				$scope.search = function () {
					if ($scope.doSearch && _.isFunction($scope.doSearch)) {
						$scope.doSearch();
					}
				};

				this.search = function () {
					$scope.search();
				};
			}]
		};
	}
});