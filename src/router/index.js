import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from 'components/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV);

// Vue-router在3.1之后把$router.push()改为了Promise,而默认其Promise没有处理错误的回调，所以会交给全局错误处理。
// 这里改写push，给push添加错误处理
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router);
/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
const constantRouterMap = [
    {path: '/login', component: _import('login/index'), hidden: true},
    {path: '/404', component: _import('errorPage/404'), hidden: true},
    {
        path: '/',
        redirect: '/login',
    },
];

const router =  new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})


const asyncRouterMap = [{
    path: '/overview',
    component: Layout,
    name: 'overview',
    children: [{
        path: 'index',
        name: 'overview/index',
        component: _import('overview/index'),
        meta: {title: '工作概览', icon: 'home'}
    }]
}, {
    path: '/equipment',
    component: Layout,
    name: 'equipment',
    meta: {title: '装备出入库', icon: '装备出入库'},
    children: [{
        path: 'storages',
        name: 'equipment/storages',
        component: _import('equipment/storages'),
        meta: {title: '入库单列表'},
    }, {
        path: 'equipinhouse',
        name: 'equipinhouse',
        component: _import('equipment/equipInhouse'),
        meta: {title: '装备入库'},
        hidden: true
    }, {
        path: 'equipinhouseorder',
        name: 'equipinhouseorder',
        component: _import('equipment/equipInhouseOrder'),
        meta: {title: '入库单列表/入库单详情'},
        hidden: true
    }, {
        path: 'equiphistoryOrder',
        name: 'equiphistoryOrder',
        component: _import('equipment/equiphistoryOrder'),
        meta: {title: '装备操作历史记录'},
        hidden: true
    }, {
        path: 'outstorage',
        name: 'equipment/outstorage',
        component: _import('equipment/outHouseOrder'),
        meta: {title: '出库单列表'},
    }, {
        path: 'equipment/equipouthouse',
        name: 'equipouthouse',
        component: _import('equipment/equipOutHouse'),
        meta: {title: '出库单列表/出库单列表详情'},
        hidden: true
    }, {
        path: 'equipArgsList',
        name: 'equipArgsList',
        component: _import('equipArgs/equipArgsList'),
        meta: {title: '装备参数列表'},
    }, {
        path: 'equipArgsEdit',
        name: 'equipArgsEdit',
        component: _import('equipArgs/equipArgsEdit'),
        meta: {title: '装备参数编辑'},
        hidden: true
    }, {
        path: 'equipmententity',
        name: 'equipment/equipmententity',
        component: _import('equipment/equipmentEntity'),
        meta: {title: '装备实体'},
    }, {
        path: 'equipAllocation',
        name: 'equipAllocation',
        component: _import('equipment/equipAllocation'),
        meta: {title: '装备实体/位置分配'},
        hidden: true
    }, {
        path: 'supplier',
        name: 'equipment/supplier',
        component: _import('equipment/supplier'),
        meta: {title: '供应商管理'},
    }]
}, {
    path: '/process',
    component: Layout,
    name: 'process',
    meta: {title: '流程管理', icon: '流程管理'},
    children: [
        {
            path: 'newProcess',
            name: 'newProcess',
            component: _import('process/newProcess'),
            meta: {title: '新启流程'}
        }, {
            path: 'myProcess',
            name: 'myProcess',
            component: _import('process/myProcess'),
            meta: {title: '我的流程'},
        }, {
            path: 'scrapApply', // 报废申请
            name: 'scrapApply',
            component: _import('process/scrapApply'),
            hidden: true,
        },  {
            path: 'allocateApply', // 调拨申请页面（调拨、直调）
            name: 'allocateApply',
            component: _import('process/allocate/allocateApply'),
            hidden: true,
        },  {
            path: 'allocateOut', // 调拨出库（调拨、直调）
            name: 'allocateOut',
            component: _import('process/allocate/allocateOut'),
            hidden: true,
        }, {
            path: 'allocateIn', // 调拨入库（调拨、直调）
            name: 'allocateIn',
            component: _import('process/allocate/allocateIn'),
            hidden: true,
        }, {
            path: 'agencyMatters',
            name: 'agencyMatters',
            component: _import('process/agencyMatters'),
            meta: {title: '待办事宜'},
        }, {
            path: 'completedMatters',
            name: 'completedMatters',
            component: _import('process/completedMatters'),
            meta: {title: '已办事宜'},
        }, {
            path: 'closedProcess',
            name: 'closedProcess',
            component: _import('process/closedProcess'),
            meta: {title: '办结事宜'},
        }]
}, {
    path: '/equipmentOperation',
    component: Layout,
    name: 'equipmentOperation',
    meta: {title: '维保充电', icon: '维保充电'},
    children: [{
        path: 'textCharge',
        name: 'textCharge',
        component: _import('equipmentOperation/newCharge'),
        meta: {title: '充电'},
    }, {
        path: 'maintenance',
        name: 'maintenance',
        component: _import('equipmentOperation/maintenance/index'),
        meta: {title: '保养'},
    },  {
        path: 'startMaintenance',
        name: 'startMaintenance',
        component: _import('equipmentOperation/maintenance/startMaintenance'),
        meta: {title: '开始保养'},
        hidden: true,
    }, {
        path: 'endMaintenance',
        name: 'endMaintenance',
        component: _import('equipmentOperation/maintenance/endMaintenance'),
        meta: {title: '结束保养'},
        hidden: true,
    }, {
        path: 'serviceapplication',
        name: 'serviceapplication',
        component: _import('equipmentOperation/serviceApplicationInfo'),
        meta: {title: '维修申请'},
    }, {
        path: 'startservice',
        name: 'startservice',
        component: _import('equipmentOperation/startService'),
        meta: {title: '维修申请/开始维修'},
        hidden: true
    }, {
        path: 'rightservice',
        name: 'rightservice',
        component: _import('equipmentOperation/rightService'),
        meta: {title: '正在维修'},
    }, {
        path: 'endservice',
        name: 'endservice',
        component: _import('equipmentOperation/endService'),
        meta: {title: '正在维修/结束维修'},
        hidden: true
    }]
}, {
    path: '/warehouse',
    component: Layout,
    name: 'warehouse',
    meta: {title: '库房管理', icon: '库房管理'},
    children: [{
        path: 'safetyNew',
        name: 'warehouse/safetyNew',
        component: _import('warehouse/safetyNew'),
        meta: {title: '安全库存'},
    }, {
        path: 'surroundings',
        name: 'warehouse/surroundings',
        component: _import('surroundings/index'),
        meta: {title: '环境管理'},
    }, {
        path: 'inventoryList',
        name: 'inventoryList',
        component: _import('warehouse/inventory/inventoryList'),
        meta: {title: '盘点'},
    }, {
        path: 'inventoryInfo',
        name: 'inventoryInfo',
        component: _import('warehouse/inventory/inventoryInfo'),
        hidden: true,
    }, {
        path: 'addPersonal',
        name: 'addPersonal',
        component: _import('warehouse/addPersonal'),
        hidden: true,
    }, {
        path: 'personnelManagement',
        name: 'warehouse/personnelManagement',
        component: _import('warehouse/personnelManagement'),
        meta: {title: '人员管理'},
    }, {
        path: 'cabinetManagement',
        name: 'cabinet/cabinetManagement',
        component: _import('cabinet/cabinetManagement'),
        meta: {title: '警柜管理'}
    }, {
        path: 'needwear',
        name: 'warehouse/needWear',
        component: _import('warehouse/needWear'),
        meta: {title: '佩戴率设置'},
    }, {
        path: 'addneedwear',
        name: 'addneedwear',
        component: _import('warehouse/addNeedWear'),
        hidden: true,
        meta: {title: '佩戴率设置/新增必戴装备'},
    }, {
        path: 'plan',
        name: 'warehouse/plan',
        component: _import('warehouse/plan'),
        meta: {title: '应急预案'},
    }, {
        path: 'editplan',
        name: 'editplan',
        component: _import('warehouse/editPlan'),
        hidden: true,
    }, {
        path: 'consumables',
        name: 'warehouse/consumable',
        component: _import('warehouse/consumable'),
        meta: {title: '耗材管理'},
    }, {
        path: 'consumableReceive',
        name: 'warehouse/consumableReceive',
        component: _import('warehouse/consumableReceive'),
        meta: {title: '耗材管理'},
        hidden: true,
    }, {
        path: 'expired',
        name: 'warehouse/expired',
        component: _import('warehouse/expired'),
        meta: {title: '到期报废'},
    }, {
        path: 'scrapList',
        name: 'scrapList',
        component: _import('warehouse/scrap/scrapList'),
        meta: {title: '装备报废'},
    }, {
        path: 'scrapInfo',
        name: 'scrapInfo',
        component: _import('warehouse/scrap/scrapInfo'),
        hidden: true
    }, {
        path: 'training',
        name: 'warehouse/training',
        component: _import('warehouse/training'),
        meta: {title: '教学培训'},
    }, {
        path: 'editTraining',
        name: 'editTraining',
        component: _import('warehouse/editTraining'),
        hidden: true
    }, {
        path: 'trainingShow',
        name: 'trainingShow',
        component: _import('warehouse/trainingshow'),
        hidden: true
    }, {
        path: 'unReturn',
        name: 'warehouse/unReturn',
        component: _import('warehouse/unReturn'),
        meta: {title: '未归还'},
    }]
}, {
    path: '/report',
    component: Layout,
    name: 'report',
    meta: {title: '统计报表', icon: '统计报表'},
    children: [{
        path: 'amount',
        name: 'amount',
        component: _import('report/amount'),
        meta: {title: '装备金额统计'},
    }, {
        path: 'lossStatistics',
        name: 'lossStatistics',
        component: _import('report/lossStatistics'),
        meta: {title: '装备损耗率'},
    }, {
        path: 'repair',
        name: 'repair',
        component: _import('report/repair'),
        meta: {title: '装备维修率'},
    }, {
        path: 'frequency',
        name: 'frequency',
        component: _import('report/frequency'),
        meta: {title: '装备使用频次'},
    }, {
        path: 'scrap',
        name: 'scrap',
        component: _import('report/scrap'),
        meta: {title: '装备报废件数'},
    }, {
        path: 'wate',
        name: 'wate',
        component: _import('report/wareRateAmount'),
        meta: {title: '装备佩戴率'}
    }]
}, {
    path: '/record',
    component: Layout,
    name: 'record',
    meta: {title: '记录管理', icon: '记录管理'},
    children: [{
        path: 'openGate',
        name: 'openGate',
        component: _import('record/openGate'),
        meta: {title: '开门记录'},
    }, {
        path: 'openCabinet',
        name: 'openCabinet',
        component: _import('record/openCabinet'),
        meta: {title: '开柜记录'},
    }, {
        path: 'RROList',
        name: 'RROList',
        component: _import('record/receiveReturnOrder/RROList'),
        meta: {title: '领取归还记录'},
    }, {
        path: 'RROInfo',
        name: 'RROInfo',
        component: _import('record/receiveReturnOrder/RROInfo'),
        hidden: true
    }, {
        path: 'chargingRecord',
        name: 'chargingRecord',
        component: _import('record/chargingRecord'),
        meta: {title: '充电记录'},
    }, {
        path: 'maintenanceRecord',
        name: 'maintenanceRecord',
        component: _import('record/maintenanceOrder'),
        meta: {title: '保养单'},
    }, {
        path: 'maintenanceReturn',
        name: 'maintenanceReturn',
        component: _import('record/maintenanceReturn'),
        meta: {title: '保养归还单'},
    }, {
        path: 'maintenanceOrderDetails',
        name: 'maintenanceOrderDetails',
        component: _import('record/MaintenanceDetails'),
        hidden: true,
        meta: {title: '保养单/保养单详情'},
    }, {
        path: 'equipAllocationOrder',
        name: 'equipAllocationOrder',
        component: _import('record/equipAllocationOrder'),
        meta: {title: '位置变更单'},
    }, {
        path: 'serviceOrder',
        name: 'serviceOrder',
        component: _import('record/serviceOrder'),
        meta: {title: '维修单'},
    }, {
        path: 'serviceDetails',
        name: 'serviceDetails',
        component: _import('record/serviceDetails'),
        hidden: true,
        meta: {title: '维修单/维修单详情'},
    }, {
        path: 'serviceReturn',
        name: 'serviceReturn',
        component: _import('record/serviceReturn'),
        meta: {title: '维修归还单'},
    }, {
        path: 'serviceApplicationOrder',
        name: 'serviceApplicationOrder',
        component: _import('record/serviceApplicationOrder'),
        meta: {title: '维修申请记录'},
    }, {
        path: 'consumablerecord',
        name: 'consumablerecord',
        component: _import('record/consumablerecord'),
        meta: {title: '耗材记录'}
    }, {
        path: 'consumablerecordInfo',
        name: 'consumablerecordInfo',
        component: _import('record/consumablerecordInfo'),
        meta: {title: '耗材记录/耗材详情单'},
        hidden: true,
    }]
}, {
    path: '/message',
    component: Layout,
    name: 'message',
    hidden: true,
    children: [{
        path: 'index',
        name: 'message/index',
        component: _import('message/index'),
        meta: {title: '消息中心', icon: '消息中心'},
    }]
}, {
    path: '/private',
    component: Layout,
    meta: {},
    children: [{
        path: 'index',
        name: 'private/index',
        component: _import('private/index'),
        meta: {title: '个人中心'},
    }],
    hidden: true
}, {
    path: '/test',
    component: Layout,
    children: [{
        path: 'index',
        name: 'test',
        component: _import('test/test'),
        meta: {title: '开发测试'}
    }]
}, {
    path: '*', redirect: '/404', hidden: true
}
]

export default router
export { constantRouterMap, asyncRouterMap }
