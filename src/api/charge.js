import request from 'common/js/request'

// 获取正在充电列表
export function getChargeList() {
    return request({
        url: '/equips/in-charge',
        method: 'get',
    })
}

// 获取需要充电列表
export function getNeedchargeList() {
    return request({
        url: '/equips/need-charge',
        method: 'get',
    })
}