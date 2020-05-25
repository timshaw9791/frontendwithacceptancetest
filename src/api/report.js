import request from 'common/js/request'
var qs = require('qs')
//金额统计
export function findEquipMoneyStatistics(params) {
    return request({
        url: `/statistic/money?${qs.stringify(params,{indices:false})}`,
        method: 'get',
        // params:params
    })
}

//损耗统计
export function findEquipLossStatistics(params) {
    return request({
        url: `/statistic/loss?${qs.stringify(params,{indices:false})}`,
        method: 'get',
        // params:params
    })
}

//维修统计
export function findEquipRepairStatistics(params) {
    return request({
        url: `/statistic/repair?${qs.stringify(params,{indices:false})}`,
        method: 'get',
        // params:params
    })
}
//单警装备维修统计/statistic/cabinet-loss
export function cabinetLoss() {
    return request({
        url: "/statistic/cabinet-loss",
        method: 'get',
        // params:params
    })
}
export function cabinetLossCategories(id,search='') {
    return request({
        url: `/statistic/cabinet-loss-categories?category=${id}&search=${search}`,
        method: 'get',
        // params:params
    })
}
//报废统计
export function findEquipScrapStatistics(params) {
    return request({
        url: `/statistic/scrapStatistic?${qs.stringify(params,{indices:false})}`,
        method: 'get',
        // params:params
    })
}

//使用频次统计
export function findEquipFrequencyStatistics(params) {
    return request({
        url: `/statistic/frequencyStatistic?${qs.stringify(params,{indices:false})}`,
        method: 'get',
        // params:params
    })
}
export function findEquipMoneyStatistic(params) {
    return request({
        url: '/statistic/MoneyStatistic',
        method: 'get',
        params:params
    })
}
export function scrapStatistic(params) {
    return request({
        url: '/statistic/scrapStatistic',
        method: 'get',
        params:params
    })
}
export function frequencyStatistic(params) {
    return request({
        url: '/statistic/frequencyStatistic',
        method: 'get',
        params:params
    })
}
export function lossStatistic(params) {
    return request({
        url: '/statistic/lossStatistic',
        method: 'get',
        params:params
    })
}
export function repairStatistic(params) {
    return request({
        url: '/statistic/repairStatistic',
        method: 'get',
        params:params
    })
}


