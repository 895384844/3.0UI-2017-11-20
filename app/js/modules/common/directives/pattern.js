define(function() {
    'use strict';

    // @name pattern
    //
    // @description
    // Validates input against certain regexp
    // HTML5 pattern validation doesn't work in Safari - that's why we have to use a directive
    //
    // @example
    // <span ng-show="formName.inputName.$error.format" class="required-field">Error message</span>
    // <input type="text" name="inputName" myx-pattern="pattern">
    // needs to be inside a form with formName
    //
    // Predefined patterns: datetime, phone number, phone number or empty field, post code (German only)

    return [myxPattern];

    function myxPattern() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function postLink(scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                var isValid;
                var functions = [];
                var validFunc = function(value) {

                    switch (value) {
                        case 'empty':
                            isValid = function(value) {
                                return value === undefined || value === "";
                            };
                            break;
                        case 'datetime':
                            isValid = function(value) {
                                return /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\d)$/.test(value);
                            };
                            break;
                        case 'phone-number':
                            isValid = function(value) {
                                return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value);
                            };
                            break;
                        case 'phone-number-empty':
                            isValid = function(value) {
                                var isPhoneNumber = /^(\+?(86)?)(\s?-?)(((13|15|18)[0-9])(\d{4})(\d{4}))$/.test(value);
                                var isEmpty = /^$/.test(value);
                                return (isPhoneNumber || isEmpty);
                            };
                            break;
                        case 'post-code':
                            //only German for the moment
                            isValid = function(value) {
                                return /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/.test(value);
                            };
                            break;
                        case 'number':
                            isValid = function(value) {
                                var isEmpty = /^$/.test(value);
                                var isNumber = /^\d+$/.test(value);
                                return isEmpty || isNumber;
                            };
                            break;
                        case 'positive-number':
                            isValid = function(value) {
                                var isEmpty = /^$/.test(value);
                                var isPositiveNumber = /^(\d*\.?\d*[0-9]+\d*)$/.test(value);
                                return isEmpty || isPositiveNumber;
                            };
                            break;
                        case 'url':
                            isValid = function(value) {
                                var isEmpty = /^$/.test(value);
                                var strRegex="^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&amp;%\\$\\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\\:[0-9]+)*(/($|[a-zA-Z0-9\\.\\,\\?\\'\\\\\\+&amp;%\\$#\\=~_\\-]+))*$";
                                var re=new RegExp(strRegex); 
                                var isURL = re.test(value);
                                return isEmpty || isURL;
                            };
                            break;
                        case 'ip-address':
                            isValid = function(value){
                                var isEmpty = /^$/.test(value);
                                var isIpAddress = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/.test(value);
                                return isEmpty || isIpAddress;
                            };
                            break;
                        case 'email-address':
                            isValid = function(value) {
                                var isEmailAdress = /^([\w.+-])+@([\w-])+((\.[\w-]{2,6}){1,4})$/.test(value);
                                return isEmailAdress;
                            };
                            break;
                        case 'host':
                            isValid = function(value) {
                                var isIp = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/.test(value);
                                var isDomain = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z][-a-zA-Z]{0,62})+\.?$/.test(value);
                                var isEmpty = (!value);
                                return isEmpty||isIp||isDomain;
                            };
                            break;
                        case 'equals':
                            isValid = function(value) {
                                return value == $('#'+attrs.equals).val();
                            };
                            break;
                        default:
                            isValid = function(value) {
                                return new RegExp(attrs.myxPattern).test(value);
                            };
                    }
                    functions.push(isValid);
                    return false;
                };

                var validFunctions = attrs.myxPattern.split("|");
                for (var i = 0; i < validFunctions.length; i++) {
                    validFunc(validFunctions[i].replace(/\s+/gi, ""));
                }
                var validate=function(value) {
                    var valid = false;
                    for (var j = 0; j < functions.length; j++) {
                        valid = valid || functions[j](value);
                    }

                    // var valid = isValid(value);

                    ngModel.$setValidity('format', valid);

                    return valid ? value : undefined;
                };
                //ngModel.$parsers.push(validate);
                ngModel.$parsers.unshift(validate);
                ngModel.$formatters.unshift(validate);
            }
        };
    }
});
