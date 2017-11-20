define(function() {
    return ['SessionService', '$scope', '$location', '$translate','DialogService', LoginPageCtrl];

    function LoginPageCtrl(SessionService, $scope, $location,$t,DialogService) {

        SessionService.on('login:start', function() {
            $scope.isWaiting = true;
        });

        SessionService.on('login:success', function() {
            $scope.isWaiting = false;
            if (SessionService.isLoggedIn()) {
                redirectPath = sessionStorage.getItem("redirectPath");
                if (!redirectPath || redirectPath === "/login") {
                  redirectPath = "/main";
                }
                $location.path(redirectPath);
            }

        });

//      $scope.credentials = {
//          language:$t.proposedLanguage()
//      };
        $scope.user = SessionService;
//
//     $scope.changeLang = function (lang) {
//          $t.use(lang);
//      };


        $scope.login = function() { 	
            function error(a) {
                $scope.isWaiting = false;
//              $location.path("/main");
            }
            return SessionService.login($scope.credentials).then(undefined, error);
        };
    }
});