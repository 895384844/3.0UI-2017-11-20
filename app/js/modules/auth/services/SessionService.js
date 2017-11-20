define(['../../common/utils/md5'],function(md5){
    try {
        SessionService.prototype = _.clone(EventEmitter.prototype);
    } catch(e) {
        require(['eventEmitter'], function(EventEmitter){
            SessionService.prototype = _.clone(EventEmitter.prototype);
        });
    }

    function SessionService($location,HttpService,DialogService,localSession) {
        var self = this;
        function onLogin(userInfo) {
            _.extend(self, userInfo);
            self.trigger('login:success');
        }

        /**
         * Current user's login status
         * @return {Boolean}
         */
        this.isLoggedIn = function() {
    		if (!!this.token){
                localSession.user=this.user;
                localSession.permissions=this.permissions;
                localSession.settings=this.settings;
                localSession.token=this.token;
    		    sessionStorage.setItem("token",this.token);
    		    sessionStorage.setItem('menus',this.menus);
                sessionStorage.setItem("username",this.account);
                sessionStorage.setItem("permissions",JSON.stringify(this.permissions));
                sessionStorage.setItem("settings",JSON.stringify(this.settings));
    		}
	      	return !!this.token;
        };


        /**
         * Lets the user log in.
         * @param  {object} credentials
         * @return {promise}
         */
        this.login = function(credentials) {
            self.trigger('login:start');
            c=angular.copy(credentials);
            c.password=md5[0](credentials.password).toUpperCase();
            var promise = HttpService.post('rest/system/user/login',c);
            this.promise = promise.then(onLogin);
            return promise;
        };


        /**
         * Logs the current user out of the application and reloads the page
         * @return {promise}
         */
        this.logout = function() {
             self.trigger('logout:start');
             HttpService.post('rest/system/user/logout').then(function() {
                $location.path('/login');
                localSession.user={};
                localSession.role={};
                localSession.settings={};
                localSession.token="";
                sessionStorage.clear();
                self.trigger('logout:success');
            });
            
        };

    }

    return ['$location', 'HttpService','DialogService','localSession',SessionService];
});
