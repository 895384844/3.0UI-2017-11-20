define(function() {
    function DialogBoxCtrl($scope,close,title,message,buttons,radioButtons,textInput) {
        $scope.title = title;
        $scope.message = message;
        $scope.buttons = buttons;
        $scope.radioButtons = radioButtons;
        $scope.textInput = textInput;
        $scope.param = {};
        $scope.callback = function(button, param) {
            var result= {
                button:button,
                param:param
            };
            close(result);
        };
    }  
   

    return ['$scope', 'close','title','message','buttons','radioButtons','textInput',DialogBoxCtrl];
});