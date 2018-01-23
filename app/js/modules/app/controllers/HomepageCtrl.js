define(['Chart', 'echarts', 'moment'], function(Chart, echarts, moment) {
	return ['$scope', 'GridService', 'MENU_GROUPS', 'SectionsService', '$interval', 'GetLocalTime', 'HttpService', HomepageCtrl];

	function HomepageCtrl($scope, GridService, menuGroups, SectionsService, $interval, GetLocalTime, HttpService) {
		
		$(window).keydown( function(e) {  //禁用回车
		    var key = window.event?e.keyCode:e.which;  
		    if(key.toString() == "13"){  
		        return false;  
		    }  
		});		
		
		$scope.isDevice = false; //	设备列表
		$scope.isResident = false; //常驻人口
		$scope.isTraffic = false; //流量统计
		$scope.isBelong = false; //归属地，运营商

		$scope.isBts = false;
		
		$scope.resident = {
			total: 0,
			pie1: 0,
			pie2: 0
		};
		
		var bts = {
			'-1' : 'images/N-A.png',
			0 : 'images/grey.png',
			1 : 'images/green.png',
			null : 'images/N-A.png'
		};
		
		var online = {
			false : 'images/grey.png',
			true : 'images/green.png',
			null : 'images/grey.png'
		};

		//设备列表
		var toogle = document.getElementsByClassName('sidebar-toggle')[0];
		var permissions = JSON.parse(sessionStorage.getItem('permissions'));
		var menus = [];
		for (var code in permissions) {
			if (permissions[code] != 0) {
				menus.push(code);
			}
		}
		for(i in menus) {
			if(menus[i] == 'DEVICE_MANAGEMENT') {
				$scope.isDevice = true;
			}
			if(menus[i] == 'INFORMATION_RETRIEVAL') {
				$scope.isResident = true;
			}
			if(menus[i] == 'DATA_ANALYSIS') {
				$scope.isTraffic = true;
				$scope.isBelong = true;
			}
		}

		createCpuChart();
		createBarChart();
		createPieChart();
		createLegendChart();
		getDevice();
		addClass();
		createNetChart();
		
		var timer1 = $interval(createCpuChart,60000);
		var timer2 = $interval(createBarChart,60000);
		var timer3 = $interval(createPieChart,60000);
		var timer4 = $interval(createLegendChart,60000);
		var timer5 = $interval(getDevice,60000);
		var timer6 = $interval(addClass,60000);
		var timer7 = $interval(createNetChart,60000);
				
		$scope.menus = menuGroups;
		$scope.addSection = function(section) {
			SectionsService.addActiveSection(section);
		};
		
		function getDevice(){
			HttpService.get('rest/center/dashboard/device').then(function success(resp) {
				var list = resp.device;
				for(var i=0; i<resp.device.length; i++){
					$scope.device = {};
					if(resp.device[i].fullPath){
						resp.device[i].fullPath = resp.device[i].fullPath.substring(resp.device[i].fullPath.lastIndexOf("•")+1);	
					}										
					list[i].online = online[list[i].online];
					list[i].btsStatus = bts[list[i].btsStatus];
				}
				$scope.device = resp;
			})
		}
		
		toogle.onclick = function() {
			if($('#cpuChart').width() == 558) { //图表在1920时自适应
				$('#cpuChart').width(498);
			} else if($('#cpuChart').width() == 498) {
				$('#cpuChart').width(558);
			} else if($('#cpuChart').width() == 313) { //图表在1366时自适应
				$('#cpuChart').width(373);
			} else if($('#cpuChart').width() == 373) {
				$('#cpuChart').width(313);
			} else if($('#cpuChart').width() == 498) { //图表在1280时自适应
				$('#cpuChart').width(413);
			} else if($('#cpuChart').width() == 413) {
				$('#cpuChart').width(498);
			}
			createCpuChart();
		}

		function addClass() {
			if($('.statistics').find('p').hasClass('animated bounceIn')) {
				$('.statistics').find('p').removeClass('animated bounceIn');
			} else {
				$('.statistics').find('p').addClass('animated bounceIn');
			}
		}

		//系统信息
		// 基于准备好的dom，初始化echarts实例
		function createCpuChart() {
			HttpService.get('rest/system/info/getSysInfo').then(function success(resp){
				$scope.system = {};
				var data = resp[0];
				data.httpd == 0 ? $scope.system.httpd='images/grey.png' : $scope.system.httpd='images/green.png';
				data.dpe == 0 ? $scope.system.dpe='images/grey.png' : $scope.system.dpe='images/green.png';
				data.tomcat == 0 ? $scope.system.tomcat='images/grey.png' : $scope.system.tomcat='images/green.png';
				data.mongodb == 0 ? $scope.system.mongodb='images/grey.png' : $scope.system.mongodb='images/green.png';
				data.redis == 0 ? $scope.system.redis='images/grey.png' : $scope.system.redis='images/green.png';
				data['3di'] == 0 ? $scope.system.di='images/grey.png' : $scope.system.di='images/green.png';
				var chartData = resp;
				chartData.reverse();
				var cpu = [],disk = [],memory=[],times=[];
				for(var i=0; i<chartData.length; i++){
					cpu.push(chartData[i].cpu);
					disk.push(chartData[i].disk);
					memory.push(chartData[i].memory);
					times.push(GetLocalTime(chartData[i].timestamp))
				}
				
				var myChart = echarts.init(document.getElementById('cpuChart'));
				// 指定图表的配置项和数据
				option = {
					title: {
						text: '',
						textStyle: {
							fontWeight: 'normal',
							fontSize: 16,
							color: '#F1F1F3'
						},
						left: 0,
						bottom: 0
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: {
								color: '#57617B'
							}
						}
					},
					legend: {
						icon: 'rect',
						itemWidth: 12,
						itemHeight: 8,
						itemGap: 13,
						data: ['CPU', '内存', '硬盘'],
						right: '4%',
						top: 20,
						textStyle: {
							fontSize: 12,
							color: '#000'
						}
					},
					grid: {
						left: '8%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						axisLine: {
							lineStyle: {
								color: '#57617B'
							}
						},
						data: []
						//data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
					}],
					yAxis: [{
						type: 'value',
						name: '%',
						axisTick: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#57617B'
							}
						},
						axisLabel: {
							margin: 10,
							textStyle: {
								fontSize: 12
							}
						},
						splitLine: {
							show: false
						}
					}],
					series: [{
						name: 'CPU',
						type: 'line',
						smooth: true,
						symbol: 'circle',
						symbolSize: 1,
						showSymbol: false,
						lineStyle: {
							normal: {
								width: 1
							}
						},
						itemStyle: {
							normal: {
								color: '#79ef95',
								borderColor: '#79ef95',
								borderWidth: 2
							}
						},
						data: []
						//data: [20, 82, 91, 34, 50, 20, 10, 25, 45, 22, 65, 22]
					}, {
						name: '硬盘',
						type: 'line',
						smooth: true,
						symbol: 'circle',
						symbolSize: 1,
						showSymbol: false,
						lineStyle: {
							normal: {
								width: 1
							}
						},
						itemStyle: {
							normal: {
								color: '#59678c',
								borderColor: '#59678c',
								borderWidth: 2
							}
						},
						data: []
						//data: [20, 10, 25, 45, 22, 65, 22, 20, 82, 91, 34, 50]
					}, {
						name: '内存',
						type: 'line',
						smooth: true,
						symbol: 'circle',
						symbolSize: 1,
						showSymbol: false,
						lineStyle: {
							normal: {
								width: 1
							}
						},
						itemStyle: {
							normal: {
								color: '#039f97',
								borderColor: '#039f97',
								borderWidth: 2
							}
						},
						data: []
						//data: [22, 18, 15, 14, 12, 91, 34, 50, 10, 11, 65, 12]
					}]
				};
				
				option.xAxis[0].data = times;
				option.series[0].data = cpu;
				option.series[1].data = disk;
				option.series[2].data = memory;
				myChart.setOption(option, true);
				
				$scope.$watch(function() {
		            return window.innerWidth;
		        }, function(newValue, oldValue) {
		            if (newValue != oldValue) {
		                myChart.resize;
		            }
		        });
		        
			})
		}

		//上号信息

		function createBarChart() {
			HttpService.get('rest/center/dashboard/record').then(function success(resp){
				$scope.info = {};
				$scope.info.imsiTotal = resp.imsiTotal.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
				$scope.info.macTotal = resp.macTotal.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
				$scope.info.macToday = resp.macToday.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
				$scope.info.imsiToday = resp.imsiToday.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
				$scope.info.today = resp.today;
				var list = resp.chartList;
				resp.chartList = resp.chartList.reverse();
				var xdata = [],imsiCount = [],macCount = [];
				times = {
					2 : '周一',
					3 : '周二',
					4 : '周三',
					5 : '周四',
					6 : '周五',
					7 : '周六',
					1 : '周日'
				}
				for(var i=0; i<list.length; i++){
					list[i].dayOfWeek = times[list[i].dayOfWeek];
					xdata.push(list[i].date);
					imsiCount.push(list[i].imsiCount);
					macCount.push(list[i].macCount)
				}
				var barChart = echarts.init(document.getElementById('barChart'));
				options = {
					title:{
						text: '最近一周上号量',
						left: '45%',
						textAlign: 'center',
						textStyle: {
							fontSize: 14
						}
					},
					legend: {
				        right: 10,
				        width: 100,
				        itemWidth: 15,
				        data: ['IMSI上号量', 'MAC上号量']
				    },
					color: ['#3398DB','#13b49f'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: [],
						//data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value',
						splitLine: {
							show: false
						}
					}],
					series: [
						{
							name: 'IMSI上号量',
							type: 'bar',
							barWidth: 10,
							data: []
							//data: [10, 52, 200, 334, 390, 330, 220]
						},
						{
							name: 'MAC上号量',
							type: 'bar',
							barWidth: 10,
							data: []
							//data: [10, 52, 200, 334, 390, 330, 220]
						}
					]
				};
				options.xAxis[0].data = xdata;
				options.series[0].data = imsiCount;
				options.series[1].data = macCount;
				barChart.setOption(options, true);
				//onresize = barChart.resize;
				$scope.$watch(function() {
		            return window.innerWidth;
		        }, function(newValue, oldValue) {
		            if (newValue != oldValue) {
		                barChart.resize;
		            }
		        });
			})
		}

		//常住人口
		function createPieChart() {
			HttpService.get('rest/center/dashboard/resident').then(function success(resp) {
				$scope.resident.total = resp.total.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
				$scope.resident.pie1 = resp.resident;
				$scope.resident.pie2 = resp.total - resp.resident;
				var pieChart = echarts.init(document.getElementById('pieChart'));
				option = {
					title:{
						text: '常住人口占比',
						left: '55%',
						textAlign: 'center',
						textStyle: {
							fontSize: 14
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					color: ['#95bdd6', '#448fb9'],
					series: [{
						type: 'pie',
						radius: '65%',
						center: ['50%', '50%'],
						selectedMode: 'single',
						data: [{
								value: 0,
								name: '常驻\n人口'
							},
							{
								value: 0,
								name: '非常驻\n人口'
							}
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				};

				option.series[0].data[0].value = $scope.resident.pie1;
				option.series[0].data[1].value = $scope.resident.pie2;
				pieChart.setOption(option, true);
				
				$scope.$watch(function() {
		            return window.innerWidth;
		        }, function(newValue, oldValue) {
		            if (newValue != oldValue) {
		                pieChart.resize;
		            }
		        });
		        
			});

		}

		//运营商
		function createNetChart() {
			HttpService.get('rest/center/dashboard/carrier').then(function success(resp) {
				$scope.nets = [
					{name : '移动', val : 0},
					{name : '联通', val : 0},
					{name : '电信', val : 0},
					{name : '其它', val : 0},
					{name : '境外', val : 0}
				];
				for(i in $scope.nets){
					if(resp[i]){
						$scope.nets[i].val = resp[i];
					}else{
						$scope.nets[i].val = 0;
					}
				}
				
				function compare(property){
			         return function(obj1,obj2){
			             var value1 = obj1[property];
			             var value2 = obj2[property];
			             return value2 - value1;     // 升序
			         }
			    }
			    $scope.nets = $scope.nets.sort(compare("val"));
				
				$scope.net = resp;
				var netChart = echarts.init(document.getElementById('netChart'));
				option = {
					title:{
						text: '运营商占比',
						left: '55%',
						textAlign: 'center',
						textStyle: {
							fontSize: 14
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {d}%"
					},
					color: ['#e16767', '#9d70be', '#2576a1', '#13b49f', '#f6be41'],
					series: [{
						type: 'pie',
						radius: '65%',
						center: ['50%', '50%'],
						selectedMode: 'single',
						data: [
							{
								value: 0,
								name: '移动'
							},
							{
								value: 0,
								name: '联通'
							},
							{
								value: 0,
								name: '电信'
							},
							{
								value: 0,
								name: '其它'
							},
							{
								value: 0,
								name: '境外'
							}
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				};
				var netData = option.series[0].data;
				for(i in netData){
					netData[i].value = resp[i];
				}
				netChart.setOption(option, true);
				//onresize = netChart.resize;
				$scope.$watch(function() {
		            return window.innerWidth;
		        }, function(newValue, oldValue) {
		            if (newValue != oldValue) {
		                netChart.resize;
		            }
		        });

			});

		}

		
		//归属地

		function createLegendChart() {
			HttpService.get('rest/center/dashboard/attribute').then(function success(resp){
				var legendChart = echarts.init(document.getElementById('legend-chart'));
				var datas = resp.slice(1,11);
				var count = [],provinceName = [];				
				for(var i=0;i<datas.length; i++){
					if(datas[i].provinceName == ''){
						datas[i].provinceName = '其它'
					}
					count.push(datas[i].percent);
					provinceName.push(datas[i].provinceName);
				}
				if(resp[0].provinceName != ''){
					$scope.legendData = resp[0];
				}else{
					$scope.legendData = resp[1];
				};
				option = {
					title: {
						text: '外省市占比',
						left: '55%',
						textAlign: 'center',
						textStyle: {
							fontSize: 14
						}
					},
					//提示框组件
				    tooltip: {
				    	//触发类型
				        trigger: 'axis',
				        //指示器
				        axisPointer: {
				            type: 'shadow'
				        },
				       	//提示悬浮文字
				        formatter: "{a} <br/>{b} : {c}"
				    },
				    legend: {
				        //data: ['2016年']
				    },
				    grid: {
				        left: '9%',
				        right: '8%',
				        bottom: '5%',
				        top:'2%',
				        containLabel: true
				    },
				    xAxis: {
				    	show: false,
				        type: 'value',
				        //name:'人数',
				        nameLocation:'end',
				        position:'top',
				        //去掉，坐标尺度
				        axisTick: {
				            show: false
				        },
				        axisLabel: {
				            interval: 0,
				            formatter: '{value}',
				        },
				        splitLine:{ 
                            show:false
              			}
				    },
				    yAxis: {				    	
				        type: 'category',
				        //name:'单位名称                         	',
				        nameLocation:'start',
				        axisTick: {
				            show: false
				        },
				        inverse:'true', //排序
				        data: [],
				        splitLine:{ 
                            show:false
              			},
              			
				        //data: ['公司1','公司1']
				    },
				    series: [{
				        //name: '2016年占比',
				        type: 'bar',
				        itemStyle: {
			                    normal: {
			                        color: '#26C0C0'
			                    }
			                },
			            data: [],
			            barWidth: 10,
			            label: {
			                normal: {
			                    show: true,
			                    position: 'right'
			                },
			                emphasis: {
			                    show: true
			                }
			            },
				        /*data: [42, 36, 35, 28, 21, 20, 15, 15, 5, 2]*/
				    }]
				};
				option.yAxis.data = provinceName;
				option.series[0].data = count;
				
				legendChart.setOption(option, true);
				//onresize = legendChart.resize;
				$scope.$watch(function() {
		            return window.innerWidth;
		        }, function(newValue, oldValue) {
		            if (newValue != oldValue) {
		                legendChart.resize;
		            }
		        });
			})
		}

		//地理视图

	}

});