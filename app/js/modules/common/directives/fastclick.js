define(['fastclick'],function(){
    'use strict';

    function myxFastClick($document) {
        return {
            scope: {
                hoverClass: '@'
            },
            link: function(scope, elem, attr) {
                FastClick.attach(elem[0]);
                scope.hoverClass = scope.hoverClass || 'text-blue-primary';

                elem.bind('mouseover', function(){
                   elem.addClass(scope.hoverClass);
                });
                elem.bind('mouseout', function(){
                   elem.removeClass(scope.hoverClass);
                });
            }
        };
    }

    return ['$document', myxFastClick];
});
