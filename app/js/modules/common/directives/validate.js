/**
 * Created by zhaoyang on 16/11/15.
 */
define( function () {
	return ['$q', '$timeout', validate];
	function validate($q, $timeout) {
		return {
			restrict: 'A',
			link: function ($scope, element, attr) {
				if (!$scope.validators) {
					$scope.validators = [];
				}
				$scope.validators.push(function () {
					var title = attr.validate || attr.placeholder;
					if (attr.validateNotEmpty) {
						if (_.isUndefined(element[0].value) || _.isEmpty(element[0].value)) {
							attr.$set('title', title + '不能为空');
							element.tooltip();
							element.tooltip('show');
							$timeout(function () {
								element.tooltip('destroy');
							}, 3000);
							return title + '不能为空';
						} else {
							return null;
						}
					}
				});

				$scope.validate = function () {
					var deferred = $q.defer();
					for (var i = 0; i < $scope.validators.length; i++) {
						var waring = $scope.validators[i]();
						if (waring !== null) {
							deferred.reject(waring);
							return deferred.promise;
						}
					}
					deferred.resolve();
					return deferred.promise;
				};
			}
		};
	}
});