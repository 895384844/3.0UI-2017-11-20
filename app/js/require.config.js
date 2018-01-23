require.config({
	// List of all the dependencies
	paths: {
		jquery: '../bower_components/jquery/dist/jquery.min',
		text: '../bower_components/requirejs-text/text',
		lodash: '../bower_components/lodash/dist/lodash.min',
		moment: '../bower_components/moment/min/moment-with-locales.min',
		fastclick: '../bower_components/fastclick/lib/fastclick',
		angular: '../bower_components/angular/angular',
		angularTranslate: '../bower_components/angular-translate/angular-translate.min',
		angularRoute: '../bower_components/angular-route/angular-route',
		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		angularCookies: '../bower_components/angular-cookies/angular-cookies',
		angularSanitize: '../bower_components/angular-sanitize/angular-sanitize',
		angularOnce: '../bower_components/angular-once/once',
		angularEcharts: '../bower_components/angular-echarts/dist/angular-echarts.min',
		angularGrid: '../bower_components/angular-ui-grid/ui-grid',
		Chart: '../bower_components/admin-lte/plugins/chartjs/Chart.min',
		async: '../bower_components/requirejs-plugins/src/async',
		echarts: '../bower_components/echarts/dist/echarts.min',
		china: '../bower_components/echarts/dist/china',
		eventEmitter: '../bower_components/eventEmitter/EventEmitter',
		myBootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
		'jquery-mousewheel': '../bower_components/jquery-mousewheel/jquery.mousewheel.min',
		ngFileUpload: '../bower_components/ng-file-upload/dist/ng-file-upload-all',
		adminLTE: '../bower_components/admin-lte/dist/js/app',
		datetimepicker: '../bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker',
		angularModalService:'../bower_components/angular-modal-service/dst/angular-modal-service',
		angularUITree:'../bower_components/angular-ui-tree/dist/angular-ui-tree',
        bmap:'../bower_components/echarts/dist/extension/bmap',
		//baiduMapApi: './map/apiv2.0.min',
		//baiduMapApiModules: './map/getmodules',		
		template: './template'
	},
	// Ensure that the dependencies are loaded in the right order
	shim: {
		jquery: {
			exports: '$'
		},
		lodash: {
			exports: '_'
		},
		angular: {
			exports: 'angular'
		},
		angularTranslate: {
			deps: ['angular']
		},
		angularRoute: {
			deps: ['angular']
		},
		angularMocks: {
			deps: ['angular'],
			exports: 'angular.mock'
		},
		angularCookies: {
			deps: ['angular']
		},
		angularSanitize: {
			deps: ['angular']
		},
		angularOnce: {
			deps: ['angular']
		},
		angularAnimate: {
			deps: ['angular']
		},
		template: {
			deps: ['angular']
		},
		Chart: {
			exports: 'Chart'
		},
		echarts: {
			exports: 'echarts'
		},
        bmap: {
            exports: 'bmap'
        },
		myBootstrap: {
			deps: ['jquery', 'globalEventEmitter'],
			exports: '$.fn.popover'
		},
		ngFileUpload: {
			deps: ["angular"]
		},
		adminLTE: {
			deps: ['jquery', 'myBootstrap']
		},
		datetimepicker: {
			deps: ['jquery','moment']
		},
		angularGrid: {
			deps: ['angular']
		},
		angularEcharts: {
			deps: ['angular', 'echarts']
		},
		angularModalService:{
			deps: ['angular','myBootstrap']
		},
		baiduMapApi: {
			exports: 'baiduMapApi'
		},
		baiduMapApiModules: {
			deps:['baiduMapApi']
		},
		angularUITree:{
			deps: ['angular']
		}
	},
	waitSeconds: 0,
	urlArgs: "timestamp=" + (new Date()).getTime()
});

// using require() here, so that the related js files will be included in genereated js file build/myservice.build.js by requireJS. require.config.deps won't work withe requireJS build.
require(['bootstrap']);


