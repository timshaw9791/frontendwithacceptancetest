import request from 'common/js/request'

export function getNeedCharge() {
    return request({
        url: '/equip/findneedchargeequips',
        method: 'get'
    }, false)
}

export function getNeedUpkeep(data, state) {
    return request({
        url: '/equip-remind/upkeep-need',
        method: 'get',
        params: data
    }, state)
}

export function findneedkeepEquips() {
    return request({
        url: '/equip/findneedkeepEquips',
        method: 'get',
    }, false)
}

