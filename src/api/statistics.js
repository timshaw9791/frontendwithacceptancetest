import request from 'common/js/request'
import {baseBURL} from "./config";

export function equipmentAmount(data) {
    return request({
        url: '/statistic/money',
        method: 'get',
        params: data
    })
}

export function equipmentScrapped(data) {
    return request({
        url: '/remind/need-scrap',
        method: 'get',
        params: data
    })
}
//单警柜佩戴率统计/statistic/cabinet-wearRate
export function cabinetWearRate(data) {
    return request({
        url: '/statistic/cabinet-wearRate',
        method: 'get',
        params: data
    })
}
export function equipmentScrappedInfo(data) {
    return request({
        url: '/remind/need-scrap/detail',
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
        url: `${baseBURL}/workflow-records/by-applicantId`,
        method: 'get',
        params: data
    })
}
