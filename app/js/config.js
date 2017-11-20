define([
    'angular',
    'locale/message'

], function(
    angular,
    locale
) {
    'use strict';
    angular.module('webApp.config', [])
        .constant('DEBUG', false)
        .constant('API_HOST', 'EFS/')
        .constant('API_URL', '')
        .constant('localeText', {
            'en-US':locale.en_us
        })
        .value('localSession', {
            user:{},
            role:{},
            settings:{},
            token:""
        });

});