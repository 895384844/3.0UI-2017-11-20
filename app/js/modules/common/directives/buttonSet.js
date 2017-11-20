define(function(){
    return ['$timeout',buttonSet];

    function buttonSet($timeout){
        return {
            require: 'ngModel',
            restrict: 'E',
            replace:true,
            scope: { 
                items:'=' 
            },
            link: function($scope, element,attrs,ngModel){
                div=angular.element('<div>');
                for (var i=0;i<$scope.items.length;i++){
                    var val=$scope.items[i];
                    var text=$scope.items[i];
                    if (typeof val == 'object'){
                        val=val.value;
                        text=text.name;
                    }
                    inputType="checkbox";
                    if(!!attrs.singleSelect&&attrs.singleSelect=='true'){
                        inputType="radio";
                    }
                    set=div.append('<input  type="'+inputType+'"  id="'+attrs.id+'_'+i+'">'+
                    '<label  for="'+attrs.id+'_'+i+'" value="'+val+'">'+text+(attrs.text?attrs.text:'')+'</label>');
                    element.append(set);
                }
                
                $timeout(function () {
                    var labels=element.find('div').buttonset().find('label');
                    labels.click(function(a,b,c){
                        var values=ngModel.$viewValue;
                        if(!values){
                            values=[];
                        }
                        val=$(this).attr('value');
                        if(attrs.type === "number"){
                            val=Number(val);
                        }
                        if(!$(this).hasClass('ui-state-active')){
                            values.push(val);
                        }else{
                             for (var i = 0; i < values.length; i++) {
                                if (values[i]==val){
                                    values.splice(i,1);
                                }
                             }
                        }
                        ngModel.$setViewValue(_.sortBy($.unique(values)));
                    });
                    labels.each(function(i,o){
                        var values=ngModel.$viewValue;
                        if(!values){
                            return;
                        }
                        val=$(this).attr('value');
                        if(attrs.type === "number"){
                            val=Number(val);
                        }
                        if (values.indexOf(val)>=0){
                            $("#"+$(this).attr("for")).attr("checked","true");
                        }
                        
                    });
                    labels.width(Number(attrs.bttonWidth));
                    element.find('div').buttonset("refresh");
                }, 10);

            }

        };
    }
});