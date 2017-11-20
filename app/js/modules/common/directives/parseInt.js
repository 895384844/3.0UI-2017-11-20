define(function() {
    'use strict';

    return ['$parse', myxParseInt];

    // @name myxParseInt
    //
    // @description
    // Parses ng-model value to integer
    //
    // @example
    // <input type="number" ng-model="variable" myx-parse-int>
    //
    // Note, this directive requires ng-model, which should be numeric string or undefined.
    //       This directive is made to be used with input[type="number"] only

    function myxParseInt($parse) {
        return {
            require: "ngModel",
            link: function(scope, element, attrs, model) {
                attrs.$observe('ngModel', function(value) { // Got ng-model bind path here
                    scope.$watch(value, function(newValue) { // Watch given path for changes
                        if (typeof newValue !== 'number' && typeof newValue !== 'undefined') {
                            $parse(value).assign(scope, parseInt(newValue));
                        }
                    });
                });

                //prevent non-numeric characters from being typed in
                $(element).keydown(function(event) {
                    if ((event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105) && event.which != 8 && event.which != 46 && event.which != 16 && event.which != 9 && event.which != 20 && event.which != 144 && (event.which > 40 || event.which < 37)) event.preventDefault();
                });

            }
        };
    }
});