define(function () {
	return ['$scope', 'MENU_GROUPS', 'SectionsService', MenusCtrl];

	function MenusCtrl($scope, menuGroups, SectionsService) {
		var data = menuGroups;
		var permissions = JSON.parse(sessionStorage.getItem('permissions'));
		var menus = [];
		for (var code in permissions) {
			if (permissions[code] != 0) {
				menus.push(code);
			}
		}
		var codes = [];
		$scope.menus = [];
		for(var i=0; i<data.length; i++){
			codes.push(data[i].code);
		}
		function  FilterData(a,b){   //循环判断数组a里的元素在b里面有没有，有的话就放入新建立的数组中
            var result = new Array();
            var c=b.toString();
            for(var i=0;i<a.length;i++)
            {
              if(c.indexOf(a[i].toString())>-1)
              {
              result.push(a[i]);
              }      
            }
            return result;
        }
		var res = FilterData(menus,codes);
		for(var i=0; i<data.length; i++){
			for(j=0; j<res.length; j++){
				if(data[i].code == res[j]){
					$scope.menus.push(data[i])
				}
			}
		}
		
		$scope.addSection = function (section) {
            SectionsService.addActiveSection(section);
       };
	}
});