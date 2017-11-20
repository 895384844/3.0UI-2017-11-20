/**
 * Created by zhaoyang on 16/8/22.
 */
define([
	'angular',
	'./controllers/AcrossAnalysisCtrl',
	'./controllers/NotifyLogCtrl',
	'./controllers/PartnerAnalysisCtrl',
	'./controllers/ReportHistoryCtrl',
	'./controllers/ResidentAnalysisCtrl',
	'./controllers/SweepLogCtrl',
	'./controllers/TraceLogCtrl',
	'./controllers/TrafficAnalysisCtrl',
	'./controllers/BelongingCtrl',
	'./controllers/ShowMapCtrl',
	'./controllers/TrafficChartCtrl',
	'./controllers/WifiCtrl',
	'./controllers/PartnerDetailCtrl',
	'./controllers/ResidentDetailCtrl'
], function (angular,
             AcrossAnalysisCtrl,
             NotifyLogCtrl,
             PartnerAnalysisCtrl,
             ReportHistoryCtrl,
             ResidentAnalysisCtrl,
             SweepLogCtrl,
             TraceLogCtrl,
             TrafficAnalysisCtrl,
             BelongingCtrl,
             ShowMapCtrl,
             TrafficChartCtrl,
			 WifiCtrl,
			 PartnerDetailCtrl,
			 ResidentDetailCtrl) {
	var module = angular.module('webApp.report', []);

	module.controller({
		AcrossAnalysisCtrl: AcrossAnalysisCtrl,
		NotifyLogCtrl: NotifyLogCtrl,
		PartnerAnalysisCtrl:PartnerAnalysisCtrl,
		ReportHistoryCtrl: ReportHistoryCtrl,
		ResidentAnalysisCtrl: ResidentAnalysisCtrl,
		SweepLogCtrl: SweepLogCtrl,
		TraceLogCtrl: TraceLogCtrl,
		TrafficAnalysisCtrl: TrafficAnalysisCtrl,
		BelongingCtrl: BelongingCtrl,
		ShowMapCtrl: ShowMapCtrl,
		TrafficChartCtrl: TrafficChartCtrl,
		WifiCtrl: WifiCtrl,
		PartnerDetailCtrl: PartnerDetailCtrl,
		ResidentDetailCtrl: ResidentDetailCtrl
	});

	module.factory({});

});