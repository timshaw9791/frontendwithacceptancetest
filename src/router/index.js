import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from 'components/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV);

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
export const constantRouterMap = [
    {path: '/login', component: _import('login/index'), hidden: true},
    {path: '/404', component: _import('errorPage/404'), hidden: true},


    {
        path: '/',
        redirect: '/login',
        // component: Layout,
        // name: 'dashboard',
        // redirect: '/overview/index',
        // hidden: true,
        // children: [{
        //     path: 'dashboard',
        //     component: _import('dashboard/index')
        // }]
    },

];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

export const asyncRouterMap = [
    {
        path: '/overview',
        component: Layout,
        name: 'overview',
        children: [
            {
                path: 'index',
                name: 'overview/index',
                component: _import('overview/index'),
                meta: {title: '工作概览', icon: 'home'},
            }
        ]
    },
    {
        path: '/equipment',
        component: Layout,
        name: 'equipment',
        meta: {title: '装备出入库', icon: '装备出入库', roles: ['ADMINISTRATOR']},
        children: [
            {
                path: 'storage',
                name: 'equipment/storage',
                component: _import('equipment/storage'),
                meta: {title: '装备入库'},
            },
            {
                path: 'outstorage',
                name: 'equipment/outstorage',
                component: _import('equipment/outStorageInfo'),
                meta: {title: '装备出库'},
            },
            {
                path: 'paramstorage',
                name: 'equipment/parameter',
                component: _import('equipment/paramStorageInfo'),
                meta: {title: '装备参数'},
            },
            {
                path: 'searchstorage',
                name: 'equipment/search',
                component: _import('equipment/searchStorageInfo'),
                meta: {title: '装备搜索'},
            },
            {
                path: 'supplier',
                name: 'equipment/supplier',
                component: _import('equipment/supplier'),
                meta: {title: '供应商管理'},
            },

        ]
    },
    {
        path: '/process',
        component: Layout,
        name: 'process',
        meta: {title: '流程管理', icon: '流程管理'},
        children: [
            {
                path: 'myProcess',
                name: 'myProcess',
                component: _import('process/myProcess'),
                meta: {title: '我的流程'},
            },
            {
                path: 'agencyMatters',
                name: 'agencyMatters',
                component: _import('process/agencyMatters'),
                meta: {title: '待办事宜'},
            },
            {
                path: 'completedMatters',
                name: 'completedMatters',
                component: _import('process/completedMatters'),
                meta: {title: '已办事宜'},
            },
            {
                path: 'handlingMatters',
                name: 'handlingMatters',
                component: _import('process/handlingMatters'),
                meta: {title: '办结事宜'},
            },
            {
                path: 'listOfApplication',
                name: 'listOfApplication',
                component: _import('process/listOfApplication'),
                meta: {title: '申请单列表'},
            }
            // {
            //     path: 'scrapped',
            //     name: 'scrapped',
            //     component: _import('process/scrapped'),
            //     meta: {title: '报废流程'},
            // },
            // {
            //     path: 'secondment',
            //     name: 'secondment',
            //     component: _import('process/secondment'),
            //     meta: {title: '借调流程'},
            // },
            // {
            //     path: 'transfer',
            //     name: 'transfer',
            //     component: _import('process/transfer'),
            //     meta: {title: '调拨流程'},
            // },
            // {
            //     path: 'directAdjustment',
            //     name: 'directAdjustment',
            //     component: _import('process/directAdjustment'),
            //     meta: {title: '直调流程'},
            // },
            // {
            //     path: 'secondment',
            //     name: 'secondment',
            //     component: _import('process/secondment'),
            //     meta: {title: '借调流程'},
            // },
            // {
            //     path: 'bill',
            //     name: 'bill',
            //     component: _import('process/bill'),
            //     meta: {title: '报废申请单'},
            //     hidden: true,
            // },
        ]
    },
    {
        path: '/equipmentOperation',
        component: Layout,
        name: 'equipmentOperation',
        meta: {title: '维保充电', icon: '维保充电', roles: ['ADMINISTRATOR']},
        children: [
            {
                path: 'charging',
                name: 'charging',
                component: _import('equipmentOperation/charging'),
                meta: {title: '充电'},
            },
            {
                path: 'maintenance',
                name: 'maintenance',
                component: _import('equipmentOperation/maintenance'),
                meta: {title: '保养'},
            },
            {
                path: 'service',
                name: 'service',
                component: _import('equipmentOperation/service'),
                meta: {title: '维修'},
            }
        ]
    },
    {
        path: '/warehouse',
        component: Layout,
        name: 'warehouse',
        meta: {title: '库房管理', icon: '库房管理', roles: ['ADMINISTRATOR']},
        children: [
            {
                path: 'safety',
                name: 'warehouse/safety',
                component: _import('warehouse/safety'),
                meta: {title: '安全库存'},
            },
            {
                path: 'surroundings',
                name: 'warehouse/surroundings',
                component: _import('surroundings/index'),
                meta: {title: '环境管理'},
            },
            {
                path: 'inventory',
                name: 'warehouse/inventory',
                component: _import('warehouse/inventory'),
                meta: {title: '盘点'},
            },
            {
                path: 'personnelManagement',
                name: 'warehouse/personnelManagement',
                component: _import('personnelManagement/personnelManagement'),
                meta: {title: '人员管理'},
            },
            {
                path: 'plan',
                name: 'warehouse/plan',
                component: _import('warehouse/plan'),
                meta: {title: '应急预案'},
            },
            {
                path: 'consumables',
                name: 'warehouse/consumable',
                component: _import('warehouse/consumable'),
                meta: {title: '耗材管理'},
            },
            {
                path: 'expired',
                name: 'warehouse/expired',
                component: _import('warehouse/expired'),
                meta: {title: '到期报废'},
            },
            {
                path: 'training',
                name: 'warehouse/training',
                component: _import('training/index'),
                meta: {title: '教学培训'},
            },
            {
                path: 'noreturn',
                name: 'warehouse/noreturn',
                component: _import('warehouse/noReturn'),
                meta: {title: '未归还'},
            },
            // {
            //     path: 'info',
            //     name: 'warehouse/info',
            //     component: _import('warehouse/info'),
            //     meta: {title: '库房信息'},
            // },
        ]
    },
    {
        path: '/report',
        component: Layout,
        name: 'report',
        meta: {title: '统计报表', icon: '统计报表', roles: ['ADMINISTRATOR']},
        children: [
            {
                path: 'amount',
                name: 'amount',
                component: _import('report/amount'),
                meta: {title: '装备金额统计', roles: ['ADMINISTRATOR']},
            }, {
                path: 'lossStatistics',
                name: 'lossStatistics',
                component: _import('report/lossStatistics'),
                meta: {title: '装备损耗率', roles: ['ADMINISTRATOR']},
            },
            {
                path: 'repair',
                name: 'repair',
                component: _import('report/repair'),
                meta: {title: '装备维修率', roles: ['ADMINISTRATOR']},
            },
            {
                path: 'frequency',
                name: 'frequency',
                component: _import('report/frequency'),
                meta: {title: '装备使用频次', roles: ['ADMINISTRATOR']},
            },
            {
                path: 'scrap',
                name: 'scrap',
                component: _import('report/scrap'),
                meta: {title: '装备报废件数', roles: ['ADMINISTRATOR']},
            }
        ]
    },
    {
        path: '/record',
        component: Layout,
        name: 'record',
        meta: {title: '记录管理', icon: '记录管理', roles: ['POLICE_OFFICER', 'ADMINISTRATOR']},
        children: [
            {
                path: 'opening',
                name: 'opening',
                component: _import('record/opening'),
                meta: {title: '开门记录', roles: ['ADMINISTRATOR']},
            },
            {
                path: 'borrow',
                name: 'borrow',
                component: _import('record/borrow'),
                meta: {title: '出入记录', roles: ['POLICE_OFFICER', 'ADMINISTRATOR']},
            },
            {
                path: 'inventory',
                name: 'inventory',
                component: _import('record/inventory'),
                meta: {title: '盘点记录', roles: ['ADMINISTRATOR']},
            },
            {
                path: 'chargingRecord',
                name: 'chargingRecord',
                component: _import('record/chargingRecord'),
                meta: {title: '充电记录', roles: ['ADMINISTRATOR']},
            },
            {
                path: 'maintenanceRecord',
                name: 'maintenanceRecord',
                component: _import('record/maintenanceRecord'),
                meta: {title: '保养记录', roles: ['ADMINISTRATOR']},
            },
            {
                path: 'serviceRecord',
                name: 'serviceRecord',
                component: _import('record/serviceRecord'),
                meta: {title: '维修记录', roles: ['ADMINISTRATOR']},
            },
            {
                path: 'scraded',
                name: 'scraded',
                component: _import('record/scraded'),
                meta: {title: '报废记录', roles: ['POLICE_OFFICER', 'ADMINISTRATOR']},
            },
            {
                path: 'consumablerecord',
                name: 'consumablerecord',
                component: _import('record/consumablerecord'),
                meta: {title: '耗材记录', roles: ['ADMINISTRATOR']},
            }
            // {
            //     path: 'maintenanceRecord',
            //     name: 'maintenanceRecord',
            //     component: _import('record/maintenanceRecord'),
            //     meta: {title: '维保记录', roles: ['ADMINISTRATOR']},
            // },
        ]
    },

    // {
    //     path: '/report',
    //     component: Layout,
    //     name: 'report',
    //     meta: {roles: ['ADMINISTRATOR']},
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'report/index',
    //             component: _import('report/index'),
    //             meta: {title: '统计报表', icon: '统计报表'},
    //         },
    //     ]
    // },
    // {
    //     path: '/personnel',
    //     component: Layout,
    //     name: 'personnel',
    //     meta: {title: '人员管理', icon: '人员管理', roles: ['ADMINISTRATOR']},
    //     children: [
    //         {
    //             path: 'info',
    //             name: 'info',
    //             component: _import('personnelManagement/personnelManagement'),
    //             meta: {title: '人员信息', icon: '人员管理'},
    //         },
    //         {
    //             path: 'permission',
    //             name: 'permission',
    //             component: _import('personnel/permission'),
    //             hidden: true,
    //             meta: {title: '权限'},
    //         },
    //     ]
    // },
    // {
    //     path: '/surroundings',
    //     component: Layout,
    //     name: 'surroundings',
    //     meta: {roles: ['ADMINISTRATOR']},
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'surroundings/index',
    //             component: _import('surroundings/index'),
    //             meta: {title: '环境管理', icon: '环境控制'},
    //         },
    //     ]
    // },
    // {
    //     path: '/training',
    //     component: Layout,
    //     name: 'training',
    //     meta: {roles: ['ADMINISTRATOR']},
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'training/index',
    //             component: _import('training/index'),
    //             meta: {title: '教学培训', icon: '教学培训'},
    //         },
    //     ]
    // },
    // {
    //     path: '/category',
    //     component: Layout,
    //     name: 'category',
    //     meta: {roles: ['ADMINISTRATOR']},
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'category/index',
    //             component: _import('category/index'),
    //             meta: {title: '装备小类', icon: '装备小类'},
    //         },
    //     ]
    // },
    {
        path: '/message',
        component: Layout,
        name: 'message',
        hidden: true,
        children: [
            {
                path: 'index',
                name: 'message/index',
                component: _import('message/index'),
                meta: {title: '消息中心', icon: '消息中心'},
            }
        ]
    },
    {
        path: '/private',
        component: Layout,
        meta: {roles: ['ADMINISTRATOR', 'POLICE_OFFICER']},
        children: [
            {
                path: 'index',
                name: 'private/index',
                component: _import('private/index'),
                meta: {title: '个人中心'},
            }
        ],
        hidden: true
    },


    {path: '*', redirect: '/404', hidden: true}
]
