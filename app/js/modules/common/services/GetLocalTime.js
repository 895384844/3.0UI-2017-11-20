define(function(){
	return [GetLocalTime]
		function GetLocalTime(){
			return function(nS){
			  	Date.prototype.toLocaleString = function() {			  		
			  		function formatDate(num){
			  			var result = '';
				  		if(num+1 < 10){
				  			result = "0" + (num+1);
				  		}else{
				  			result = num+1;
				  		}
				  		return result;
			  		}
		          	return this.getFullYear() + "-" + formatDate(this.getMonth()) + "-" + formatDate(this.getDate()-1) + " " + formatDate(this.getHours()-1) + ":" + formatDate(this.getMinutes()-1) + ":" + formatDate(this.getSeconds()-1);
		    	};
			    
				return new Date(parseInt(nS) * 1000).toLocaleString(); 
			}
			return GetLocalTime(nS);
		}
})