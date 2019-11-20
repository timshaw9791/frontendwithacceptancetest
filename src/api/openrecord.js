import request from 'common/js/request'

export function gateOpenRecord(data) {
    return request({
        url: '/gateOpenRecord/findGateRecords',
        method: 'get',
        params: data
    })
}

export function findByTimeBetween(data) {
    return request({
        url: '/gateOpenRecord/findByTimeBetween',
        method: 'get',
        params: data
    })
}

export function findByOperatorName(data) {
    return request({
        url: '/gateOpenRecord/findByOperatorName',
        method: 'get',
        params: data
    })
}