define(function() {
    'use strict';
    return ['$compile','$parse',filterSuggest];

    function filterSuggest($compile,$parse) {
        return {
            restrict: 'A',
            replace:false,

            link: function postLink($scope, element, attrs) {
                




                var html='<ul class="dropdown-menu" role="menu">'+
                            '<li><a ng-click="selectCondtion(0)">等于: {{suggestVal}}</a></li>'+
                            '<li><a ng-click="selectCondtion(1)">开始: {{suggestVal}}</a></li>'+
                            '<li><a ng-click="selectCondtion(2)">结束: {{suggestVal}}</a></li>'+
                            '<li><a ng-click="selectCondtion(3)">包含: {{suggestVal}}</a></li>'+
                         '</ul>';
                var conditions=['=','s','e','c']


                var dropdown=$compile(html)($scope)
                $scope. suggestVal='';
                dropdown.css('top',element.offset().top+element.height()+10+'px');
                dropdown.css('left',element.offset().left+'px');
                element.after(dropdown);

                var prefix='<span class="input-group-addon">{{prefixSignal}}</span>'
                $scope.prefixSignal=conditions[0]
                element.before($compile(prefix)($scope));

                $scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if(!!newValue){
                        $scope.suggestVal=newValue;
                        dropdown.show();
                        return;
                    }
                    dropdown.hide();
                }, true);



                var searchQuery=$parse(attrs.filterSuggest);
                var query=$parse(attrs.filterSuggest)($scope);

                $scope.selectCondtion=function(ind){
                    dropdown.hide();
                    $scope.prefixSignal=conditions[ind];
                    switch(ind){
                        case 0:
                            query[attrs.ngModel]=$scope.suggestVal;
                            break;
                        case 1:
                            query[attrs.ngModel+'__startswith']=$scope.suggestVal;
                            break;
                        case 2:
                            query[attrs.ngModel+'__endswith']=$scope.suggestVal;
                            break;
                        case 3:
                            query[attrs.ngModel+'__contains']=$scope.suggestVal;
                            break;

                    }
                    
                    searchQuery.assign($scope,query);
                    $scope.$apply();
                    $scope.suggestVal='';
                }

               

                // var getParentModel=function(mname){
                //     if (mname.indexOf('.')<0){
                //         return mname;
                //     }
                //     return mname.slice(0,mname.lastIndexOf('.'));
                // };

                // var getLastModelName=function(mname){
                //     var mnames=mname.split('.');
                //     if(mnames.length===0){
                //         return "";
                //     }
                //     return mnames.reverse()[0];
                // };

                // var clearFilter=function(filter){
                //     for(var k in filter){
                //         delete filter[k];
                //     }
                // };

                // var rootModel=getParentModel(mname);
                // var searchQuery=$parse(rootModel);
                // var query=$parse(rootModel)(scope);
                // var suffix=getLastModelName(mname);

                    // element.autocomplete({
                    //     source: datasource,
                    //     change:function(event,ui){
                    //         if(!$(this)[0].value || !ui.item){
                    //             if(!!tooltips){
                    //                 try{
                    //                     element.attr('title',"");
                    //                     tooltips.tooltip( "destroy" );
                    //                 }catch(e){}
                    //             }
                    //             clearFilter(query);
                    //             if (!ui.item && $(this)[0].value){
                    //                 query[suffix]=$(this)[0].value;
                    //             }
                    //         }
                    //     },
                    //     select:function(event,data){
                    //         element.attr('title',data.item.label);
                    //         tooltips= element.tooltip({
                    //          position: {
                    //             my: "left top",
                    //             at: "left bottom"
                    //          }
                    //         });

                    //         var index= datasource.indexOf(data.item);
                    //         clearFilter(query);
                    //         switch(index){
                    //             case 0:
                    //                 query[suffix]=data.item.value;
                    //                 break;
                    //             case 1:
                    //                 query[suffix+'__startswith']=data.item.value;
                    //                 break;
                    //             case 2:
                    //                 query[suffix+'__endswith']=data.item.value;
                    //                 break;
                    //             case 3:
                    //                 query[suffix+'__contains']=data.item.value;
                    //                 break;

                    //         }
                    //         searchQuery.assign(scope,query);
                    //         scope.$apply();
                    //         datasource.splice(0,datasource.length);
                    //     },
                    //     search: function( event, ui ) {
                    //         if(!!tooltips){
                    //             try{
                    //                 element.attr('title',"");
                    //                 tooltips.tooltip( "destroy" );
                    //             }catch(e){}
                    //         }
                            
                    //         datasource.splice(0,datasource.length);
                    //         datasource.push({label:'等于: '+$(this)[0].value,value:$(this)[0].value});
                    //         datasource.push({label:'开始: '+$(this)[0].value,value:$(this)[0].value});
                    //         datasource.push({label:'结束: '+$(this)[0].value,value:$(this)[0].value});
                    //         datasource.push({label:'包含: '+$(this)[0].value,value:$(this)[0].value});
                    //     }

                    //  });

            }
        };
    }
});
