define(['echarts', 'moment'], function (echarts, moment) {
	return ['HttpService', '$rootScope', '$templateRequest', '$compile', '$animate', ChartsService];

	function ChartsService(HttpService, $rootScope, $templateRequest, $compile, $animate) {

		return {
			showDiskUsageChart: function (element) {
				$templateRequest("js/modules/app/templates/tpl.disk.usage.html", true).then(function (template) {
					var scope = $rootScope.$new();
					var elem = $compile(template)(scope);
					$animate.enter(elem, element);
					scope.datas = {
						vrr: {
							text: 'VRR',
							value: 0
						},
						root: {
							text: 'ROOT',
							value: 0
						},
						mysql: {
							text: 'MYSQL数据库',
							value: 0
						},
						mongo: {
							text: 'MONGODB数据库',
							value: 0
						}
					};

					scope.class = function (val) {
						if (val <= 30) {
							return 'progress-bar-success';
						} else if (val <= 60) {
							return 'progress-bar-info';
						} else if (val <= 80) {
							return 'progress-bar-warning';
						} else {
							return 'progress-bar-danger';
						}
					};

					HttpService.post('report/diskusage/get').then(function success(data) {
							scope.datas.vrr.value = data.diskVarUsage;
							scope.datas.root.value = data.diskRootUsage;
							scope.datas.mysql.value = data.diskMysqlUsage;
							scope.datas.mongo.value = data.diskMongodbUsage;
						},
						function failure(errorResponse) {
						}, function (value) {
						});
				});
			},
			showMemoryUsageCharts: function (element) {
				var tempUsageQuery = {
					"query": {
						"time__range__$DATE": [moment().add(-1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
					}
				};
				var chart = echarts.init(element);
				chart.setOption({
					title: {
						text: '实时内存使用率（100%）'
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: [0]
					},
					yAxis: {
						type: 'value',
						max: 100,
						axisLabel: {
							show: true,
							interval: 'auto',
							formatter: '{value} %'
						}
					},
					series: [
						{
							name: '使用率',
							type: 'line',
							smooth: false,
							symbol: 'none',
							sampling: 'average',
							itemStyle: {normal: {areaStyle: {type: 'default'}}},
							data: [0]
						}
					]
				});
				HttpService.post('report/memoryusage/get', tempUsageQuery).then(function success(data) {
						var _data = [];
						var _date = [];
						for (var i in data) {
							_data.push(data[i].value);
							_date.push(data[i].date);
						}

						var option = chart.getOption();
						option.xAxis[0].data = _date;
						option.series[0].data = _data;
						chart.setOption(option);
					},
					function failure(errorResponse) {
					}, function (value) {
					});
			},
			showCPUUsageCharts: function (element) {
				var tempUsageQuery = {
					"query": {
						"time__range__$DATE": [moment().add(-1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
					}
				};
				var chart = echarts.init(element);
				chart.setOption({
					title: {
						text: '实时CPU使用率（100%）'
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: [0]
					},
					yAxis: {
						type: 'value',
						max: 100,
						axisLabel: {
							show: true,
							interval: 'auto',
							formatter: '{value} %'
						}
					},
					series: [
						{
							name: '使用率',
							type: 'line',
							smooth: true,
							symbol: 'none',
							sampling: 'average',
							itemStyle: {normal: {areaStyle: {type: 'default'}}},
							data: [0]
						}
					]
				});
				HttpService.post('report/cpuusage/get', tempUsageQuery).then(function success(data) {
						var _data = [];
						var _date = [];
						for (var i in data) {
							_data.push(data[i].value);
							_date.push(data[i].date);
						}

						var option = chart.getOption();
						option.xAxis[0].data = _date;
						option.series[0].data = _data;
						chart.setOption(option);
					},
					function failure(errorResponse) {
					}, function (value) {
					});
			},
			showDBUsageCharts: function (element) {
				var tempUsageQuery = {
					"query": {
						"time__range__$DATE": [moment().add(-1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
					}
				};
				var chart = echarts.init(element);
				chart.setOption({
					title: {
						text: '数据库信息'
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: [0]
					},
					yAxis: {
						type: 'value'
					},
					series: [
						{
							name: '数据库信息',
							type: 'line',
							smooth: true,
							symbol: 'none',
							sampling: 'average',
							itemStyle: {
								normal: {
									color: 'rgb(255, 70, 131)'
								}
							},
							data: [0]
						}
					]
				});
				HttpService.post('report/dbusage/get', tempUsageQuery).then(function success(data) {
						var _data = [];
						var _date = [];
						for (var i in data) {
							_data.push(data[i].value);
							_date.push(data[i].date);
						}

						var option = chart.getOption();
						option.xAxis[0].data = _date;
						option.series[0].data = _data;
						chart.setOption(option);
					},
					function failure(errorResponse) {
					}, function (value) {
					});
			},
			showKPIChart: function (element) {
				HttpService.post('kpi/report/get').then(function success(data) {
						if (data.items.length > 0) {
							var query = {
								query: {
									'KPI_CHART_ID': data.items[0].id,
									'CHART_GRAIN': 'min'
								}
							};
							HttpService.post('kpi/report/chart', query).then(function success(data) {
									var _data = [];
									var _date = [];
									for (var i in data) {
										_data.push(data[i].sum_ab);
										_date.push(data[i].date);
									}

									var chart = echarts.init(element);
									chart.setOption({
										title: {
											text: '在线数值'
										},
										xAxis: {
											type: 'category',
											boundaryGap: false,
											data: _date
										},
										yAxis: {
											type: 'value'
										},
										series: [
											{
												name: '在线数值',
												type: 'line',
												data: _data
											}
										]
									});
								},
								function failure(errorResponse) {
								}, function (value) {
								});
						}
					},
					function failure(errorResponse) {
					}, function (value) {
					});
			},
			showOnlineRateChart: function (element) {
				var query = {
					query: {
						t__ge__$DATE: moment().add(-1, 'year').format('YYYY-MM-DD'),
						t__le__$DATE: moment().format('YYYY-MM-DD')
					}
				};
				HttpService.post('report/online_rate/onlinerate', query).then(function success(data) {
						var _data = [];
						var _date = [];
						for (var i in data) {
							_data.push(data[i].rate * 100);
							_date.push(data[i].time);
						}

						var chart = echarts.init(element);
						chart.setOption({
							title: {
								text: '在线比率'
							},
							tooltip: {
								trigger: 'axis'
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: _date
							},
							yAxis: {
								type: 'value',
								axisLabel: {
									formatter: '{value}%'
								}
							},
							series: [
								{
									name: '在线比率',
									type: 'line',
									data: _data
								}
							]
						});
					},
					function failure(errorResponse) {
					}, function (value) {
					});
			},
			showOnlineTimeChart: function (element) {
				var query = {
					query: {
						day_in_epoch__ge__$DATE: moment().add(-1, 'year').format('YYYY-MM-DD'),
						day_in_epoch__le__$DATE: moment().format('YYYY-MM-DD')
					}
				};
				HttpService.post('report/online_time/onlinetime', query).then(function success(data) {
						var _data = [];
						var _date = [];
						for (var i in data) {
							_data.push(data[i].total);
							_date.push(data[i].date);
						}

						var chart = echarts.init(element);
						chart.setOption({
							title: {
								text: '在线数值'
							},
							tooltip: {
								trigger: 'axis'
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: _date
							},
							yAxis: {
								type: 'value'
							},
							grid: {
								left: '3%',
								right: '4%',
								bottom: '3%',
								containLabel: true
							},
							series: [
								{
									name: '在线数值',
									type: 'line',
									data: _data
								}
							]
						});
					},
					function failure(errorResponse) {
					}, function (value) {
					});
			},
			showAlarmChart: function (element) {
				var query = {
					query: {
						create_time__ge__$DATE: moment().add(-1, 'year').format('YYYY-MM-DD'),
						create_time__le__$DATE: moment().format('YYYY-MM-DD')
					}
				};
				HttpService.post('report/alarm/alarmnumber', query).then(function success(data) {
						var _date = [];
						var _series = [{
							name: '严重告警',
							type: 'bar',
							data: []
						}, {
							name: '主要告警',
							type: 'bar',
							data: []
						}, {
							name: '次要告警',
							type: 'bar',
							data: []
						}, {
							name: '告警告警',
							type: 'bar',
							data: []
						}];

						for (var i in data) {
							_series[0].data.push(data[i].Critical);
							_series[1].data.push(data[i].Major);
							_series[2].data.push(data[i].Minor);
							_series[3].data.push(data[i].Warning);
							_date.push(data[i].date);
						}

						var chart = echarts.init(element);
						var option = {
							title: {
								text: '设备告警汇总',
							},
							legend: {
								data: ['严重告警', '主要告警', '次要告警', '告警告警']
							},
							tooltip: {
								trigger: 'axis'
							},
							xAxis: {
								type: 'category',
								data: [0]
							},
							yAxis: {
								type: 'value'
							},
							series: [{
								name: '严重告警',
								type: 'bar',
								data: [0]
							}, {
								name: '主要告警',
								type: 'bar',
								data: [0]
							}, {
								name: '次要告警',
								type: 'bar',
								data: [0]
							}, {
								name: '告警告警',
								type: 'bar',
								data: [0]
							}]
						};
						option.xAxis.data = _date;
						option.series = _series;
						chart.setOption(option);
					},
					function failure(errorResponse) {
					}, function (value) {
					});
			},
			showRebootChart: function (element) {
				var query = {
					query: {
						day_in_epoch__ge__$DATE: moment().add(-1, 'year').format('YYYY-MM-DD'),
						day_in_epoch__le__$DATE: moment().format('YYYY-MM-DD')
					}
				};
				HttpService.post('report/reboot/rebootrate', query).then(function success(data) {
						var _data = [];
						var _date = [];
						for (var i in data) {
							_data.push(data[i].rate);
							_date.push(data[i].time);
						}

						var chart = echarts.init(element);
						chart.setOption({
							title: {
								text: '重启比率'
							},
							tooltip: {
								trigger: 'axis'
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: _date
							},
							yAxis: {
								type: 'value',
								axisLabel: {
									formatter: '{value}%'
								}
							},
							series: [
								{
									name: '重启比率',
									type: 'line',
									data: _data
								}
							]
						});
					},
					function failure(errorResponse) {
					}, function (value) {
					});
			}
		};
	}
});