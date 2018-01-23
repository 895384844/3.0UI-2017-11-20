define([
	'angular'
], function (angular) {
	'use strict';
	angular.module('webApp.menu', [])
		.constant('MENU_GROUPS', [
			{
				 name: '首页',
				 id: 'main_home',
				 icon: 'fa-home',
				 default: true,
				 active:true,
				 templateUrl: 'js/modules/app/templates/home.html'
			},
   			{
				name: '设备管理',
				icon: 'fa-laptop',
				code: 'DEVICE_MANAGEMENT',
				subMenus: [
					{
						name: '手机热点采集设备',
						id: 'device_list',
						templateUrl: 'js/modules/device/templates/device_list.html'
					},
					{
						name: '车辆信息采集设备',
						id: 'vehicle_list',
						templateUrl: 'js/modules/device/templates/vehicle_list.html'
					}
				]
			},
			{
				name: '信息检索',
				icon: 'fa-clipboard',
				code: 'INFORMATION_RETRIEVAL',
				subMenus: [
					{
						name: '手机侦码查询',
						id: 'report_history',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/report/templates/report_history.html'
					},
					{
						name: '常住人口查询',
						id: 'resident_analysis',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/report/templates/resident_analysis.html'
					},					
					{
						name: '终端Mac查询',
						id: 'wifi',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/report/templates/wifi.html'
					},
					{
						name: '车辆信息查询',
						id: 'vehicle',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/report/templates/vehicle.html'
					}
				]
			},
			{
				name: '数据分析',
				icon: 'fa-bar-chart',
				code: 'DATA_ANALYSIS',
				subMenus: [
					
					{
						name: '碰撞分析',/*
						id: 'across_analysis',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/report/templates/across_analysis.html'*/
						subMenus: [
							{
								name: '手机侦码碰撞分析',
								id: 'across_analysis',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/across_analysis.html'
							},
							{
								name: '车辆碰撞分析',
								id: 'vehicle_collision',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/vehicle_collision.html'
							}
						]
					},
					{
						name: '伴随分析',
						subMenus: [
							{
								name: '手机侦码伴随分析',
								id: 'partner_analysis',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/partner_analysis.html'
							},
							{
								name: 'IMSI-MAC关联分析',
								id: 'accompany_imsi',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/accompany_imsi.html'
							},
							{
								name: 'IMSI-车牌关联分析',
								id: 'accompany_vehicle',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/accompany_vehicle.html'
							}
						]
					},					
					{
						name: '轨迹分析',
						subMenus: [
							{
								name: '手机侦码轨迹分析',
								id: 'trace_log',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								data: '',
								templateUrl: 'js/modules/report/templates/trace_log.html'
							},					
							{
								name: '车辆轨迹分析',
								id: 'vehicle_trace',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								data: '',
								templateUrl: 'js/modules/report/templates/vehicle_trace.html'
							}
						]
					},
					{
						name: '流量分析',
						subMenus: [
							{
								name: '手机侦码流量分析',
								id: 'traffic_analysis',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/traffic_analysis.html'
							},
							{
								name: '终端MAC流量分析',
								id: 'traffic_wifi',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/traffic_wifi.html'
							},
							{
								name: '车辆采集流量分析',
								id: 'traffic_vehicle',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/traffic_vehicle.html'
							}
						]
					},
					{
						name: '归属地分析',
						subMenus: [
							{
								name: '手机侦码归属地分析',
								id: 'belonging',
								//permissions:'ALARM_READ,ALARM_MANAGE',
								templateUrl: 'js/modules/report/templates/belonging.html'
							}
						]
					}										
				]
			},
			{
				name: '布控预警',
				code: 'SURVEILLANCE',
				icon: 'fa-exclamation-triangle',
				// permissions:'ALARM_READ,ALARM_MANAGE',
				subMenus: [					
					{
						name: '重点人员布控',
						id: 'black_list',
						templateUrl: 'js/modules/base/templates/black_list.html'
					},
					{
						name: '目标通知策略',
						id: 'backlist_alarm_notify_policy',
						templateUrl: 'js/modules/base/templates/backlist_alarm_notify_policy.html'
					},
					{
						name: '设备通知策略',
						id: 'device_alarm_notify_policy',
						templateUrl: 'js/modules/base/templates/device_alarm_notify_policy.html'
					},
					{
						name: '通知人员',
						id: 'bus_user',
						templateUrl: 'js/modules/base/templates/bus_user.html'
					}
				]
			},
			{
				name: '告警查询',
				icon: 'fa-bell',
				code: 'ALARM',
				// permissions:'ALARM_READ,ALARM_MANAGE',
				subMenus: [					
					{
						name: '设备告警',
						id: 'warning_device',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/warning/templates/warning_device.html'
					},
					{
						name: 'IMSI告警',
						id: 'warning_blacklist',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/warning/templates/warning_blacklist.html'
					},
					{
						name: '系统告警',
						id: 'warning_system',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/warning/templates/warning_system.html'
					},
					{
						name: '短信通知',
						id: 'notify_log',
						//permissions:'ALARM_READ,ALARM_MANAGE',
						templateUrl: 'js/modules/report/templates/notify_log.html'
					}
				]
			},
			{
				name: '案件管理',
				icon: 'fa-server',
				code: 'CASE_MANAGEMENT',
				subMenus: [
					{
						name: '案件管理',
						id: 'case',
						templateUrl: 'js/modules/case/templates/case_list.html'
					}
				]
			},
			{
				name: '地图应用',
				icon: 'fa-globe',
				code: 'GEOGRAPHIC_INFORMATION',
				subMenus: [
					{
						name: '设备视图',
						id: 'map',
						templateUrl: 'js/modules/map/templates/map.html'
					}
				]
			},
			{
				name: '域组管理',
				icon: 'fa-object-group',
				code: 'DOMAIN_MANAGEMENT',
				subMenus: [
					{
						name: '管理域',
						id: 'system_scope',
						//permissions:'SYSTEM_LOG_READ,SYSTEM_LOG_CONFIG',
						templateUrl: 'js/modules/system/templates/scope.html'
					}
				]
			},
			{
				name: '用户管理',
				icon: 'fa-user',
				code: 'USER_MANAGEMENT',
				subMenus: [
					{
						name: '用户管理',
						id: 'system_user',
						permissions: 'SYSTEM_USER_CONFIG,SYSTEM_USER_READ',
						templateUrl: 'js/modules/system/templates/user.html'
					}
				]
			},
			{
				name: '系统管理',
				icon: 'fa-cogs',
				code: 'SYSTEM_MANAGEMENT',
				// permissions:'SYSTEM_USER_CONFIG,SYSTEM_USER_READ,SYSTEM_ROLE_READ,SYSTEM_ROLE_CONFIG,SYSTEM_SCOPE_READ,SYSTEM_SCOPE_CONFIG,SYSTEM_LOG_READ,SYSTEM_LOG_CONFIG,SYSTEM_CONFIG_READ,SYSTEM_CONFIG_READ',
				subMenus: [
					/*{
						name: '用户管理',
						id: 'system_user',
						permissions: 'SYSTEM_USER_CONFIG,SYSTEM_USER_READ',
						templateUrl: 'js/modules/system/templates/user.html'
					},*/
					{
						name: '授权管理',
						id: 'system_license',
						//permissions:'SYSTEM_LOG_READ,SYSTEM_LOG_CONFIG',
						templateUrl: 'js/modules/system/templates/license.html'
					},
					/*{
						name: '管理域',
						id: 'system_scope',
						//permissions:'SYSTEM_LOG_READ,SYSTEM_LOG_CONFIG',
						templateUrl: 'js/modules/system/templates/scope.html'
					},*/
					{
						name: '系统设置',
						id: 'system_configure',
						permissions: 'SYSTEM_CONFIG_READ,SYSTEM_CONFIG_WRITE',
						templateUrl: 'js/modules/system/templates/configure.html'
					}

				]
			},
			/*{
				name: '日志审计',
				icon: 'fa-calendar-check-o',
				code: 'AUDIT_TRAIL',
				subMenus: [
					{
						name: '日志审计',
						id: 'audit_log',
						templateUrl: 'js/modules/system/templates/auditLog.html'
					}
				]
			},*/
			{
				name: '系统工具',
				icon: 'fa-wrench',
				code: 'SYSTEM_TOOL',
				subMenus: [
					/*{
						name: '重置密码',
						id: 'device_list',
						templateUrl: 'js/modules/device/templates/device_list.html'
					},*/
					{
						name: '定制化信息',
						id: 'customization',
						templateUrl: 'js/modules/tools/templates/customization.html'
					}
				]
			}
		]);


});