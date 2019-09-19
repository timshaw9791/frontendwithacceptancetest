import request from 'common/js/request'


export function equipmentAmount(data) {
    return request({
        url: '/statistic/genres/total',
        method: 'get',
        params: data
    })
}

export function equipmentScrapped(data) {
    return request({
        url: '/equips/need-scrap',
        method: 'get',
        params: data
    })
}


export function equipmentCharging(data) {
    return request({
        url: '/equips/need-upkeep-or-charge',
        method: 'get',
        params: data
    })
}


export function getProcess(data) {
    return request({
        url: '/workflow-records/by-applicantId',
        method: 'get',
        params: data
    })
}
