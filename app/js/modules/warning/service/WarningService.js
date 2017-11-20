define(function(){
    return [ '$q', 'HttpService','SystemService','BaseService',WaringService];

    function WaringService( $q,HttpService,SystemService,BaseService){

        return {
            init:function($scope){
                BaseService.getVendors().then(function(data){
                    $scope.vendors = data.items;
                });
                BaseService.getDevicetypes().then(function(data){
                    $scope.deviceTypes = data.items;
                });
                BaseService.getFirmwares().then(function(data){
                    $scope.firmwares = data.items;
                });
                SystemService.getScopes().then(function(data){
                    $scope.scopes = data.items;
                });
            },
            original_config:{
                colNames: ['ID','告警级别','设备IMSI','厂商','设备类型',
                          '固件版本','管理域','可能原因','报警标识','管理对象实例',
                          '事件类型','特定问题','附加信息','是否认领','认领用户',
                          '事件日期','认领时间','创建时间'],
                colModel: [
                    { name: 'id', index: 'id', width: 60, sorttype: "int"},
                    {name: 'perceivedSeverityLevel', index: 'perceivedSeverityLevel', width: 100, sortable: true, align: 'center'},
                    {name: 'dkey', index: 'dkey', width: 100, sortable: true, align: 'center'},
                    {name: 'vendorName', index: 'vendorName', width: 200, sortable: true, align: 'center'},
                    {name: 'deviceType', index: 'deviceType', width: 100, sortable: true, align: 'center'},

                    {name: 'firmwareVersion', index: 'firmwareVersion', width: 100, sortable: true, align: 'center',hidden:true},
                    {name: 'domain', index: 'domain', width: 100, sortable: true, align: 'center',hidden:true},
                    {name: 'probableCause', index: 'probableCause', width: 200, sortable: true, align: 'center',hidden:true},
                    {name: 'alarmIdentifier', index: 'alarmIdentifier', width: 100, sortable: true, align: 'center',hidden:true},
                    {name: 'managedObjectInstance', index: 'managedObjectInstance', width: 100, sortable: true, align: 'center',hidden:true},

                    {name: 'eventType', index: 'eventType', width: 100, sortable: true, align: 'center',hidden:true},
                    {name: 'specificProblem', index: 'specificProblem', width: 100, sortable: true, align: 'center',hidden:true},
                    {name: 'additionalInformation', index: 'additionalInformation', width: 200, sortable: true, align: 'center',hidden:true},
                    {name: 'ack', index: 'ack', width: 100, sortable: true, align: 'center',hidden:true},
                    {name: 'userName', index: 'userName', width: 100, sortable: true, align: 'center',hidden:true},

                    {name: 'eventTime', index: 'eventTime', width: 100, sortable: true, align: 'center'},
                    {name: 'ackDate', index: 'ackDate', width: 100, sortable: true, align: 'center'},
                    {name: 'createTime', index: 'createTime', width: 200, sortable: true, align: 'center'},
                ],

                formatter: 'actions',
                formatoptions: {
                    keys: true,
                    editformbutton: true
                },
                uri:'device/alarm/get'
            },
            compliant_config : {
                colNames: [
                    'ID','厂商','固件版本','厂商告警ID','告警严重性',
                    '告警类型','名称','网元ID','网元名称','系统名称',
                    '中央处理单元','网管告警类型','可能原因','告警逻辑单元','告警逻辑子单元',
                    '对业务影响','对设备影响','是否认领','认领用户','认领信息',
                    '描述','清除时间','认领时间','采集时间','接受时间'
                ],
                colModel: [
                    {name: 'id', index: 'id', width: 60, sorttype: "int"},
                    {name: 'vendorName', index: 'vendorName',  sortable: true, align: 'center'},
                    {name: 'firmwareVersion', index: 'firmwareVersion', sortable: true, align: 'center'},
                    {name: 'vendorAlarmId', index: 'vendorAlarmId', width: 200, sortable: true, align: 'center'},
                    {name: 'severity', index: 'severity', width: 100, sortable: true, align: 'center'},

                    {name: 'alarmType', index: 'alarmType', width: 100, sortable: true, align: 'center'},
                    {name: 'name', index: 'name', sortable: true, align: 'center'},
                    {name: 'elementId', index: 'elementId', width: 200, sortable: true, align: 'center'},
                    {name: 'elementName', index: 'elementName', width: 100, sortable: true, align: 'center'},
                    {name: 'systemName', index: 'systemName', width: 100, sortable: true, align: 'center'},

                    {name: 'cpu', index: 'cpu', width: 100, sortable: true, align: 'center'},
                    {name: 'nmAlarmType', index: 'nmAlarmType', sortable: true, align: 'center'},
                    {name: 'probableCause', index: 'probableCause', width: 200, sortable: true, align: 'center'},
                    {name: 'alarmLu', index: 'alarmLu', width: 100, sortable: true, align: 'center'},
                    {name: 'alarmSlu', index: 'alarmSlu', width: 100, sortable: true, align: 'center'},

                    {name: 'businessInfluence', index: 'businessInfluence', width: 100, sortable: true, align: 'center'},
                    {name: 'deviceInfluence', index: 'deviceInfluence', sortable: true, align: 'center'},
                    {name: 'acked', index: 'acked', width: 200, sortable: true, align: 'center'},
                    {name: 'ackedUser', index: 'ackedUser', width: 100, sortable: true, align: 'center'},
                    {name: 'ackInfo', index: 'ackInfo', width: 100, sortable: true, align: 'center'},

                    {name: 'detail', index: 'detail', width: 100, sortable: true, align: 'center'},
                    {name: 'clearTime', index: 'clearTime', sortable: true, align: 'center'},
                    {name: 'ackedTime', index: 'ackedTime', width: 200, sortable: true, align: 'center'},
                    {name: 'eventTime', index: 'eventTime', width: 100, sortable: true, align: 'center'},
                    {name: 'createTime', index: 'createTime', width: 100, sortable: true, align: 'center'}
                ],

                formatter: 'actions',
                formatoptions: {
                    keys: true,
                    editformbutton: true
                },
                uri:'device/alarm/get'
            },
            remove:function(selection,$scope){
                if (selection.length<=0){
                    $scope.showNoItemDialog(
                        '请选择',
                        '请选择需要删除的告警'
                    );
                    return;
                }
                DialogService.showConfirm(
                    '删除日志',
                    '确定要删除选中告警？',
                    function() {
                        loading = true;
                        ids=[];
                        for (var i in selection){
                            ids.push(selection[i].id);
                        }
                        HttpService.post('deivce/alarm/delete',{ids:ids}).then(function success(data){

                            },
                            function failure(error){
                                
                            })
                            .finally(function(){
                                loading = false;
                            });
                    }, null
                );
            }

        };
    }
});
