define(function() {
    function DialogService(ModalService,$q) {

        return {
            showConfirm: function(title, message, yesCallback, noCallback) {
                return this.showDialog(title, message, [
                            {
                                id:0,
                                name: '是',
                                'class': 'btn-primary',
                                callback: yesCallback
                            }, {
                                id:1,
                                name: '否',
                                'class': 'btn-default',
                                callback: noCallback
                            }], 
                            null, null);
            },
            showMessage: function(title, message, yesCallback){
            	return this.showDialog(title,message,[
            		{
            			if:0,
            			name : '确定',
            			'class' : 'btn-primary',
            			callback: yesCallback
            		}],
            		null,null);
            },

            showPrompt: function(title, message, input, yesCallback, noCallback) {
                return this.showDialog(title, message, [
                            {
                                id:0,
                                name: '提交',
                                'class': 'btn-primary',
                                callback: yesCallback
                            }, {
                                id:1,
                                name: '取消',
                                'class': 'btn-default',
                                callback: noCallback
                            }], 
                            null, input);
            },

            // refer showConfirm
            showDialog: function(title, message, buttons, radioButtons, textInput) {
                var deferred = $q.defer();
                ModalService.showModal({
                    templateUrl: 'js/modules/common/templates/DialogBox.html',
                    controller: 'DialogBoxCtrl',
                    inputs:{
                        title:title,
                        message:message,
                        buttons:buttons,
                        radioButtons:radioButtons,
                        textInput:textInput
                    }
                }).then(function(modal) {
                    modal.close.then(function(result) {
                            var button=result.button;
                            var param=result.param;
                            var callback=button.callback;
                            if (typeof(callback) === 'function'){
                                callback.call(callback,param)
                            }
                            deferred.resolve(button.id);
                       
                    });
                });
                return deferred.promise;
            }
        };
    }


    return ['ModalService','$q', DialogService];
});