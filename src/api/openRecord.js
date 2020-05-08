import request from 'common/js/request'

export function openGateRecord(data) {
    return request({
        url: '/gate-records/operator',
        method: 'get',
        params: data
    })
}

export function openCabinetRecord(data) {
    return request({
        url: '/open-cabinet-records',
        method: 'get',
        params: data
    })
}