import request from 'common/js/request'

export function getNeedCharge() {
    return request({
        url: '/equip/findneedchargeequips',
        method: 'get'
    })
}

export function getNeedUpkeep(data) {
    return request({
        url: '/equip-remind/upkeep-need',
        method: 'get',
        params: data
    })
}