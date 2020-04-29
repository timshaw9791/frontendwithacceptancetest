import {asyncRouterMap, constantRouterMap} from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles//权限
 * @param route//路由
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role)); // 是否匹配路由权限
    } else {
        return true;
    }
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

function deepCopy(obj, cache = []) {
    function find(list, f) {
        return list.filter(f)[0]
    }
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    }
    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    })
    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })
    return copy
}


const permission = {
    state: {
        routers: deepCopy(constantRouterMap),
        addRouters: [],
        roles: [],
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes({commit}, data) {
            return new Promise(resolve => {
                let accessedRouters = filterAsyncRouter(deepCopy(asyncRouterMap), data);
                commit('SET_ROUTERS', accessedRouters);
                resolve(accessedRouters)
            })
        }
    }
}

export default permission
