define(function() {
    function TabsCtrl($scope,$timeout,SectionsService) {

        
        SectionsService.init();
        $scope.sections = SectionsService.positiveSections;
        $scope.hiddenSections = SectionsService.hiddenSections;
        
        $scope.$on('to-parent', function(event, data) {  
	        $timeout(function(){$scope.$broadcast('to-child', data)},500) ;
	    }); 

        //not ok 
        $scope.removeSection = function(section) {
        	if(section.data){
        		section.data = '';
        	}
            SectionsService.closeSection(section);              
            	if($scope.sections.length < 8 && $scope.hiddenSections.length != 0){
        			$scope.sections.splice(2,0,$scope.hiddenSections[$scope.hiddenSections.length - 1]);
    				$scope.hiddenSections.pop($scope.hiddenSections[$scope.hiddenSections.length - 1]);	
            	}
            	var sec =$scope.sections[$scope.sections.length-1];
                $scope.activeSection(sec);
        };

        $scope.activeSection=function(section){
            _.each(SectionsService.positiveSections,function(ps){
                    if(ps.id!=section.id){
                        ps.active=false;
                        return;
                    }
                    SectionsService.activeSection=ps;
                    SectionsService.activeSection.active=true;
            });
        };
        
        //ok
        $scope.clearSections=function(){
            SectionsService.clearSection();
        };

        $scope.showSection=function(section){
            SectionsService.showSection(section);
            SectionsService.addActiveSection(section);
        };
        
        var removePage = document.getElementById("removePage");
        
        $scope.closePage = function(){
        	console.log(this.nodeName)
        }       
    }  
    return ['$scope','$timeout','SectionsService',TabsCtrl];
});