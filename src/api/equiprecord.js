import request from 'common/js/request'

// 耗材记录
export function findConsumableByName(data) {
    return request({
        url: '/consumableRecoed/findConsumableByName',
        method: 'get',
        params: data
    })
}

// 领还记录

export function findByStartTimeAndEndTimeBetweenAndArgsLike(data) {
    return request({
        url: '/equipRecord/findByStartTimeAndEndTimeBetweenAndArgsLike',
        method: 'get',
        params: data
    })
}

// 保养记录
export function findUpkeepStartTimeAndEndTimeBetweenAndOperatorLike(data) {
    return request({
        url: '/equipRecord/findUpkeepStartTimeAndEndTimeBetweenAndOperatorLike',
        method: 'get',
        params: data
    })
}

// 充电记录
export function findChargeByStartTimeAndEndTimeBetweenAndArgsLike(data) {
    return request({
        url: '/equipRecord/findChargeByStartTimeAndEndTimeBetweenAndArgsLike',
        method: 'get',
        params: data
    })
}


// 维修记录
export function findRepairByStartTimeAndEndTimeBetweenAndOperatorLike(data) {
    return request({
        url: '/equipRecord/findRepairByStartTimeAndEndTimeBetweenAndOperatorLike',
        method: 'get',
        params: data
    })
}

// 盘点记录
export function findStartTimeAndEndTimeBetweenAndOperatorLike(data) {
    return request({
        url: '/equipRecord/findStartTimeAndEndTimeBetweenAndOperatorLike',
        method: 'get',
        params: data
    })
}
