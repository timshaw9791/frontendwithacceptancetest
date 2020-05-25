import request from 'common/js/request'

// 耗材记录
export function findConsumableByName(data, state) {
    return request({
        url: '/consumableRecoed/findConsumableByName',
        method: 'get',
        params: data
    }, state)
}

// 领还记录

export function receiveReturnRecords(data, state) {
    return request({
        url: '/equipRecord/receiveReturnRecords',
        method: 'get',
        params: data
    }, state)
}

export function recorddetail(data) {
    return request({
        url: `/equipRecord/receive-return-record-detail/${data}`,
        method: 'get',
    }, false)
}

// 保养记录
export function findUpkeepStartTimeAndEndTimeBetweenAndOperatorLike(data, state) {
    return request({
        url: '/equipRecord/findUpkeepStartTimeAndEndTimeBetweenAndOperatorLike',
        method: 'get',
        params: data
    }, state)
}

// 充电记录
export function findChargeByStartTimeAndEndTimeBetweenAndArgsLike(data, state) {
    return request({
        url: '/equipRecord/findChargeByStartTimeAndEndTimeBetweenAndArgsLike',
        method: 'get',
        params: data
    }, state)
}


// 维修记录
export function findRepairByStartTimeAndEndTimeBetweenAndOperatorLike(data, state) {
    return request({
        url: '/equipRecord/findRepairByStartTimeAndEndTimeBetweenAndOperatorLike',
        method: 'get',
        params: data
    }, state)
}

// 盘点记录
export function findStartTimeAndEndTimeBetweenAndOperatorLike(data, state) {
    return request({
        url: '/equipRecord/findStartTimeAndEndTimeBetweenAndOperatorLike',
        method: 'get',
        params: data
    }, state)
}

// 报废记录
export function findScrapRecordByNameLike(data, state) {
    return request({
        url: '/equipRecord/findScrapRecordByNameLike',
        method: 'get',
        params: data
    }, state)
}

export function findNoReturn(data, state) {
    return request({
        url: '/equipRecord/findByNameLikeOrOperatorLike',
        method: 'get',
        params: data
    }, state)
}