define(function() {
    function LocaleService($t) {
        
        return function(text) {
            var data =$t.instant(text);
            if(angular.isObject(data)){
                var ms=[];
                for(var i in text) {
                    if(data.hasOwnProperty(text[i])) {
                        var value = data[text[i]];
                        ms.push(value);
                    }
                }
                return ms;
            }
            return data;
        };
    }


    return [ '$translate', LocaleService];
});

 