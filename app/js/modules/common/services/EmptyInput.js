define(function(){
	return [EmptyInput]
		function EmptyInput(){
			return function(obj){
				var emptyInputs = document.getElementsByClassName("empty-input");
		   		for(var i=0; i<emptyInputs.length; i++){
		   			emptyInputs[i].onclick = function(){
		   				$(this).prev().val("");
		   				var list = $(this).prev().attr("ng-model").slice(6);
		   				for (var Key in obj){
				            if(Key == list){
				           	   delete obj[Key];
				            }
				       	}
		   			}
		   		}
			}			
			return EmptyInput(obj);
		}
})