define(function() {
    function GridServiceNoCount($document) {
        function createGrid(options) {
            var gridOptions={};
        	angular.extend(gridOptions,{   
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
            return gridOptions;
        }
        return {
            create: function(scope, options) {
                if(!!scope.gridOptions){
                    return;
                }               
            	scope.gridOptions=createGrid(options);
                scope.gridOptions.onRegisterApi=function(gridApi){
                    scope.gridApi = gridApi;
                    scope.gridApi.pagination.fetch=function(currentPage, pageSize, sortColumns){
                        if(typeof(scope.getPagingList)==="function"){
                            scope.gridApi.pagination.isLoading=true;
                            var result = scope.getPagingList(currentPage, pageSize, sortColumns);
                            if (result) {
                            	result.then(function(data){
                                    if (scope.count != undefined) {
                                        scope.gridOptions.totalItems=scope.count;
                                    }
	                                scope.gridOptions.data=data.items;
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
                        scope.gridApi.pagination.fetch(scope.gridApi.pagination.getPage(),scope.gridOptions.paginationPageSize,scope.sortCols)
                    });
                    scope.gridApi.pagination.on.paginationChanged(scope, scope.gridApi.pagination.fetch);
                    if(!!options.fetchData){
                        scope.gridApi.pagination.fetch(scope.gridApi.pagination.getPage(),scope.gridOptions.paginationPageSize, null);
                    }
                    
                    if (scope.gridOptions.additionalAction) {
                    	scope.gridOptions.additionalAction(scope.gridApi);
                    }
                }
            },
            refresh: function(scope) {
                scope.gridApi.pagination.fetch(scope.gridApi.pagination.getPage(), scope.gridOptions.paginationPageSize, scope.sortCols);
            },
            
            getOptions: function(scope) {
            	return scope.gridOptions;
            }
        };
    }

    return [GridServiceNoCount];
});

 