import request from '../common/js/request'
// 装备参数相关接口

/* 查询装备参数  通过名称*/
export function getEpArgsList(params, state) {
    return request({
        url: "/equip-args",
        method: "GET",
        params
    }, state)
}

export function getEquipArgs() {
    return request({
        url: "/equip-args",
        method: "GET",
    }, false)
}

export function saveEquipArgs(data, state) {
    return request({
        url: "/equip-args",
        method: "POST",
        data
    }, state)
}

export function editEquipArgs(data, state) {
    return request({
        url: '/equip-args/'+data.id,
        method: "PUT",
        data
    }, state)
}