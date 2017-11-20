define(function() {
    return ['$window',dynamicHeight];

   function dynamicHeight($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) { 
                var winowHeight = $window.innerHeight; //获取窗口高度
                var headerHeight = 115;
                var footerHeight = angular.element('.main-footer').height();
                element.css('height',(winowHeight - headerHeight - footerHeight) + 'px');
                element.css('overflow-y','auto');

                var w = angular.element($window);
                w.on('resize', function() {
                    element.css('height',($window.innerHeight - headerHeight - footerHeight) + 'px');
                    scope.$apply();
                });
            }
        };
	}
});
