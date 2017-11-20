define(function(){
    return [ '$q', 'HttpService',SystemService];

    function SystemService( $q,HttpService){

        return {
            getRoles: function(filter){
                var deffered = $q.defer();
                HttpService.get('system/role/get',filter).then(function success(data){
                    deffered.resolve(data);
                },
                function failure(errorResponse){
                    deffered.resolve([]);
                });
                return deffered.promise;
            },
            getUsersByRoleId: function(filter){
                var deffered = $q.defer();
                HttpService.get('system/role/getUsers',filter).then(function success(data){
                    deffered.resolve(data);
                },
                function failure(errorResponse){
                    deffered.resolve([]);
                });
                return deffered.promise;
            },
            getPermissions: function(){
                var deffered = $q.defer();
                HttpService.get('system/role/permissions',{}).then(function success(data){
                    deffered.resolve(data);
                },
                function failure(errorResponse){
                    deffered.resolve([]);
                });
                return deffered.promise;
            },
            getScopes: function(filter){
                var deffered = $q.defer();
                HttpService.post('system/scope/get',filter).then(function success(data){
                    deffered.resolve(data);
                },
                function failure(errorResponse){
                    deffered.resolve([]);
                });
                return deffered.promise;
            },
            getSettings: function(){
                var deffered = $q.defer();
                HttpService.get('system/settings/get',{}).then(function success(data){
                    deffered.resolve(data);
                },
                function failure(errorResponse){
                    deffered.resolve([]);
                });
                return deffered.promise;
            },
            getLogs: function(filter){
                var deffered = $q.defer();
                HttpService.post('system/log/get',filter).then(function success(data){
                        deffered.resolve(data);
                    },
                    function failure(errorResponse){
                        console.error("error:"+errorResponse);
                        deffered.resolve([]);
                    });
                return deffered.promise;
            },
           saveOrUpdateUser: function(url, user){
                var deffered = $q.defer();
                HttpService.post(url,user).then(function success(data){
                        deffered.resolve(data);
                    },
                    function failure(errorResponse){
                        deffered.resolve([]);
                    });
                return deffered.promise;
            },
            saveOrUpdateRole: function(url, user){
                var deffered = $q.defer();
                HttpService.post(url,user).then(function success(data){
                        deffered.resolve(data);
                    },
                    function failure(errorResponse){
                        deffered.resolve([]);
                    });
                return deffered.promise;
            },
            saveOrUpdateScope: function(url, scope){
                var deffered = $q.defer();
                HttpService.post(url,scope).then(function success(data){
                        deffered.resolve(data);
                    },
                    function failure(errorResponse){
                        deffered.resolve([]);
                    });
                return deffered.promise;
            }

        };
    }
});
