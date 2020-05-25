import request from 'common/js/request'

export function openGateRecord(data, state) {
    return request({
        url: '/gate-records/operator',
        method: 'get',
        params: data
    }, state)
}

export function openCabinetRecord(data, state) {
    return request({
        url: '/open-cabinet-records',
        method: 'get',
        params: data
    }, state)
}