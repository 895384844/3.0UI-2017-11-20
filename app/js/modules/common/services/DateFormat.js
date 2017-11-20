define(function(){
	return [DateFormat]
		function DateFormat(){
			return function(dateStr){
				var timestamp2 = Date.parse(new Date(dateStr));
				return timestamp2 = timestamp2 / 1000;
			}			
			return DateFormat(dateStr);
		}
})
