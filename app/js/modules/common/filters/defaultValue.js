define(function() {
    'use strict';

    return [defaultValue];

   function defaultValue() {
     return function(input,default) {  
     	if(input===undefined||input===null||input=''){
     		return default;
     	}
        
        return input;
      };
    }
});
