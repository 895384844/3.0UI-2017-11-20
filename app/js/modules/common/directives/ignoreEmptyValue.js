define(function() {
    'use strict';
    return ['$parse',ignoreEmptyValue];

    function ignoreEmptyValue($parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attrs,ngmodel) {
                    var mname=attrs.ngModel;
                    element.change(function(){
                        if(!$(this).val()){
                            var mnames=mname.split('.');
                            if(mnames.length===0){
                                return;
                            }
                            var temp=scope;
                            for (var i in mnames) {
                                if(i==mnames.length-1){
                                    delete temp[mnames[i]];
                                    break;
                                }
                                temp=temp[mnames[i]];
                            }
                        }                        
                    });
            }
        };
    }
});
