define(['echarts', 'moment'], function(echarts, moment) {
	return ['$scope', 'HttpService', 'close', '$timeout', 'list', TrafficChartCtrl];

	function TrafficChartCtrl($scope, HttpService, close, $timeout, list) {

		$scope.close = close;
		var data = list;
		//createdChart();
		$timeout(createChart, 500);
		
		function createChart() {
			var myChart = echarts.init(document.getElementById("main"));
			
			//option
			option = {
				color: ['#7cb5ec'],
				title: {
				//	text: '设备流量统计分析图形展示'
				},
				tooltip: {
					trigger: 'axis'
				},
				grid: {
					containLabel: true
				},
				xAxis: {
					data: []
				},
				yAxis: {},
				series: [{
					name: '总量',
					type: 'line',
					data: []
				}]
			};
			
			
			var xPoints = [];
            var sPoints = [];

            for(var i=0; i<data.length; i++){
                xPoints.push(data[i]['start']);
                sPoints.push(data[i]['count']);
            }
            option.xAxis.data=xPoints;
            option.series[0].data=sPoints;

			myChart.setOption(option);
		}
		
		
		
	}
})