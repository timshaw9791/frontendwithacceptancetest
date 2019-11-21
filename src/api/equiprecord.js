import request from 'common/js/request'

export function findByTimeBetween(params) {
    return request({
        url: '/consumableRecoed/findByTimeBetween',
        method: 'get',
        params: params
    })
}

export function findConsumableByName(data) {
    return request({
        url: '/consumableRecoed/findConsumableByName',
        method: 'get',
        params: data
    })
}