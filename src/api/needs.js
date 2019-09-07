import request from 'common/js/request'

export function getNeedCharge(data) {
    return request({
        url: '/equip-remind/charge-need',
        method: 'get',
        params: data
    })
}

export function getNeedUpkeep(data) {
    return request({
        url: '/equip-remind/upkeep-need',
        method: 'get',
        params: data
    })
}