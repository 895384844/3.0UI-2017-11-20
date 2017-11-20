define(function() {
    'use strict';
    return ['$compile','$parse','$translate',dateTimeSelector];

    function dateTimeSelector($compile,$parse,$t) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function postLink(scope, element, attrs, ngModel) {
                if (!ngModel) return;
                var surfix=attrs.surfix;
                //console.log(attrs)
                 /*if(!!surfix){
                    element.on('dp.hide',function(e){
                        var datetime = element.val();
                        ngModel.$setViewValue(datetime+":"+surfix);
                    });
                 }*/
                element.on('dp.hide',function(e){
                    var datetime = element.val();
                    ngModel.$setViewValue(datetime);
                });
                element.datetimepicker({
                     format:attrs.format||'YYYY-MM-DD HH:mm',
                     locale:'zh-cn'
                });
            }
        };
    }
});
