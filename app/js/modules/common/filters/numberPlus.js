define(function() {
    'use strict';

    return [numberPlus];

   function numberPlus() {
     return function(input) {  
     	if(input===undefined||input===null){
     		return;
     	}
        var number=Number(input);
        if(number>=100){
            return "99+";
        }
        return input;
      };
    }
});
