
define(function() {
    return ['$compile','$parse','localSession',permissionTag];

    function permissionTag($compile,$parse,localSession) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                
                scope.$watch('localSession.role',function(){
                    if(!localSession.user||localSession.user.is_super){
                        element.show();
                        return;
                    } 
                    if(!attrs.permissionTag){
                        element.show();
                        return;
                    }
                    var tags=attrs.permissionTag.split(",");
                    if(!!localSession.role){
                        var ps=localSession.role.permissions;
                        for(var k in ps){
                            if(_.include(tags,ps[k].code)){
                                element.show();
                                return;
                            }
                        }
                        element.hide();
                    }
                },true);
            }
        };
    }
});
