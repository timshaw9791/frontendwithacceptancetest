import request from '../common/js/request'
// 装备参数相关接口

/* 查询装备参数  通过名称*/
export function getEpArgsList(params) {
    return request({
        url: "/equip-args",
        method: "GET",
        params
    })
}

export function getEquipArgs() {
    return request({
        url: "/equip-args",
        method: "GET",
        params
    })
}
export function saveEquipArgs(data) {
    return request({
        url: "/equip-args",
        method: "POST",
        data
    })
}
export function editEquipArgs(data) {
    let id = JSON.stringify(data.id)
    return request({
        url: '/equip-args/'+id,
        method: "PUT",
        data
    })
}