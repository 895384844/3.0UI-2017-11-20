define(function() {
    function GridServiceReport($document) {
        function createGrid(option) {
            var gridOption={};
        	angular.extend(gridOption,{   
	            enablePaginationControls: false,
	            showColumnFooter: false,
				paginationPageSize: 50,
				selectionRowHeaderWidth: 35,
				rowHeight: 35,
				useExternalPagination: true,
                enableMinHeightCheck:true,
                enableRowSelection: true,
	            enableSelectAll: true
            },option);
            return gridOption;
        }
        return {
            create: function(scope,option) {
                if(!!scope.gridOption){
                    return;
                };
            	scope.gridOption=createGrid(option);
            	scope.createGrid = function(){
	                scope.gridOption.onRegisterApi=function(gridApi){
	                    scope.gridApi = gridApi;
	                    if(typeof(scope.getNoPagingList)==="function"){
	                        result = scope.getNoPagingList();
	                        if (result) {
	                        	result.then(function(data){
	                                scope.gridOption.data=data.items;
	                            });
	                        }
	                    };
	                }; 
               }
            	scope.createGrid();
            },

            getOption: function(scope) {
            	return scope.gridOption;
            },
            
            refresh: function(scope, currentPosition, pageSize,showFooter){
            	if(typeof(scope.getNoPagingList)==="function"){
                    var result = scope.getNoPagingList(currentPosition,pageSize);
                    if (result) {
                    	result.then(function(data){
                    		if(!data.items){
                    			scope.gridOption.data = [];
                    		}else{
                    			scope.gridOption.data=data.items;
                    		}                            
                            if(pageSize){
                            	scope.gridOption.paginationPageSize = pageSize;
                            };
                            if(showFooter){
                            	scope.gridOption.showColumnFooter = showFooter;
                            }
                        });
                    }
                };
            }
        };
    }

    return [GridServiceReport];
});

 