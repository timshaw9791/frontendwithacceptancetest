import request from 'common/js/request'

//金额统计
export function findEquipMoneyStatistics(params) {
    return request({
        url: '/statistic/money',
        method: 'get',
        params:params
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

export function getGenreList() {
    return request({
        url: '/genres/list',
        method: 'get'
    })
}
export function getCategoryList(params) {
    return request({
        url: '/categories/by-genreId',
        method: 'get',
        params:params
    })
}
export function getSafeStockList() {
    return request({
        url: '/house-stocks',
        method: 'get'
    })
}


