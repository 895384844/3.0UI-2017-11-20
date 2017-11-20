define(function() {
    function GridServices($document) {
        function createGrid(options) {
            var gridOption={};
        	angular.extend(gridOption,{   
	            paginationPageSizes: [30,50,100],
	            paginationPageSize: 30,
	            enableRowSelection: true,
	            enableSelectAll: true,
	            selectionRowHeaderWidth: 35,
	            rowHeight: 35,
	            showGridFooter:false,
	            showColumnFooter: false,
                useExternalPagination: true,
                enableMinHeightCheck:true,
                paginationTemplate:'common/templates/pagination.html'                       
            },options);
            return gridOption;
        }
        return {
            create: function(scope,options) {
                if(!!scope.gridOption){
                    return;
                }               
            	scope.gridOption=createGrid(options);
                scope.gridOption.onRegisterApi=function(gridApi){
                    scope.gridApi = gridApi;
                    scope.gridApi.pagination.fetch=function(currentPage, pageSize,sortColumns){
                        if(typeof(scope.getPagingList)==="function"){
                            scope.gridApi.pagination.isLoading=true;
                            var result = scope.getPagingList(currentPage, pageSize,sortColumns);
                            if (result) {
                            	result.then(function(data){
	                                scope.gridOption.data=data.items;
	                                scope.gridOption.totalItems=data.count;
	                                scope.gridApi.pagination.isLoading=false;
	                            });
                            }                           
                        }                       
                    };
                    scope.gridApi.core.on.sortChanged(scope, function(grid, sortColumns){
                        scope.sortCols=[];
                        angular.forEach(sortColumns,function(col){
                            scope.sortCols.push(col.name);
                        });
                        scope.gridApi.pagination.fetch(scope.gridApi.pagination.getPage(),scope.gridOption.paginationPageSize,scope.sortCols)
                    });
                    scope.gridApi.pagination.on.paginationChanged(scope, scope.gridApi.pagination.fetch);
                    if(!!options.fetchData){
                        scope.gridApi.pagination.fetch(scope.gridApi.pagination.getPage(),scope.gridOption.paginationPageSize);
                    }
                    if (scope.gridOption.additionalAction) {
                    	scope.gridOption.additionalAction(scope.gridApi);
                    }
                }
            },
            refresh: function(scope) {
               scope.gridApi.pagination.fetch(scope.gridApi.pagination.getPage(),scope.gridOption.paginationPageSize,scope.sortCols);
            },
            
            getOptions: function(scope) {
            	return scope.gridOption;
            }
        };
    }

    return [GridServices];
});

 