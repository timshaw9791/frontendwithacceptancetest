import router, {asyncRouterMap} from "@/router";
import { getHouseInfo } from '@/api/warehouse'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles//权限
 * @param route//路由
 */
function hasPermission(roles, route) {
    return route.meta && route.meta.roles? route.meta.roles.includes(roles): true
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
    let res = []; // 存放权限匹配的路由
    routes.forEach(route => {
        const tmp = {...route}; // 深拷贝
        if (hasPermission(roles, tmp)) {
            if (tmp.children) { // 子路由递归判断
                tmp.children = filterAsyncRouter(tmp.children, roles);
            }
            res.push(tmp);
        }
    })
    return res;
}

// function deepCopy(obj, cache = []) {
//     function find(list, f) {
//         return list.filter(f)[0]
//     }
//     // just return if obj is immutable value
//     if (obj === null || typeof obj !== 'object') {
//         return obj
//     }
//     // if obj is hit, it is in circular structure
//     const hit = find(cache, c => c.original === obj)
//     if (hit) {
//         return hit.copy
//     }
//     const copy = Array.isArray(obj) ? [] : {}
//     // put the copy into cache at first
//     // because we want to refer it in recursive deepCopy
//     cache.push({
//         original: obj,
//         copy
//     })
//     Object.keys(obj).forEach(key => {
//         copy[key] = deepCopy(obj[key], cache)
//     })
//     return copy
// }

export default {
    state: {
        routers: []
    },
    mutations: {
        setRouters(state, routers) {
            state.routers = routers
        }
    },
    actions: {
        matchRouter({commit, getters, dispatch}, roles) {
            getHouseInfo().then(res => { // 获取所在库房信息
                commit('setOrganUnit', {id: res.organUnitId, name: res.organUnitName});
                commit('setWarehouse', {id: res.houseId, name: res.houseName})
                localStorage.setItem('houseInfo', JSON.stringify(res))
            })
            // 页面刷新后重新将user信息添加到VueX
            !getters.userInfo && commit('setUserInfo', JSON.parse(localStorage.getItem('user')))
            // 获取枚举数据
            dispatch('getAllEnums')
            return new Promise(function(reslove) {
                let tmpRouter = filterAsyncRouter(asyncRouterMap, false)
                router.addRoutes(tmpRouter)
                commit('setRouters', tmpRouter)
                reslove()
            })
        }
    }
}