import request from '../common/js/request'
// 装备参数相关接口

/* 查询装备参数  通过名称*/
export function getEquipArgs(params) {
    return request({
        url: "/equip-args",
        method: "GET",
        params
    })
}