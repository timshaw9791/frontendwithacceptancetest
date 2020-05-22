import request from 'common/js/request'

// 获取正在充电列表
export function getChargeList() {
    return request({
        url: '/remind/in-charge',
        method: 'get',
    })
}

// 获取需要充电列表
export function getNeedchargeList() {
    return request({
        url: '/remind/need-charge',
        method: 'get',
    })
}

// 获取充电记录列表
export function getchargeRecordList() {
    return request({
        url: '/charge-orders',
        method: 'get',
    })
}