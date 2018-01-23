define([
	'angular',
	'./controllers/DialogBoxCtrl',

	'./directives/buttonSet',
	'./directives/pattern',
	'./directives/fastclick',
	'./directives/parseInt',
	'./directives/filterSuggest',
	'./directives/dateTimeSelector',
	'./directives/permissionTag',
	'./directives/compareTo',
	'./directives/ignoreEmptyValue',
	'./directives/validate',
	'./directives/dynamicHeight',
	'./directives/baiduMap',
	'./directives/mwChart',

	'./services/DialogService',
	'./services/AlertService',
	'./services/HttpService',
	'./services/LocaleService',
	'./services/GridService',
	'./services/GridServices',
	'./services/GridServicesCopy',
	'./services/GridServiceReport',
	'./services/GridServiceNoCount',
	'./services/mapServices',
	'./services/utilityServices',
	'./services/DateFormat',
	'./services/delEmptyInput',
	'./services/EmptyInput',
	'./services/GetLocalTime',
	'./services/groupSelect',
	'./services/groupSelectMore',

	'./filters/join',
	'./filters/numberPlus'
], function (angular,
             DialogBoxCtrl,
             buttonSet,
             myxPattern,
             fastclick,
             myxParseInt,
             filterSuggest,
             dateTimeSelector,
             permissionTag,
             compareTo,
             ignoreEmptyValue,
             validate,
             dynamicHeight,
             baiduMap,
             mwChart,

             DialogService,
             AlertService,
             HttpService,
             LocaleService,
             GridService,
             GridServices,
             GridServicesCopy,
             GridServiceReport,
             GridServiceNoCount,
             mapServices,
             utilityServices,
             DateFormat,
             delEmptyInput,
             EmptyInput,
             GetLocalTime,
             groupSelect,
             groupSelectMore,

             join,
             numberPlus) {
	var module = angular.module('webApp.common', []);

	module.factory({
		AlertService: AlertService,
		HttpService: HttpService,
		$lt: LocaleService,
		GridService: GridService,
		GridServices: GridServices,
		GridServicesCopy: GridServicesCopy,
		GridServiceReport: GridServiceReport,
		GridServiceNoCount: GridServiceNoCount,
		DialogService: DialogService,
		mapServices: mapServices,
		utilityServices: utilityServices,
		DateFormat: DateFormat,
		delEmptyInput: delEmptyInput,
		EmptyInput: EmptyInput,
		GetLocalTime: GetLocalTime,
		groupSelect: groupSelect,
		groupSelectMore: groupSelectMore
	});

	module.directive({
		buttonSet: buttonSet,
		myxPattern: myxPattern,
		myxFastClick: fastclick,
		myxParseInt: myxParseInt,
		filterSuggest: filterSuggest,
		dateTimeSelector: dateTimeSelector,
		permissionTag: permissionTag,
		compareTo: compareTo,
		ignoreEmptyValue: ignoreEmptyValue,
		validate: validate,
		dynamicHeight: dynamicHeight,
		baiduMap: baiduMap,
		mwChart: mwChart
	});
	module.filter({
		join: join,
		numberPlus: numberPlus
	});

	module.controller({
		DialogBoxCtrl: DialogBoxCtrl
	});

});