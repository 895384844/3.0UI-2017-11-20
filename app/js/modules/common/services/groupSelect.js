define(function(){
	return [groupSelect]
		function groupSelect(){
			return function(divselectid){
				$(divselectid+" .cite").click(function(){
					var ul = $(divselectid+" ul");
					if(ul.css("display") == "none"){
						console.log(ul.slideDown())
						ul.slideDown("fast");
					}else{
						ul.slideUp("fast");
					}
				});
				/*$(divselectid+" ul li a").click(function(){
					var txt = $(this).text();
					$(divselectid+" cite").html(txt);
					var value = $(this).attr("selectid");
					inputselect.val(value);
					$(divselectid+" ul").hide();
					
				});*/
				$(document).click(function(){
					$(divselectid+" ul").hide();
				});
			}			
			return groupSelect(divselectid);
		}
})
