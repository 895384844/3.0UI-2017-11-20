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
	'./controllers/ShowTraceMapCtrl',
	'./controllers/TrafficChartCtrl',
	'./controllers/WifiCtrl',
	'./controllers/PartnerDetailCtrl',
	'./controllers/TrafficWifiCtrl',
	'./controllers/ResidentDetailCtrl',
	'./controllers/AccompanyImsiCtrl',
	'./controllers/AccompanyImsiDetailCtrl',
    './controllers/VehicleCtrl',
    './controllers/VehicleTraceCtrl',
    './controllers/VehicleCollisionCtrl',
    './controllers/AccompanyVehicleCtrl',
    './controllers/TrafficVehicleCtrl',
    './controllers/VehiclePicCtrl',
    './controllers/AccompanyVehicleDetailCtrl'

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
             ShowTraceMapCtrl,
             TrafficChartCtrl,
			 WifiCtrl,
			 PartnerDetailCtrl,
			 TrafficWifiCtrl,
			 ResidentDetailCtrl,
			 AccompanyImsiCtrl,
			 AccompanyImsiDetailCtrl,
             VehicleCtrl,
             VehicleTraceCtrl,
             VehicleCollisionCtrl,
             AccompanyVehicleCtrl,
             TrafficVehicleCtrl,
             VehiclePicCtrl,
             AccompanyVehicleDetailCtrl) {
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
        ShowTraceMapCtrl: ShowTraceMapCtrl,
		TrafficChartCtrl: TrafficChartCtrl,
		WifiCtrl: WifiCtrl,
		PartnerDetailCtrl: PartnerDetailCtrl,
		TrafficWifiCtrl: TrafficWifiCtrl,
		ResidentDetailCtrl: ResidentDetailCtrl,
		AccompanyImsiCtrl: AccompanyImsiCtrl,
		AccompanyImsiDetailCtrl: AccompanyImsiDetailCtrl,
        VehicleCtrl: VehicleCtrl,
        VehicleTraceCtrl: VehicleTraceCtrl,
        VehicleCollisionCtrl: VehicleCollisionCtrl,
        AccompanyVehicleCtrl: AccompanyVehicleCtrl,
        TrafficVehicleCtrl: TrafficVehicleCtrl,
        VehiclePicCtrl: VehiclePicCtrl,
        AccompanyVehicleDetailCtrl: AccompanyVehicleDetailCtrl

    });

	module.factory({});

});