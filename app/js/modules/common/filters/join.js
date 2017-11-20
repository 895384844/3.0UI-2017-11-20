define(function() {
    'use strict';

    return [join];

   function join() {
     return function(input) {  
     	if(input===undefined||input===null){
     		return;
     	}
        return input.join();
      };
    }
});
