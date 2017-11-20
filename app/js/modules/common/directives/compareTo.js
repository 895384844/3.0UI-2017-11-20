define(function() {
    'use strict';

    // @name compareTo
    //
    // @description
    // Validates input against certain regexp
    // HTML5 pattern validation doesn't work in Safari - that's why we have to use a directive
    //
    // @example
    // <span ng-show="formName.inputName.$error.format" class="required-field">Error message</span>
    // needs to be inside a form with formName
    //
    // Predefined patterns: datetime, phone number, phone number or empty field, post code (German only)

    return [compareTo];

   function compareTo() {
    return {
        require: "ngModel",
        
        link: function(scope, element, attrs, ngModel) {
             
                var firstPassword = '#' + attrs.compareTo;
                element.add(firstPassword).on('keyup', function () {
                      scope.$apply(function () {
                            var v = element.val()===$(firstPassword).val();
                            ngModel.$setValidity('ismatchto', v);
                      });
                });
            }
        };
	}
});
