import request from 'common/js/request'

// 获取耗材列表
export function getConsumableList(data, state) {
    return request({
        url: '/consumables',
        method: 'get',
        params: data
    }, state)
}
// 新增耗材
export function addConsumable(data, state) {
    return request({
        url: '/consumables',
        method: 'post',
        data:data
    }, state)
}

// 编辑耗材列表
export function editConsumable(id,data, state) {
    return request({
        url: `/consumables/${id}`,
        method: 'put',
        data:data
    }, state)
}

// 领取和补充耗材
export function receiveConsumable(params,data, state) {
    return request({
        url: `/consumables/consumable-order`,
        method: 'POST',
        params:params,
        data:data
    }, state)
}

// 耗材记录列表
export function consumableRecordList(params, state) {
    return request({
        url: `/consumable-orders`,
        method: 'GET',
        params:params
    }, state)
}