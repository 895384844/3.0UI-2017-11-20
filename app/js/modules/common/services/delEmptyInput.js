define(function() {
    return [delEmptyInput];
	    function delEmptyInput() {
	      return function(option) {
	     	for(var attr in option){
	     		if(!option){
		            return;
		        }
	            if(option[attr] === null || option[attr] === ''){
	                delete option[attr];
	                continue;
	            }
	            if(typeof(option[attr]) == "object"){
	                delEmptyInput(option[attr]);
	            }
	        }
	        return delEmptyInput(option);
	      };
	    }
});